// 'use client'
import React, { useEffect, useState } from "react";
import InterviewLink from "./InterviewLink";
import { useToast } from "../context/Toast";
import { getDocument } from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";
import "pdfjs-dist/build/pdf.worker.mjs";
import "../pdf-worker";
function InterviewForm() {
  const [file, setFile] = useState(null);
  const [updateData, setUpdateData] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [keyValues, setKeyValues] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job_title: "",
    resume: null,
    job_description: null,
    years_expriance: "",
  });
  console.log("qwrwer", updateData);
  const [fileNames, setFileNames] = useState({
    resume: "",
    job_description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [link, setLink] = useState("");
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setFileNames((prevNames) => ({
        ...prevNames,
        [name]: files[0].name,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  //   const handleChange = (e) => {
  //     const { name, value, files } = e.target;
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: files ? files[0] : value,
  //     }));
  //   };
  const handleDeselectFile = (fileName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fileName]: null,
    }));
    setFileNames((prevNames) => ({
      ...prevNames,
      [fileName]: "",
    }));
  };
  //asd
  // const extractTextFromPDF = async (file) => {
  //   const arrayBuffer = await file.arrayBuffer();
  //   const pdfDoc = await PDFDocument.load(arrayBuffer);
  //   const pages = pdfDoc.getPages();
  //   let text = '';

  //   for (let page of pages) {
  //     const pageText = await page.getTextContent();
  //     text += pageText.items.map(item => item.str).join(' ');
  //   }
  //   console.log('yuuuyu',text)

  //   return text;
  // };
  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      text += ` ${pageText}`;
    }

    console.log("asczxc", updateData);
    return text;
  };
  const extractKeyValues = (text) => {
    const nameMatch = text.match(
      /(?:Name|Full Name|Candidate|Applicant):?\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i
    );
    const emailMatch = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i
    );
    const phoneMatch = text.match(
      /(\+?\d{1,4}[\s-])?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/
    );

    return {
      name: nameMatch ? nameMatch[1] : "Not found",
      email: emailMatch ? emailMatch[0] : "Not found",
      phone: phoneMatch ? phoneMatch[0] : "Not found",
    };
  };
  const handleUpdate = async () => {
    console.log("upuopuii", updateData);
    const response = await fetch("/api/update-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(updateData),
      body: JSON.stringify(formData),
      // body: JSON.stringify([{
      //   "name": "John Foe",
      //   "age": 50,
      //   "city": "New Mixico"
      // },]),
    });

    const data = await response.json();
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //         setIsSubmitted(true)
  //     //     const formData  = new FormData();
  //     //     data.append('name', formData.name);
  //     //     data.append('email', formData.email);
  //     //     data.append('job_title', formData.job_title);
  //     //     if (formData.resume) data.append('resume', formData.resume);
  //     //     if (formData.job_description) data.append('job_description', formData.job_description);
  //     if (file) {
  //       const text = await extractTextFromPDF(file);
  //       setResumeText(text);
  //       const extractedValues = extractKeyValues(text);
  //     setKeyValues(extractedValues);
  //     }
  //     const prompt = `Take this information name: ${formData.name} job titel : ${formData.job_title} also Extracted resume text: ${resumeText}\n\nAdditional information: ${keyValues}\n\nGenerate 10 interview questions based on the above information.format the response as JSON `;

  //     const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${apiKey}`,
  //       },
  //       body: JSON.stringify({
  //         model: 'gpt-4-turbo',
  //         messages: [
  //           { role: 'system', content: 'You are an AI assistant that helps generate interview questions.' },
  //           { role: 'user', content: prompt }
  //         ],
  //         max_tokens: 150,
  //       }),
  //     });
  //     const data = await response.json();
  //     // const questions= await JSON.parse( data.choices[0].message.content)
  //     console.log('zcxawe:--',{ff: data.choices[0].message.content})
  //     setUpdateData(data.choices[0].message.content)
  //     handleUpdate()
  // };
  const shape = [
    {
      question:
        "Can you describe a complex AWS architecture you designed and implemented for a previous employer and discuss the specific AWS services you used?",
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (file) {
      const text = await extractTextFromPDF(file);
      setResumeText(text);
      const extractedValues = extractKeyValues(text);
      setKeyValues(extractedValues);
    }
    const prompt = `Take this information name: ${formData.name} job titel : ${formData.job_title} years of expiriance ${formData.years_expriance}also Extracted resume text: ${resumeText}\n\nAdditional information: ${keyValues}\n\nGenerate 10 interview questions based on the above information.format the response as JSON as a array of objects use this format: ${shape} `;
    const res = await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const res2 = await fetch("/api/brain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ occupation: `'DevOps Engineer'` }),
    });

    const data = await res.json();
    console.log("zcxawe:--", { ff: data?.questions, res });

    setUpdateData(data);
  };
  useEffect(() => {
    handleUpdate();
  }, [updateData]);

  return (
    <>
      {isSubmitted ? (
        <InterviewLink link={link} />
      ) : (
        <form
          className="max-w-lg mx-auto p-8 space-y-6 bg-white bg-opacity-10 shadow-lg rounded-lg"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-white ">Name</label>
            <input
              type="text"
              name="name"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-white">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div>
        <label className="block text-white">Message</label>
        <textarea
          name="message"
          className="mt-1 p-2 w-full border rounded-md"
          value={formData.message}
          onChange={handleChange}
        />
      </div> */}
          <div>
            <label className="block text-white">Job Title</label>
            <input
              type="job_title"
              name="job_title"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.job_title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-white">Years Of Expiriance</label>
            <input
              type="years_expriance"
              name="years_expriance"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.years_expriance}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-white">Resume</label>
            <input
              type="file"
              name="resume"
              accept="application/pdf"
              className="mt-1 p-2 w-full border rounded-md"
              // onChange={handleChange}
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            {fileNames.resume && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: {fileNames.resume}
                <button
                  type="button"
                  className="ml-2 text-red-600"
                  onClick={() => handleDeselectFile("resume")}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-white">Job Discription</label>
            <input
              type="file"
              name="job_description"
              accept="application/pdf"
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleChange}
              required
            />
            {fileNames.job_description && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: {fileNames.job_description}
                <button
                  type="button"
                  className="ml-2 text-red-600"
                  onClick={() => handleDeselectFile("job_description")}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Submit
          </button>
        </form>
      )}
    </>
  );
}

export default InterviewForm;
