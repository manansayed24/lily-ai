// // pages/api/chatgpt.ts

// import type { NextApiRequest, NextApiResponse } from 'next';
// import OpenAI from 'openai';

// // Check if Configuration is available (older versions might not have it as a named export)
// const { Configuration, OpenAIApi } = OpenAI as any;
// const configuration = Configuration ? new Configuration({ apiKey: process.env.OPENAI_API_KEY }) : { apiKey: process.env.OPENAI_API_KEY };
// const openai = OpenAIApi ? new OpenAIApi(configuration) : new OpenAI(configuration);

// type Data = {
//   message: string;
// };

// export  async function POST(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method !== 'POST') {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//     return;
//   }

//   const { prompt } = req.body;

//   if (!prompt) {
//     res.status(400).json({ message: 'Prompt is required' });
//     return;
//   }

//   try {
//     const response = await openai.createChatCompletion({
//       model: 'gpt-4', // You can use gpt-3.5-turbo or another model as needed
//       messages: [{ role: 'user', content: prompt }],
//     });

//     const message = response.data.choices[0].message?.content || 'No response';

//     res.status(200).json({ message });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }
// pages/api/chatgpt.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const { Configuration, OpenAIApi } = OpenAI as any;
const configuration = Configuration ? new Configuration({ apiKey: process.env.OPENAI_API_KEY }) : { apiKey: process.env.OPENAI_API_KEY };
// const openai = OpenAIApi ? new OpenAIApi(configuration) : new OpenAI(configuration);
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
type Data = {
  message: string;
};

export  async function POST(
  req: NextRequest,
  res: NextResponse<Data>
) {
//   if (req.method !== 'POST') {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//     return;
//   }

  const { prompt } =await req.json();

  // if (!prompt) {
  //   res.status(400).json({ message: 'Prompt is required' });
  //   return;
  // }

  try {
    console.log('Sending request to OpenAI API with prompt:', prompt);
    // const response = await openai.createChatCompletion({
    const response = await openai.chat.completions.create({
     model: "gpt-3.5-turbo-0125",
      messages: [{ role: 'user', content: prompt }],
    });

    // const message = response.data.choices[0].message?.content || 'No response';
    console.log('Received response from OpenAI API:', response.choices[0].message.content);
    const fixedStr = response.choices[0].message.content||'str'
  .replace(/'/g, '"') // Replace single quotes with double quotes
  .replace(/(\w+):/g, '"$1":') // Add double quotes around keys
  .replace(/,(\s*})/g, '$1'); // Remove trailing commas before closing braces
//   let questions = [];
// try {
//   const questions = JSON.parse(fixedStr);
//   console.log(questions);
// } catch (error) {
//   console.error('Error parsing JSON:', error);
// }
    // const fixedStr = response.choices[0].message.content.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
const questions=JSON.parse(fixedStr)
    // res.status(200).json({ message });
    // return NextResponse.json({ message: 'File updated successfully' });
    return NextResponse.json({questions});
  } catch (error) {
    console.error('Error occurred while calling OpenAI API:', error);
    // res.status(500).json({ message: 'Internal Server Error' });
    return NextResponse.json({ error:error }, { status: 500 });

  }
}
