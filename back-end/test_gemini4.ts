import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({});
  
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer AQ.Ab8RN6IXZteR7JQJl2ZEqdZFQsfPqHXB9A54C9y-yjJD6tajHg'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Diga "Ola"' }] }]
      })
    });
    const data = await res.json();
    console.log("Success with Bearer:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
