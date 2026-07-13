import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ vertexai: { project: '484117829682', location: 'us-central1' } });
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: 'Diga "Ola"'
    });
    console.log("Success:", res.text);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
