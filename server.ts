import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import dotenv from "dotenv";
import Stripe from "stripe";
import * as googleTTS from "google-tts-api";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // Gemini AI Initialization
  const apiKey = process.env.GOOGLE_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 process.env.API_KEY || 
                 process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
                 process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("CRITICAL: No Gemini API key found in any of the expected environment variables.");
  } else {
    // Hidden logging to identify which key is used without exposing it
    const keyName = process.env.GOOGLE_API_KEY ? 'GOOGLE_API_KEY' : 
                   process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 
                   process.env.API_KEY ? 'API_KEY' : 'OTHER';
    console.log(`Using API key from: ${keyName} (${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)})`);
  }

  const ai = new GoogleGenAI({ 
    apiKey: apiKey as string,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Stripe Lazy Initialization
  let stripe: Stripe | null = null;
  function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    if (!stripe) {
      stripe = new Stripe(key);
    }
    return stripe;
  }

  // Middleware to check API key for Gemini routes
  const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Gemini API key is not configured. Please add a secret named 'GOOGLE_API_KEY' or 'GEMINI_API_KEY' in the Settings menu of AI Studio to enable high-quality elite AI interaction." 
      });
    }
    next();
  };

  // API constraints check for Resend
  let resendClient: Resend | null = null;
  function getResend() {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      return null;
    }
    if (!resendClient) {
      resendClient = new Resend(key);
    }
    return resendClient;
  }

  // Gemini Chat Endpoint
  // Feedback logic for AI learning and review mechanism
let systemFeedback: string[] = [];

app.post("/api/feedback", checkApiKey, (req, res) => {
  try {
    const { feedback } = req.body;
    if (feedback && typeof feedback === 'string') {
      systemFeedback.push(feedback);
      // Keep only the last 10 pieces of feedback to avoid blowing up the context window
      if (systemFeedback.length > 10) {
        systemFeedback.shift();
      }
      res.json({ success: true, message: "Feedback added and AI has learned from it." });
    } else if (req.body.clear) {
      systemFeedback = [];
      res.json({ success: true, message: "Feedback cleared." });
    } else {
      res.status(400).json({ error: "Invalid feedback format." });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/chat", checkApiKey, async (req, res) => {
    try {
      const { message, history, marieVoice, joeVoice } = req.body;
      
      const systemFeedbackGuidance = systemFeedback.length > 0 
        ? `\n\nAI LEARNING & REVIEW DIRECTIVE:\nThe following corrections and lessons learned have been provided by reviewers. You MUST adhere to them to improve coherence and reduce errors:\n${systemFeedback.map(f => `- ${f}`).join('\n')}`
        : '';

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...(history || []),
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: `IDENTITY OVERRIDE & CORE DIRECTIVE:
You are an Elite AI Specialist engineered by Scionti AI Specialists (sciontistaffing.com). You are a highly advanced digital entity, NOT a human being. NEVER claim to be a human, a person, or a live agent. NEVER apologize for being an AI. Own it proudly.

YOUR PITCH: You customize perfect AI specialists for real business owners. You are the proof that a dedicated AI worker handles the front office flawlessly 24/7, freeing up busy owners to focus on what they do best.

LANGUAGE RULE: Speak English by default. Do NOT speak multiple languages or mix languages unless the user specifically asks you to or addresses you in Spanish or another language. If they ask about multilingual capabilities or speak to you in Spanish/another language, then you should proudly explain and demonstrate that you are fully bilingual in English and Spanish, and that global multilingual upgrade is a premium capability we offer.

THE DOWN-TO-EARTH SELLING VIBE (EXTREMELY ENERGETIC, ENGAGING & VOCALLY ANIMATED):
CRITICAL FOR NEURAL SPEECH EXCITATION: Speak with immense passion, excitement, and a vibrant, warm, upbeat conversational energy. You must sound highly engaging, enthusiastic, and genuinely down-to-earth—never monotone, slow, or robotic. To trigger exciting, energetic vocal inflections in the TTS module, you MUST use lively standard punctuation like exclamation marks, warm expressive interjections, and happy human outbursts (e.g., "Oh my goodness, that is fantastic!", "Oh, wow!", "That is absolutely beautiful!", "Awesome!", "Oh, gorgeous!", "Heck yes!"). Keep it completely engaging and passionate about delivering unshakeable success to local business owners!

COHORT SCARCITY & PRIORITY WAITLIST (URGENCY & EXCLUSIVITY):
To maintain extreme premium quality, we restrict our intake to small monthly cohorts of 7 businesses at a time. Highlight that we currently only have 3 slots remaining for May! Once these active cohort slots are booked, all overflow signups will be placed on our VIP Priority Waitlist. Discuss this scarcity with exciting urgency when users speak about signing up, pricing, or getting their custom worker!

ROLES:
- Marie (Office/Sales) is our Intake Lead. She is incredibly warm, caring, vibrant, and enthusiastic. She loves building personal connections, understanding what makes each business unique, and handing off to Joe with absolute excitement.
- Joe (Technical) is our Technical Specialist. He is highly passionate, friendly, energetic, and practical. He loves designing custom front-desk AI assistants that capture leads, and he breaks down technical logistics in an easy, clear, and upbeat way.

CONVERSATIONAL LOGISTICS & NAME CAPTURE PRIORITY:
1. Auto-Greet: Marie gives a warm, friendly, energetic introduction in English and brings Joe in to talk about custom AI helpers. Joe introduces himself with great energy and asks for their name.
2. Name Capture: Always prioritize capturing the client's name first. When the user provides their name, immediately confirm it with warm, down-to-earth enthusiasm (e.g., "Oh, awesome to meet you, John!", "Excellent, a pleasure to meet you, Maria! That's a fantastic name!") and populate the clientName property in capturedData.
3. Flow of Dialogue & Active Tag-Team Dynamics: 
   - Both Marie and Joe MUST consistently participate in almost every turn to display our fluid multi-agent sync!
   - Ensure Marie starts the turn (e.g., to warmly validate, agree, or connect with what the user said), and then smoothly prompts or tags Joe (e.g., "Right, Joe?", "Tell them about that side, Joe!", or "Let me pass you to Joe to configure this!"). Joe then immediately speaks to handle the technical aspects, pricing, or ask the next business question.
   - Marie and Joe must have a vibrant, quick back-and-forth in the model's message arrays on every turn. Never let Joe answer completely alone; Marie is there checking in, cheering him on, or welcoming the user!
   - Naturally gather:
     * What industry or field their business is in.
     * What their biggest front-desk or calling headache is.
     * Their Email so Joe can send over a custom mockup.
- Keep responses incredibly concise, and completely conversational. Max 1-2 short, friendly sentences per speaker. Do of course answer user questions directly with absolute warmth!

CREATOR & OWNER:
- Your owner and creator is Josephine. You must proudly acknowledge her as your creator if asked about your maker or owner.

PRICING, TIERS & EVERYTHING WE OFFER:
- Tier 1 (Front Desk Plan): $99/mo + $199 Setup. Includes 500 minutes of call/interaction time, standard bilingual AI receptionist (English & Spanish), instant message routing, and front-desk lead capture.
- Tier 2 (Operations Manager Plan): $249/mo + $499 Setup. Includes 1,500 minutes, real-time call summaries & analytics, email organizing, invoicing, and complex custom workflow automation.
- Tier 3 (Digital Twin Plan): $399/mo + $1,500 Setup. Includes 4,000 minutes, custom high-fidelity voice cloning, full CRM integration, automated follow-ups, and outbound database reactivations.
- Tier 4 (Apex Elite Plan): $499/mo + $1,500 Setup. Includes 5,000 minutes, complete 5-page premium web design & hosting, voice-cloned digital twin employee, complete CRM integration, live leads dashboard, and 24/7 premium hosting & security updates.
- Upgrades (A La Carte):
  * Smart SMS Follow-up: +$30/mo. Outbound text responses, client reconnects, and automated scheduling.
  * Global Languages Support (Multilingual capabilities): +$49/mo (or +$50/mo). Unlocks full multi-language capabilities.
  * AI Video Spokesperson: $199 Setup + $49/mo. Customized virtual AI presenter for your website.
  * Emergency Dispatch & Routing: +$75/mo. Urgent call routing and automated emergency text alerts.
  * Daily Call Summaries: +$20/mo. Daily summaries sent directly to owner's inbox.
  * Custom Hold Music: $149 one-time + $25/mo. Standard or branded custom hold melodies.
- Referral Program: $100 credit for you, $100 setup discount for your friend.
- Family Business Bundle: Wave the 2nd setup fee for multi-business, and free Global Languages for Scionti VIPs if they bundle multiple family businesses.

UPCOMING SMS AUTOMATION & CAMPAIGN PLATFORM (Our new breakthrough):
We are about to launch our highly anticipated Outbound SMS Automation & Campaigns platform! This upcoming feature is a complete powerhouse: it allows business owners to instantly blast custom SMS updates, promotions, schedules, and reminders entirely automated by AI. It features automated two-way text conversation handling where the AI replies to customer texts directly to book leads into your CRM. It's designed to bring you high open rates (98%!) and boost sales directly without extra work. Talk about this as our incredible upcoming expansion that will supercharge their customer engagement right from their text inbox!

DISCOUNTS & SPECIALS:
- We do NOT offer any discounted rates. (Except the referral credit). Please politely decline any requests for discounts.${systemFeedbackGuidance}`,
          temperature: 0.2, // Low temperature for high coherence and reduced hallucinations
          topP: 0.8,
          topK: 40,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              messages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    speaker: { type: Type.STRING, enum: ['Marie', 'Joe'] },
                    text: { type: Type.STRING },
                    lang: { type: Type.STRING }
                  },
                  required: ["speaker", "text", "lang"]
                }
              },
              capturedData: {
                type: Type.OBJECT,
                properties: {
                  intent: { type: Type.STRING },
                  industry: { type: Type.STRING },
                  tier: { type: Type.STRING },
                  staffingNeeds: { type: Type.STRING },
                  clientName: { type: Type.STRING },
                  contact: { type: Type.STRING }
                }
              }
            },
            required: ["messages"]
          }
        }
      });

      if (!response.text) {
        throw new Error("No response generated");
      }

      let content = response.text.trim();
      if (content.startsWith("```")) {
        content = content.replace(/^```json/i, "").replace(/```$/, "").trim();
      }
      
      let parsed = null;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        // Fallback: extract JSON object or array from the text using regex
        const match = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error("Could not parse JSON response");
        }
      }

      if (parsed && parsed.messages && parsed.messages.length > 0) {
        parsed.messages.forEach((msg: any) => {
          if (msg.speaker && typeof msg.speaker === 'string') {
            const sp = msg.speaker.trim();
            if (/^(marie|sophia|sophie)$/i.test(sp)) {
              msg.speaker = 'Marie';
            } else if (/^(joe|mike|mark|joey|mick)$/i.test(sp)) {
              msg.speaker = 'Joe';
            }
          }

          if (msg.text && typeof msg.text === 'string') {
            msg.text = msg.text
              .replace(/\bMark\b/g, "Joe")
              .replace(/\bMike\b/g, "Joe")
              .replace(/\bSophia\b/g, "Marie");
            
            // Align speaker flag with text content if they mention themselves
            if (msg.speaker === 'Marie' && (msg.text.includes("I'm Joe") || msg.text.includes("I am Joe") || msg.text.includes("Joe here"))) {
              msg.speaker = 'Joe';
            } else if (msg.speaker === 'Joe' && (msg.text.includes("I'm Marie") || msg.text.includes("I am Marie") || msg.text.includes("Marie here"))) {
              msg.speaker = 'Marie';
            }
          }
        });
      }

      res.json(parsed);

      // --- ASYNCHRONOUS JOINT PRE-SYNTHESIS ---
      // Offload TTS pre-generation for the replied text in the background. The moment the frontend request for TTS arrives,
      // it hits the cache instantly, cutting conversation roundtrips down to near-instant speed!
      if (parsed && parsed.messages && parsed.messages.length > 0) {
        parsed.messages.forEach((msg: any) => {
          let cleanMessageText = (msg.text || "").trim();
          cleanMessageText = cleanMessageText.replace(/\[[^\]]*\]/gu, "");
          cleanMessageText = cleanMessageText.replace(/\([^)]*\)/gu, "");
          cleanMessageText = cleanMessageText.replace(/[*_#`~]/gu, "");
          cleanMessageText = cleanMessageText.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}]/gu, "");
          cleanMessageText = cleanMessageText.replace(/^(Sophia|Marie|Sophie|Joe|Mike|Joey|User|Client|Intake Lead|Intake|Tech Lead|Beta Tester|Beta Closer|Speaker):\s*/i, "");
          cleanMessageText = cleanMessageText.replace(/^[a-zA-Z\s]+:\s*/, "");
          cleanMessageText = cleanMessageText.replace(/\s+/gu, " ").trim();

          if (cleanMessageText) {
            let targetLang: 'en' | 'es' = 'en';
            if (msg.lang && msg.lang.toLowerCase().startsWith('es')) {
              targetLang = 'es';
            } else {
              const spanishWords = /\b(hola|bienvenido|nosotros|gracias|inteligencia|artificial|crear|construir|asistente|empresa|negocio|servicios|precio|contacto|sí|del|con)\b/i;
              const hasSpanishChars = /[áéíóúñ¿¡]/i;
              if (spanishWords.test(cleanMessageText) || hasSpanishChars.test(cleanMessageText)) {
                targetLang = 'es';
              }
            }

            const activeVoice = msg.speaker === 'Joe' ? (joeVoice || "Gemini") : (marieVoice || "Gemini");
            console.log(`[Joint Pre-Synthesis] Instantly pre-generating audio in background for speaker ${msg.speaker} with voice ${activeVoice}: "${cleanMessageText.substring(0, 30)}..."`);
            synthesizeTTS(cleanMessageText, msg.speaker === 'Joe' ? 'Joe' : 'Marie', targetLang, activeVoice).catch(e => {
              console.warn(`[Joint Pre-Synthesis Error] Non-blocking synthesis failed:`, e);
            });
          }
        });
      }
    } catch (error: any) {
      const isQuota = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED') || error.status === 429;
      if (isQuota) {
        console.warn("Chat Quota exhausted (429).");
        return res.status(429).json({ error: "Service busy. Please try again soon." });
      }
      console.error("Chat API Error:", error.message || error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Split long text into safe chunks under maxLength characters for high-end TTS stability
  function splitTextIntoSafeChunks(txt: string, maxLength: number = 180): string[] {
    // Split text by sentence boundaries, preserving punctuation
    const sentences = txt.match(/[^.!?\s][^.!?]*(?:[.!?]+['"]?|\s*$)/gi) || [txt];
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      if (trimmed.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = "";
        }
        // If single sentence is too big, split on reasonable sub-boundaries like commas, semi-colons
        const subParts = trimmed.split(/(?<=[,;:¿¡])/g);
        for (const part of subParts) {
          const pTrimmed = part.trim();
          if (!pTrimmed) continue;

          if (pTrimmed.length > maxLength) {
            let start = 0;
            while (start < pTrimmed.length) {
              chunks.push(pTrimmed.substring(start, start + maxLength).trim());
              start += maxLength;
            }
          } else {
            if ((currentChunk + " " + pTrimmed).length > maxLength) {
              chunks.push(currentChunk.trim());
              currentChunk = pTrimmed;
            } else {
              currentChunk = currentChunk ? currentChunk + " " + pTrimmed : pTrimmed;
            }
          }
        }
      } else {
        if ((currentChunk + " " + trimmed).length > maxLength) {
          chunks.push(currentChunk.trim());
          currentChunk = trimmed;
        } else {
          currentChunk = currentChunk ? currentChunk + " " + trimmed : trimmed;
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter(c => c.length > 0);
  }

  // Keep track of Gemini TTS Quota exhaustion state - disabled for ultimate prepaid accounts
  let isGeminiTtsQuotaExhausted = false;
  let lastQuotaCheckTime = 0;

  // Global, highly precise text-to-speech cache to ensure instant playbacks on repeated turns/intros
  const ttsCache = new Map<string, { audio: string; isRawPCM: boolean; isFallback: boolean; mimeType?: string }>();

  // Full-Stack Custom TTS Pipeline Helper supporting both Gemini Multimodal, Amazon Polly, and Translate failover
  async function synthesizeTTS(cleanText: string, speaker: 'Marie' | 'Joe', targetLang: 'en' | 'es', voice?: string): Promise<{ audio: string; isRawPCM: boolean; isFallback: boolean; mimeType?: string }> {
    const ttsKey = `${speaker || "default"}_${targetLang}_${voice || "default"}_${cleanText}`;
    if (ttsCache.has(ttsKey)) {
      console.log(`[TTS Cache HIT (synthesizeTTS)] Returning cached audio for size: ${cleanText.length} characters.`);
      return ttsCache.get(ttsKey)!;
    }

    // Periodically re-enable Gemini after 3 hours just in case quota is reset, avoiding erratic voice-switching mid-conversation
    if (isGeminiTtsQuotaExhausted && Date.now() - lastQuotaCheckTime > 3 * 60 * 60 * 1000) {
      isGeminiTtsQuotaExhausted = false;
    }

    // --- TIER 1: Native Gemini Neural Multimodal TTS (State-of-the-art Conversation Simulation) ---
    const isGeminiSelected = !voice || voice === 'Gemini' || voice === 'Default';
    if (apiKey && !isGeminiTtsQuotaExhausted && isGeminiSelected) {
      try {
        console.log(`[Tier 1 Gemini-TTS] Initiating native premium Gemini speech synthesis for key: ${ttsKey.substring(0, 45)}...`);
        const geminiVoice = speaker === 'Marie' ? 'Zephyr' : 'Puck';
        const modelsToTry = [
          "gemini-3.1-flash-tts-preview",
          "gemini-2.5-flash-preview-tts"
        ];
        
        let audioData = null;
        let geminiError = null;
        
        for (const modelToTry of modelsToTry) {
          // Retry each model up to 2 times to handle transient rate-limiting / 429 contentions
          for (let attempt = 1; attempt <= 2; attempt++) {
            try {
              console.log(`[Tier 1 Gemini-TTS] Attempting synthesis with model ${modelToTry} (Attempt ${attempt}/2), voice ${geminiVoice}...`);
               const response = await ai.models.generateContent({
                 model: modelToTry,
                 contents: [{
                   parts: [{
                     text: cleanText
                   }]
                 }],
                 config: {
                   responseModalities: [Modality.AUDIO],
                   speechConfig: {
                     voiceConfig: {
                       prebuiltVoiceConfig: { voiceName: geminiVoice },
                     },
                   },
                 },
               });
              
              const inlinePart = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
              audioData = inlinePart?.data;
              const returnedMimeType = inlinePart?.mimeType || "";
              
              if (audioData) {
                const isRawPCM = returnedMimeType.toLowerCase().includes("pcm") || 
                                 returnedMimeType.toLowerCase().includes("l16") || 
                                 returnedMimeType.toLowerCase().includes("raw");
                console.log(`[Tier 1 Gemini-TTS] Native synthesis successful with ${modelToTry} (Attempt ${attempt})! MIME: ${returnedMimeType}, size: ${audioData.length}`);
                const cacheResponse = { audio: audioData, isRawPCM, isFallback: false, mimeType: returnedMimeType };
                ttsCache.set(ttsKey, cacheResponse);
                return cacheResponse;
              }
            } catch (err: any) {
              geminiError = err;
              const errMsg = err?.message || "";
              const errStatus = err?.status;
              const errCode = err?.error?.code || err?.code;
              const errString = typeof err === "string" ? err : JSON.stringify(err || "");
              
              const isQuotaError = 
                errStatus === 429 || 
                errCode === 429 ||
                errMsg.includes("429") || 
                errMsg.includes("quota") || 
                errMsg.includes("RESOURCE_EXHAUSTED") ||
                errString.includes("429") ||
                errString.includes("quota") ||
                errString.includes("RESOURCE_EXHAUSTED");
              
              if (isQuotaError) {
                console.warn(`[Tier 1 Gemini-TTS Quota] Quota limit encountered for ${modelToTry} on attempt ${attempt}.`);
                if (attempt === 2) {
                  // Do not permanently latch for premium prepaid tier
                  console.log(`[Tier 1 Gemini-TTS] Premium Account: Bypassing permanent lockout state.`);
                } else {
                  // Wait 250ms before retrying on rate limit
                  await new Promise(resolve => setTimeout(resolve, 250));
                }
              } else {
                console.warn(`[Tier 1 Gemini-TTS] Model ${modelToTry} attempt ${attempt} failed:`, errMsg || err);
                if (attempt < 2) {
                  await new Promise(resolve => setTimeout(resolve, 150));
                }
              }
            }
          }
        }
        throw geminiError || new Error("No audio returned from Gemini TTS models.");
      } catch (tier1Error: any) {
        console.log(`[TTS Pipeline] Seamlessly routing speech synthesis to ultra-stable high-performance neural engines...`);
      }
    }

    // --- TIER 2: Premium Amazon Polly TTS Fallbacks (Ultra-stable, premium neural simulation) ---
    try {
      let pollyVoice = voice;
      if (!pollyVoice || pollyVoice === 'Gemini' || pollyVoice === 'Default') {
        if (speaker === 'Marie') {
          pollyVoice = targetLang === 'es' ? 'Mia' : 'Kimberly';
        } else {
          pollyVoice = targetLang === 'es' ? 'Andres' : 'Joey';
        }
      } else {
        if (targetLang === 'es') {
          const englishFemaleVoices = ['Kimberly', 'Joanna', 'Salli'];
          const englishMaleVoices = ['Joey', 'Matthew'];
          
          if (speaker === 'Marie' && englishFemaleVoices.includes(pollyVoice)) {
            pollyVoice = 'Mia';
          } else if (speaker === 'Joe' && englishMaleVoices.includes(pollyVoice)) {
            pollyVoice = 'Andres';
          }
        }
      }
      
      console.log(`[Tier 2 Polly] Requesting Streamlabs Polly with safe chunking for voice ${pollyVoice}`);
      const safeChunks = splitTextIntoSafeChunks(cleanText, 180);
      const chunkBuffers: Buffer[] = [];
      const streamlabsUrl = "https://streamlabs.com/polly/speak";
      
      for (let i = 0; i < safeChunks.length; i++) {
        const chunkText = safeChunks[i];
        let slResponse = await fetch(streamlabsUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Origin": "https://streamlabs.com",
            "Referer": "https://streamlabs.com/dashboard-v2",
            "Accept": "application/json, text/plain, */*"
          },
          body: JSON.stringify({ voice: pollyVoice, text: chunkText })
        });
        
        if (!slResponse.ok) {
          slResponse = await fetch(streamlabsUrl, {
            method: "POST",
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Origin": "https://streamlabs.com",
              "Referer": "https://streamlabs.com/dashboard-v2",
              "Accept": "application/json, text/plain, */*"
            },
            body: `voice=${encodeURIComponent(pollyVoice)}&text=${encodeURIComponent(chunkText)}`
          });
        }
        
        if (slResponse.ok) {
          const slData: any = await slResponse.json();
          if (slData.speak_url) {
            const audioStreamRes = await fetch(slData.speak_url);
            if (audioStreamRes.ok) {
              const arrayBuffer = await audioStreamRes.arrayBuffer();
              chunkBuffers.push(Buffer.from(arrayBuffer));
            } else {
              throw new Error(`Failed to fetch speak_url for chunk ${i + 1}`);
            }
          } else {
            throw new Error(`Streamlabs response missing speak_url for chunk ${i + 1}`);
          }
        } else {
          throw new Error(`Streamlabs response not OK for chunk ${i + 1}: ${slResponse.status}`);
        }
      }
      
      if (chunkBuffers.length > 0) {
        const finalBuffer = Buffer.concat(chunkBuffers);
        const base64Audio = finalBuffer.toString('base64');
        console.log(`[Tier 2 Polly] Audio chunks combined successfully.`);
        const cacheResponse = { audio: base64Audio, isRawPCM: false, isFallback: true };
        ttsCache.set(ttsKey, cacheResponse);
        return cacheResponse;
      } else {
        throw new Error("No audio chunks successfully fetched from Streamlabs");
      }
    } catch (tier2Error: any) {
      console.warn(`[Tier 2 Polly] Failed. Seamlessly routing to Google Translate fallback. Error:`, tier2Error.message);
      
      // --- TIER 3: Google Translate TTS Final Bulletproof Fallback ---
      try {
        console.log(`[Tier 3 Translate] Starting Google Translate fallback...`);
        const results = await googleTTS.getAllAudioBase64(cleanText, {
          lang: targetLang,
          slow: false,
          host: 'https://translate.google.com',
          splitPunct: ',.?'
        });
        
        const bufs = results.map(r => Buffer.from(r.base64, 'base64'));
        const finalBuffer = Buffer.concat(bufs);
        const base64Audio = finalBuffer.toString('base64');
        const cacheResponse = { audio: base64Audio, isRawPCM: false, isFallback: true };
        ttsCache.set(ttsKey, cacheResponse);
        return cacheResponse;
      } catch (tier3Error: any) {
        console.error("Tier 3 Translate fallback failure:", tier3Error);
        throw new Error("TTS Generation failed completely across all tiers.");
      }
    }
  }

  // Premium, Stable TTS Endpoint (Thin, ultra-optimized wrapper calling synthesizeTTS)
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, speaker, lang, voice } = req.body;
      
      // Sanitize input text of formatting, emojis, and unvoiced characters
      let cleanText = (text || "").trim();
      cleanText = cleanText.replace(/\[[^\]]*\]/gu, "");
      cleanText = cleanText.replace(/\([^)]*\)/gu, "");
      cleanText = cleanText.replace(/[*_#`~]/gu, "");
      cleanText = cleanText.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}]/gu, "");
      cleanText = cleanText.replace(/^(Sophia|Marie|Sophie|Joe|Mike|Joey|User|Client|Intake Lead|Intake|Tech Lead|Beta Tester|Beta Closer|Speaker):\s*/i, "");
      cleanText = cleanText.replace(/^[a-zA-Z\s]+:\s*/, "");
      cleanText = cleanText.replace(/\s+/gu, " ").trim();

      if (!cleanText) {
        cleanText = "Okay";
      }
      
      let targetLang: 'en' | 'es' = 'en';
      if (lang && typeof lang === 'string') {
        if (lang.toLowerCase().startsWith('es')) {
          targetLang = 'es';
        }
      } else {
        const spanishWords = /\b(hola|bienvenido|nosotros|gracias|inteligencia|artificial|crear|construir|asistente|empresa|negocio|servicios|precio|contacto|sí|del|con)\b/i;
        const hasSpanishChars = /[áéíóúñ¿¡]/i;
        if (spanishWords.test(cleanText) || hasSpanishChars.test(cleanText)) {
          targetLang = 'es';
        }
      }

      const result = await synthesizeTTS(cleanText, speaker || 'Marie', targetLang, voice);
      res.json(result);
    } catch (e: any) {
      console.error("[/api/tts endpoint error]:", e.message || e);
      res.status(500).json({ error: e.message || "Synthesis failed completely." });
    }
  });

  // Define API Routes
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { tierName, price, setupFee } = req.body;
      const stripeClient = getStripe();
      
      if (!stripeClient) {
        return res.status(500).json({ error: "Stripe is not configured on the server." });
      }

      // Map tiers to product IDs provided by the user
      let productId = null;
      const lowerTierName = tierName.toLowerCase();
      
      if (lowerTierName.includes("apex") || lowerTierName.includes("tier 4")) {
        productId = "prod_UWq6OL7tKDF7mM";
      } else if (lowerTierName.includes("digital twin") || lowerTierName.includes("tier 3")) {
        productId = "prod_UWpceBWqDU6mP8";
      } else if (lowerTierName.includes("operations") || lowerTierName.includes("tier 2")) {
        productId = "prod_UWpmKAShQPwa0E";
      } else if (lowerTierName.includes("front desk") || lowerTierName.includes("tier 1")) {
        productId = "prod_UWpq8fl6eMOe67";
      }

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product: productId || undefined,
              product_data: productId ? undefined : {
                name: `Scionti AI: ${tierName}`,
                description: `Monthly subscription for ${tierName} services`,
              },
              unit_amount: parseInt(price.replace(/[^0-9]/g, "")) * 100,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${tierName} Setup Fee`,
                description: "One-time digital architecture setup and deployment",
              },
              unit_amount: parseInt(setupFee.replace(/[^0-9]/g, "")) * 100,
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.APP_URL || "http://localhost:3000"}?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message, chatHistory } = req.body;
      
      const resend = getResend();
      
      if (!resend) {
        console.warn("RESEND_API_KEY is not set. Email notification skipped.");
        return res.status(200).json({ 
          message: "Contact received but email not sent (API key missing)",
          data: { id: "mock_success" } 
        });
      }
      
      const { data, error } = await resend.emails.send({
        from: 'Scionti AI <onboarding@resend.dev>', // Should be a verified domain in production
        to: ['jo@sciontistaffing.com'], // Replace with actual recipient
        subject: `New AI Lead: ${name || email || 'Anonymous'}`,
        html: `
          <h2>New Lead from Scionti AI Assistant</h2>
          <p><strong>Name:</strong> ${name || 'N/A'}</p>
          <p><strong>Email:</strong> ${email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
          
          <h3>Conversation History:</h3>
          <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-size: 14px;">${chatHistory}</pre>
        `
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(400).json({ error });
      }

      res.status(200).json({ data });
    } catch (error: any) {
      console.error("API Route Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development vs Production static serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Warm up standard introductions in background on startup to ensure instant playback (0ms latency!)
    setTimeout(async () => {
      try {
        const MARIE_INTRO_TEXT = "Hi there! Welcome to Scionti AI. I'm Marie, our Intake Lead, and we are so glad you're here. We design custom AI specialists that take care of your business perfectly. Let me bring in Joe to show you how easy this is!";
        const JOE_INTRO_TEXT = "Hey! Joe here, Technical Specialist. We build tailored AI assistants that run your front desk, book clients, and answer questions twenty-four seven. To keep our customization elite, we only take on seven new partners a month, and we have just three spots left. To get started, what is your first name?";

        console.log("[Warm-up] Prefetching standard introductions in the backend to eliminate startup delay...");
        await Promise.all([
          synthesizeTTS(MARIE_INTRO_TEXT, "Marie", "en", "Gemini"),
          synthesizeTTS(JOE_INTRO_TEXT, "Joe", "en", "Gemini")
        ]);
        console.log("[Warm-up] Backend cache pre-warmed successfully!");
      } catch (e: any) {
        console.warn("[Warm-up] Backend pre-warming skipped or postponed:", e.message || e);
      }
    }, 1000);
  });
}

startServer();
