// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req: NextRequest) {
//   try {
//     const newDataArray = await req.json();
//     const filePath = path.join(process.cwd(), 'public', 'data.json');

//     // Read the current data from the file
//     const data = await fs.promises.readFile(filePath, 'utf8');
//     console.log('Current data:', newDataArray);

//     // Parse the current data
//     const jsonData = JSON.parse(data);

//     // Append the new data array to the current data
//     // const updatedData = [ ... newDataArray.questions];

//     // Write the updated data back to the file
//     await fs.promises.writeFile(filePath, JSON.stringify(newDataArray, null, 2));

//     return NextResponse.json({ message: 'File updated successfully' });
//   } catch (err:any) {
//     console.error('Error:', err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req: NextRequest) {
//   try {
//     const newDataArray = await req.json();
//     const filePath = path.join(process.cwd(), 'public', 'data.json');

//     // Read the current data from the file
//     const data = await fs.promises.readFile(filePath, 'utf8');
//     console.log('Current data:', newDataArray.questions);

//     // Parse the current data
//     const jsonData = JSON.parse(data);

//     // Append the new data array to the current data
//     const updatedData = [ ... newDataArray.questions];

//     // Write the updated data back to the file
//     await fs.promises.writeFile(filePath, JSON.stringify(updatedData, null, 2));

//     return NextResponse.json({ message: 'File updated successfully' });
//   } catch (err:any) {
//     console.error('Error:', err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// Helper to dynamically load 'fs' only on the server
async function getFsModule() {
  if (typeof window === 'undefined') {
    return await import('fs'); // Dynamic import of 'fs' only in Node.js
  }
  throw new Error('fs module can only be used server-side');
}

export async function POST(req: NextRequest) {
  try {
    const newDataArray = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'data.json');

    // Load 'fs' module dynamically
    const fs = await getFsModule();

    // Read the current data from the file
    const data = await fs.promises.readFile(filePath, 'utf8');
    console.log('Current data:', newDataArray);

    // Parse the current data
    const jsonData = JSON.parse(data);

    // Write the updated data back to the file
    await fs.promises.writeFile(filePath, JSON.stringify(newDataArray, null, 2));

    return NextResponse.json({ message: 'File updated successfully' });
  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
