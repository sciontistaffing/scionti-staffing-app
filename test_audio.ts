import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  try {
    const text = "Hello again, this is Sophia testing the upgraded voice API.";
    const voice = "Zephyr";
    console.log("Testing gemini-3.1-flash-tts-preview...");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ role: "user", parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
        },
      },
    });
    console.log("Mimetype:", response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType);
    console.log("Text:", response.text);
  } catch (error: any) {
    console.error("Exact TTS Error:", error.message);
  }
}
test();
