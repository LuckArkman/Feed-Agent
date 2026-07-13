import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6IXZteR7JQJl2ZEqdZFQsfPqHXB9A54C9y-yjJD6tajHg' });
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
