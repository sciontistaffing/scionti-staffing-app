import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro-preview-tts",
      contents: [{ parts: [{ text: "Hello there! How are you?" }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" },
          },
        },
      },
    });
    console.log("Parts:", response.candidates?.[0]?.content?.parts);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

run();
