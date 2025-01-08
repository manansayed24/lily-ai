import { useRef, useState, useEffect } from 'react';

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    // Start recording as soon as the component mounts
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorderRef.current.ondataavailable = (event) => {
          chunks.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunks.current, { type: 'video/webm' });
          chunks.current = [];
          setMediaBlob(blob);

          // Create a preview URL for the recorded video
          const preview = URL.createObjectURL(blob);
          setPreviewUrl(preview);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    startRecording();

    // Cleanup on component unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const uploadRecording = async () => {
    // Stop the recording when submitting
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }

    if (!mediaBlob) return;

    const formData = new FormData();
    formData.append('file', mediaBlob, 'recording.webm');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('Upload successful');
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading the recording', error);
    }
  };

  return (
    <div style={{width:'500px',marginLeft:'350px'}}>
      {!previewUrl&&

      <video ref={videoRef} autoPlay playsInline muted></video>
      }
      {previewUrl && (
        <div>
          <h3  className="px-6 border-sky-950 py-3 text-white font-bold bg-blue-500 rounded-md hover:bg-blue-600 active:bg-blue-700 transition transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
  type="submit">Recording Preview</h3>
          <video src={previewUrl} controls />
        </div>
      )}
        {!previewUrl&&
        <button  className="px-6 py-3 text-white font-bold bg-blue-500 rounded-md hover:bg-blue-600 active:bg-blue-700 transition transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
        type="submit" onClick={uploadRecording}>Submit Interview</button>
        }
    </div>
  );
}
