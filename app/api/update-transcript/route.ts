import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const newDataArray = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'transcript.json');

    // Read the current data from the file
    const data = await fs.promises.readFile(filePath, 'utf8');
    console.log('Current data:', newDataArray);

    // Parse the current data
    const jsonData = JSON.parse(data);

    // Append the new data array to the current data
    const updatedData = [ ... newDataArray];

    // Write the updated data back to the file
    await fs.promises.writeFile(filePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({ message: 'File updated successfully' });
  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
// import { NextRequest, NextResponse } from 'next/server';

// // Helper to dynamically load 'fs' and 'path' modules only on the server
// async function getNodeModules() {
//   if (typeof window === 'undefined') {
//     const fs = await import('fs'); // Dynamically import 'fs'
//     const path = await import('path'); // Dynamically import 'path'
//     return { fs, path };
//   }
//   throw new Error('Node.js modules can only be used server-side');
// }

// export async function POST(req: NextRequest) {
//   try {
//     const newDataArray = await req.json();

//     // Load Node.js modules dynamically
//     const { fs, path } = await getNodeModules();
//     const filePath = path.join(process.cwd(), 'public', 'transcript.json');

//     // Read the current data from the file
//     const data = await fs.promises.readFile(filePath, 'utf8');
//     console.log('Current data:', newDataArray);

//     // Parse the current data
//     const jsonData = JSON.parse(data);

//     // Append the new data array to the current data (if needed)
//     const updatedData = [...jsonData, ...newDataArray];

//     // Write the updated data back to the file
//     await fs.promises.writeFile(filePath, JSON.stringify(updatedData, null, 2));

//     return NextResponse.json({ message: 'File updated successfully' });
//   } catch (err: any) {
//     console.error('Error:', err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
