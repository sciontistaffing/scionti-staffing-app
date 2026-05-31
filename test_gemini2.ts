import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: "Hello" }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { messages: { type: Type.ARRAY, items: { type: Type.STRING } } },
        }
      }
    });
    console.log(response.text);
  } catch(e) {
    console.error("ERROR HAPPENED:", e);
  }
}
run();
