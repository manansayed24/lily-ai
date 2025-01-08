// import OpenAI from "openai";
// import { OpenAIStream, StreamingTextResponse } from "ai";

// // Optional, but recommended: run on the edge runtime.
// // See https://vercel.com/docs/concepts/functions/edge-functions
// export const runtime = "edge";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function POST(req: Request) {
//   // Extract the `messages` from the body of the request
//   const { messages } = await req.json();
//   const start = Date.now();

//   // Request the OpenAI API for the response based on the prompt
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo-0125",
//       stream: true,
//       messages: messages,
//     });

//     const stream = OpenAIStream(response);

//     return new StreamingTextResponse(stream, {
//       headers: {
//         "X-LLM-Start": `${start}`,
//         "X-LLM-Response": `${Date.now()}`,
//       },
//     });
//   } catch (error) {
//     console.error("test", error);
//   }
// }

//============================================*************=============================================//
// import OpenAI from "openai";
// import { OpenAIStream, StreamingTextResponse } from "ai";

// // Optional, but recommended: run on the edge runtime.
// // See https://vercel.com/docs/concepts/functions/edge-functions
// export const runtime = "edge";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function POST(req: Request) {
//   // Extract the `messages` from the body of the request
//   const { messages,occupation } = await req.json();
  
//   // const { body } = await req.json();
//   console.log('called in brain Occupation=========::::::------------',occupation	)
//   const start = Date.now();

//   // Request the OpenAI API for the response based on the prompt
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo-0125",
//       stream: true,
//       messages:[
//         // { role: 'system', content: `you are a interviewer who asks questions for a ${occupation} having 3 years of experience` },
//         { role: 'system', content: `Act as interviewer who asks questions for a occupation of ${occupation?.job_title} having ${occupation?.years_expriance} years of experience /n ask one by one qustiions always wait for response /n ask only 4 qustions thne say  interview is finshed close this browser tab /n don't after this repete this again` },
//         ...messages,
//         // { role: 'user', content: prompt }
//       ],
//     });

//     const stream = OpenAIStream(response);

//     return new StreamingTextResponse(stream, {
//       headers: {
//         "X-LLM-Start": `${start}`,
//         "X-LLM-Response": `${Date.now()}`,
//       },
//     });
//   } catch (error) {
//     console.error("test", error);
//   }
// }
//=================================*******************===============//



import { OpenAI } from "openai";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  // Extract the `messages` and `occupation` from the body of the request
  const { messages, occupation } = await req.json();

  console.log("Occupation=========::::::------------", occupation);
  const start = Date.now();

  try {
    // Request the OpenAI API for the response based on the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      stream: true,
      messages: [
        {
          role: "system",
          content: `Act as an interviewer who asks questions for the occupation of ${occupation?.job_title} having ${occupation?.years_expriance} years of experience.\nAsk one question at a time, always wait for a response.\nAsk only 4 questions, then say "Interview is finished, close this browser tab."\nDo not repeat this again after completing the interview.`,
        },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          // Each chunk is a ChatCompletionChunk object
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "X-LLM-Start": `${start}`,
        "X-LLM-Response": `${Date.now()}`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch response." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
