import { config } from 'dotenv';
config({ path: '.env' });
import geminiService from './src/services/GeminiService';

async function test() {
  try {
    const res = await geminiService.generateCompletion('Diga "Ola Mundo!"');
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
