"use client";

import {
  LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";
import Recorder from "./VideoRec";
import { Message, useChat } from "ai/react";
import { NextUIProvider } from "@nextui-org/react";
import { useMicVAD } from "@ricky0123/vad-react";
import { useNowPlaying } from "react-nowplaying";
import { useQueue } from "@uidotdev/usehooks";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

import { ChatBubble } from "./ChatBubble";
import {
  contextualGreeting,
  generateRandomString,
  utteranceText,
} from "../lib/helpers";
import { Controls } from "./Controls";
import { InitialLoad } from "./InitialLoad";
import { MessageMetadata } from "../lib/types";
import { RightBubble } from "./RightBubble";
import { systemContent } from "../lib/constants";
import { useDeepgram, voiceMap } from "../context/Deepgram";
import { useMessageData } from "../context/MessageMetadata";
import { useMicrophone } from "../context/Microphone";
import { useAudioStore } from "../context/AudioStore";

/**
 * Conversation element that contains the conversational AI app.
 * @returns {JSX.Element}
 */
export default function Conversation(): JSX.Element {
  /**
   * Custom context providers
   */
  const { ttsOptions, connection, connectionReady } = useDeepgram();
  const { addAudio, audioStore } = useAudioStore();
  const { player, stop: stopAudio, play: startAudio } = useNowPlaying();
  const { addMessageData } = useMessageData();
  const {
    microphoneOpen,
    queue: microphoneQueue,
    queueSize: microphoneQueueSize,
    firstBlob,
    removeBlob,
    stream,
  } = useMicrophone();

  /**
   * Queues
   */
  const {
    add: addTranscriptPart,
    queue: transcriptParts,
    clear: clearTranscriptParts,
  } = useQueue<{ is_final: boolean; speech_final: boolean; text: string }>([]);

  /**
   * Refs
   */
  const messageMarker = useRef<null | HTMLDivElement>(null);
  /**
   * State
   */
  const [initialLoad, setInitialLoad] = useState(true);
  const [isProcessing, setProcessing] = useState(false);
  const [questions, setQuestions] = useState([]);
  console.log("asdasd", questions);
  /**
   * Request audio from API
   */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  useEffect(() => {
    if (initialLoad)
      fetch("/data.json")
        .then((response) => response.json())
        .then((data) => setQuestions(data));
  }, []);
  // const questions = [
  //   {
  //     "question": "Can you describe a complex AWS architecture you designed and implemented for a previous employer and discuss the specific AWS services you used?"
  //   },
  //   {
  //     "question": "You mentioned achieving a 50% cost reduction with a previous project. What strategies did you employ to achieve such significant savings?"
  //   },
  //   {
  //     "question": "As a Linux Server Administrator, what were the most challenging server issues you faced, and how did you resolve them?"
  //   },
  //   {
  //     "question": "You've been awarded 'Best Employee of the Month' previously. What contributions or actions do you believe led to this recognition?"
  //   }
  // ];

  const requestTtsAudio = useCallback(
    async (message: Message) => {
      // const text={
      //     "id": "No7YXa8",
      //     "role": "assistant",
      //     // "content": "Good evening! -this is sayed manan"
      //     "content": questions[currentQuestionIndex].question
      //   }
      const start = Date.now();
      const model = ttsOptions?.model ?? "aura-asteria-en";

      const res = await fetch(`/api/speak?model=${model}`, {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify(message),
        // body: JSON.stringify(text),
      });

      const headers = res.headers;

      const blob = await res.blob();

      startAudio(blob, "audio/mp3", message.id).then(() => {
        addAudio({
          id: message.id,
          blob,
          latency: Number(headers.get("X-DG-Latency")) ?? Date.now() - start,
          networkLatency: Date.now() - start,
          model,
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ttsOptions?.model, currentQuestionIndex]
  );

  const [llmNewLatency, setLlmNewLatency] = useState<{
    start: number;
    response: number;
  }>();

  //   const onFinish = useCallback(
  //     (msg: any) => {
  // // msg.content= questions[currentQuestionIndex].question
  //       requestTtsAudio(msg);
  //     },
  //     [requestTtsAudio]
  //   );
  const onFinish = useCallback(
    (msg: any) => {
      // msg.content= questions[currentQuestionIndex].question
      requestTtsAudio(msg);
    },
    [requestTtsAudio]
  );

  const onResponse = useCallback((res: Response) => {
    (async () => {
      setLlmNewLatency({
        start: Number(res.headers.get("x-llm-start")),
        response: Number(res.headers.get("x-llm-response")),
      });
    })();
  }, []);

  const systemMessage: Message = useMemo(
    () => ({
      id: generateRandomString(7),
      role: "system",
      content: systemContent,
    }),
    []
  );

  const greetingMessage: Message = useMemo(
    () => ({
      id: generateRandomString(7),
      role: "assistant",
      // content: contextualGreeting(),
      content:
        "Hey Hi Welcome to Linx Youer Interview Begains please Say Start When ready ",
    }),
    []
  );

  /**
   * AI SDK
   */
  const {
    messages: chatMessages,
    append,
    handleInputChange,
    input,
    handleSubmit,
    isLoading: llmLoading,
  } = useChat({
    id: "aura",
    api: "/api/brain",
    initialMessages: [systemMessage, greetingMessage],
    onFinish,
    onResponse,
    body: { occupation: questions },
  });
  console.log("asxzc", chatMessages);
  // useEffect(() => {
  //   if (currentQuestionIndex < questions.length) {
  //     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  //   }
  // }, [chatMessages]);
  const [currentUtterance, setCurrentUtterance] = useState<string>();
  const [failsafeTimeout, setFailsafeTimeout] = useState<NodeJS.Timeout>();
  const [failsafeTriggered, setFailsafeTriggered] = useState<boolean>(false);

  const onSpeechEnd = useCallback(() => {
    /**
     * We have the audio data context available in VAD
     * even before we start sending it to deepgram.
     * So ignore any VAD events before we "open" the mic.
     */
    if (!microphoneOpen) return;

    setFailsafeTimeout(
      setTimeout(() => {
        if (currentUtterance) {
          console.log("failsafe fires! pew pew!!");
          setFailsafeTriggered(true);
          append({
            role: "user",
            content: currentUtterance,
          });
          clearTranscriptParts();
          setCurrentUtterance(undefined);
        }
      }, 1500)
    );

    return () => {
      clearTimeout(failsafeTimeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneOpen, currentUtterance]);

  const onSpeechStart = () => {
    /**
     * We have the audio data context available in VAD
     * even before we start sending it to deepgram.
     * So ignore any VAD events before we "open" the mic.
     */
    if (!microphoneOpen) return;

    /**
     * We we're talking again, we want to wait for a transcript.
     */
    setFailsafeTriggered(false);

    if (!player?.ended) {
      stopAudio();
      console.log("barging in! SHH!");
    }
  };

  useMicVAD({
    startOnLoad: true,
    stream,
    onSpeechStart,
    onSpeechEnd,
    positiveSpeechThreshold: 0.6,
    negativeSpeechThreshold: 0.6 - 0.15,
  });

  useEffect(() => {
    if (llmLoading) return;
    if (!llmNewLatency) return;

    const latestLlmMessage: MessageMetadata = {
      ...chatMessages[chatMessages.length - 1],
      ...llmNewLatency,
      end: Date.now(),
      ttsModel: ttsOptions?.model,
    };

    addMessageData(latestLlmMessage);
  }, [
    chatMessages,
    llmNewLatency,
    setLlmNewLatency,
    llmLoading,
    addMessageData,
    ttsOptions?.model,
  ]);

  /**
   * Contextual functions
   */
  const requestWelcomeAudio = useCallback(async () => {
    requestTtsAudio(greetingMessage);
  }, [greetingMessage, requestTtsAudio]);

  const startConversation = useCallback(() => {
    if (!initialLoad) return;

    setInitialLoad(false);

    // add a stub message data with no latency
    const welcomeMetadata: MessageMetadata = {
      ...greetingMessage,
      ttsModel: ttsOptions?.model,
    };

    addMessageData(welcomeMetadata);

    // get welcome audio
    requestWelcomeAudio();
  }, [
    addMessageData,
    greetingMessage,
    initialLoad,
    requestWelcomeAudio,
    ttsOptions?.model,
  ]);

  useEffect(() => {
    const onTranscript = (data: LiveTranscriptionEvent) => {
      let content = utteranceText(data);

      // i only want an empty transcript part if it is speech_final
      if (content !== "" || data.speech_final) {
        /**
         * use an outbound message queue to build up the unsent utterance
         */
        addTranscriptPart({
          is_final: data.is_final as boolean,
          speech_final: data.speech_final as boolean,
          text: content,
        });
      }
    };

    const onOpen = (connection: LiveClient) => {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
    };

    if (connection) {
      connection.addListener(LiveTranscriptionEvents.Open, onOpen);
    }

    return () => {
      connection?.removeListener(LiveTranscriptionEvents.Open, onOpen);
      connection?.removeListener(
        LiveTranscriptionEvents.Transcript,
        onTranscript
      );
    };
  }, [addTranscriptPart, connection]);

  const getCurrentUtterance = useCallback(() => {
    return transcriptParts.filter(({ is_final, speech_final }, i, arr) => {
      return is_final || speech_final || (!is_final && i === arr.length - 1);
    });
  }, [transcriptParts]);

  const [lastUtterance, setLastUtterance] = useState<number>();
  useEffect(() => {
    const parts = getCurrentUtterance();
    const last = parts[parts.length - 1];
    const content = parts
      .map(({ text }) => text)
      .join(" ")
      .trim();

    /**
     * if the entire utterance is empty, don't go any further
     * for example, many many many empty transcription responses
     */
    if (!content) return;

    /**
     * failsafe was triggered since we last sent a message to TTS
     */
    if (failsafeTriggered) {
      clearTranscriptParts();
      setCurrentUtterance(undefined);
      return;
    }

    /**
     * display the concatenated utterances
     */
    setCurrentUtterance(content);

    /**
     * record the last time we recieved a word
     */
    if (last.text !== "") {
      setLastUtterance(Date.now());
      // console.log('zxwqew---------')
    }

    /**
     * if the last part of the utterance, empty or not, is speech_final, send to the LLM.
     */
    if (last && last.speech_final) {
      if (currentQuestionIndex < questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
      console.log("zxwqew---------", content, currentQuestionIndex);
      clearTimeout(failsafeTimeout);
      append({
        role: "user",
        content,
      });
      clearTranscriptParts();
      setCurrentUtterance(undefined);
    }
  }, [
    getCurrentUtterance,
    clearTranscriptParts,
    append,
    failsafeTimeout,
    failsafeTriggered,
  ]);

  /**
   * magic microphone audio queue processing
   */
  useEffect(() => {
    const processQueue = async () => {
      if (microphoneQueueSize > 0 && !isProcessing) {
        setProcessing(true);

        if (connectionReady) {
          const nextBlob = firstBlob;

          if (nextBlob && nextBlob?.size > 0) {
            connection?.send(nextBlob);
          }

          removeBlob();
        }

        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          setProcessing(false);
        }, 200);
      }
    };

    processQueue();
  }, [
    connection,
    microphoneQueue,
    removeBlob,
    firstBlob,
    microphoneQueueSize,
    isProcessing,
    connectionReady,
  ]);

  /**
   * keep deepgram connection alive when mic closed
   */
  useEffect(() => {
    let keepAlive: any;
    if (connection && connectionReady && !microphoneOpen) {
      keepAlive = setInterval(() => {
        // should stop spamming dev console when working on frontend in devmode
        if (connection?.getReadyState() !== LiveConnectionState.OPEN) {
          clearInterval(keepAlive);
        } else {
          connection.keepAlive();
        }
      }, 10000);
    } else {
      clearInterval(keepAlive);
    }

    // prevent duplicate timeouts
    return () => {
      clearInterval(keepAlive);
    };
  }, [connection, connectionReady, microphoneOpen]);

  // this works
  useEffect(() => {
    if (messageMarker.current) {
      messageMarker.current.scrollIntoView({
        behavior: "auto",
      });
    }
  }, [chatMessages]);
  console.log("zxcczxczxc", { asdscx: chatMessages });
  const context = chatMessages
    .filter((m) => ["user", "assistant"].includes(m.role))
    .map((m) => {
      if (m.role === "assistant") {
        const foundAudio = audioStore.findLast((item) => item.id === m.id);
        const voice = foundAudio?.model
          ? voiceMap(foundAudio?.model).name
          : "Deepgram";

        return `${voice ?? "Asteria"}: ${m.content}`;
      }

      if (m.role === "user") {
        return `User: ${m.content}`;
      }
    });
  const context1 = chatMessages.filter((m) =>
    ["user", "assistant"].includes(m.role)
  );
  console.log("bbbbbbbbddd", { asdscx: context1, context: context });
  const handleUpdate = async () => {
    console.log("upuopuii", context);
    const response = await fetch("/api/update-transcript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(context1),
      // body: JSON.stringify([{
      //   "name": "John Foe",
      //   "age": 50,
      //   "city": "New Mixico"
      // },]),
    });
    const data = await response.json();
  };
  useEffect(() => {
    if (currentQuestionIndex > 2 && currentQuestionIndex < 5) handleUpdate();
  }, [chatMessages]);

  return (
    <>
      <NextUIProvider className="h-full">
        <div className="flex h-full antialiased">
          <div className="flex flex-row h-full w-full overflow-x-hidden">
            <div className="flex flex-col flex-auto h-full">
              <div className="flex flex-col justify-between h-full">
                <div
                  className={`flex flex-col h-full overflow-hidden ${
                    initialLoad ? "justify-center" : "justify-end"
                  } ${!initialLoad ? "hidden" : "visible"}`}
                >
                  <div className="grid grid-cols-12 overflow-x-auto gap-y-2">
                    {initialLoad ? (
                      <InitialLoad
                        fn={startConversation}
                        connecting={!connection}
                      />
                    ) : (
                      <>
                        {/* {chatMessages.length > 0 &&
                          chatMessages.map((message, i) => (
                            <ChatBubble message={message} key={i} />
                          ))}

                        {currentUtterance && (
                          <RightBubble text={currentUtterance}></RightBubble>
                        )}

                        <div
                          className="h-16 col-start-1 col-end-13"
                          ref={messageMarker}
                        ></div> */}
                      </>
                    )}
                  </div>
                </div>
                {!initialLoad && (
                  <Controls
                    messages={chatMessages}
                    handleSubmit={handleSubmit}
                    handleInputChange={handleInputChange}
                    input={input}
                  />
                )}
                {/* <Recorder/> */}
              </div>
            </div>
          </div>
        </div>
      </NextUIProvider>
    </>
  );
}
