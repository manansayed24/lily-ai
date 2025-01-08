import React, { useState } from "react";
import { useId } from "react";

const InterviewLink = ({ link }) => {
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => setCopySuccess("Link copied!"))
      .catch((err) => setCopySuccess("Failed to copy!"));
  };
  const randomId = useId();
  console.log("accvvxc", randomId);
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 bg-opacity-10 rounded-lg shadow-md mt-20">
      <h1>
        You can follow this link by pressing go button or just copy and paste{" "}
      </h1>
      <a
        href={`http://localhost:3000/interviewbot?id=${randomId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 mb-4"
      >
        {`http://localhost:3000/interviewbot?id=${randomId}`}
      </a>
      <div className="flex space-x-4">
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Copy Link
        </button>
        <a
          // href={`https://lili.linxap.com/interviewbot?id=${randomId}`}
          href={`http://localhost:3000/interviewbot?id=${randomId}`}
          // target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Go to Link
        </a>
      </div>
      {copySuccess && (
        <p className="mt-2 text-sm text-gray-600">{copySuccess}</p>
      )}
    </div>
  );
};

export default InterviewLink;
