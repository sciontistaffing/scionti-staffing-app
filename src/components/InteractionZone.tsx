import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentAvatar } from './AgentAvatar';
import { AgentProfileModal } from './AgentProfileModal';
import mariePic from '../assets/images/marie_profile_1779927562287.png';
import joePic from '../assets/images/joe_profile_1779927538635.png';
import { Mic, Globe, Cpu, Calendar, CheckCircle2, MicOff, MessageSquare, MessageSquareOff, Activity, Shield, X, Music, AlertCircle, RotateCcw, Sparkles, Volume2, Settings } from 'lucide-react';

type Speaker = 'user' | 'Sophia' | 'Mike' | 'Marie' | 'Joe' | 'idle';

interface Message {
  id: number;
  speaker: Speaker;
  text: string;
  action?: 'booking' | 'tech' | 'language';
  lang?: 'en-US' | 'es-ES';
}

interface CapturedData {
  intent: string;
  industry: string;
  tier: string;
  staffingNeeds: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentConfirmed: boolean;
  clientName: string;
  contact: string;
}

const writeStringHelper = (view: DataView, offset: number, str: string) => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
};

const pcmToWav = (pcmBytes: Uint8Array, sampleRate: number = 24000): ArrayBuffer => {
  const buffer = new ArrayBuffer(44 + pcmBytes.length);
  const view = new DataView(buffer);

  writeStringHelper(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmBytes.length, true);
  writeStringHelper(view, 8, 'WAVE');
  writeStringHelper(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true);  // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true);  // NumChannels
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true);  // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeStringHelper(view, 36, 'data');
  view.setUint32(40, pcmBytes.length, true);

  const dst = new Uint8Array(buffer, 44);
  dst.set(pcmBytes);

  return buffer;
};

const decodeAudioDataHelper = (ctx: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
  // Try modern Promise-based decodeAudioData first
  try {
    const promise = ctx.decodeAudioData(arrayBuffer);
    if (promise && typeof promise.then === 'function') {
      return promise;
    }
  } catch (e) {
    console.warn("Promise-based decodeAudioData failed, falling back to callback style", e);
  }

  // Fallback to traditional callback style
  return new Promise((resolve, reject) => {
    try {
      ctx.decodeAudioData(
        arrayBuffer,
        (buffer) => resolve(buffer),
        (err) => reject(err || new Error("Audio decoder rejected the stream."))
      );
    } catch (e: any) {
      reject(e || new Error("Failed to initialize audio decoding."));
    }
  });
};

class SyntheticSaxBGM {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private schedulerTimer: any = null;
  private currentBeat = 0;
  private tempo = 68; // Chill late-night smooth jazz tempo
  private volumeValue = 0.05;

  constructor() {}

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volumeValue, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.currentBeat = 0;
      this.scheduleNext();
    } catch (e) {
      console.warn("Failed to start synthetic BGM engine:", e);
    }
  }

  setVolume(vol: number) {
    this.volumeValue = vol;
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.15);
      } catch (e) {
        try {
          this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
        } catch (err) {}
      }
    }
  }

  private scheduleNext() {
    if (!this.isPlaying || !this.ctx) return;

    try {
      const beatDuration = 60 / this.tempo;
      const now = this.ctx.currentTime;

      // Jazz chords: Fmaj9, G13, Em7, Am9
      const chords = [
        [174.61, 220.00, 261.63, 329.63, 349.23], // Fmaj9
        [196.00, 246.94, 293.66, 392.00, 440.00], // G13
        [164.81, 196.00, 246.94, 329.63, 392.00], // Em7
        [220.00, 261.63, 329.63, 392.00, 493.88]  // Am9
      ];

      const chordIdx = Math.floor(this.currentBeat / 8) % chords.length;
      const currentChord = chords[chordIdx];

      // Play soft ambient chord pad on beat 0 and 4 of each 8-beat cycle
      if (this.currentBeat % 4 === 0) {
        currentChord.slice(0, 4).forEach((freq, idx) => {
          this.playPadNote(freq, now + idx * 0.05, beatDuration * 3.8);
        });
      }

      // Improvise a soft, soulful saxophone melody note
      const pentatonic = [329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99]; // E4, G4, A4, C5, D5, E5, G5
      
      const melodicBeats = [0, 2, 3, 5, 6, 7];
      if (melodicBeats.includes(this.currentBeat % 8) && Math.random() < 0.55) {
        const noteFreq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        const duration = beatDuration * (1 + Math.random() * 1.5);
        this.playSaxNote(noteFreq, now, duration);
      }

      this.currentBeat++;

      this.schedulerTimer = setTimeout(() => {
        this.scheduleNext();
      }, beatDuration * 1000);
    } catch (e) {
      console.warn("Synthetic BGM scheduling failed:", e);
    }
  }

  private playPadNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.8);
      gain.gain.setValueAtTime(0.12, startTime + duration - 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {}
  }

  private playSaxNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      const vibratoLfo = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibratoLfo.frequency.setValueAtTime(5.2, startTime);
      vibratoGain.gain.setValueAtTime(freq * 0.012, startTime);
      
      vibratoLfo.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, startTime);
      filter.frequency.exponentialRampToValueAtTime(450, startTime + duration);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.16, startTime + 0.2);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.4);
      gain.gain.setValueAtTime(0.12, startTime + duration - 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      vibratoLfo.start(startTime);
      osc.start(startTime);

      vibratoLfo.stop(startTime + duration);
      osc.stop(startTime + duration);
    } catch (e) {}
  }

  stop() {
    this.isPlaying = false;
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch (e) {}
      this.masterGain = null;
    }
  }
}

const speakNativeHelper = (text: string, lang: string, speaker: 'Marie' | 'Joe' | 'Sophia' | 'Mike'): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      
      const isMarie = speaker === 'Marie' || speaker === 'Sophia';
      const isSpanish = lang.toLowerCase().startsWith('es');
      
      if (isMarie) {
        if (isSpanish) {
          selectedVoice = voices.find(v => v.lang.startsWith('es') && (
            v.name.includes('Monica') || 
            v.name.includes('Paulina') || 
            v.name.includes('Google') || 
            v.name.includes('Female') || 
            v.name.toLowerCase().includes('maria') || 
            v.name.toLowerCase().includes('mia') || 
            v.name.toLowerCase().includes('helena')
          ));
        } else {
          selectedVoice = voices.find(v => v.lang.startsWith('en') && (
            v.name.includes('Zira') || 
            v.name.includes('Samantha') || 
            v.name.includes('Google US English') || 
            v.name.includes('Female') || 
            v.name.toLowerCase().includes('salli') || 
            v.name.toLowerCase().includes('joanna')
          ));
        }
      } else {
        if (isSpanish) {
          selectedVoice = voices.find(v => v.lang.startsWith('es') && (
            v.name.includes('Jorge') || 
            v.name.includes('Google') || 
            v.name.includes('Male') || 
            v.name.toLowerCase().includes('andres') || 
            v.name.toLowerCase().includes('miguel')
          ));
        } else {
          selectedVoice = voices.find(v => v.lang.startsWith('en') && (
            v.name.includes('David') || 
            v.name.includes('Google UK English Male') || 
            v.name.includes('Male') || 
            v.name.toLowerCase().includes('joey') || 
            v.name.toLowerCase().includes('matthew')
          ));
        }
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith(isSpanish ? 'es' : 'en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = isMarie ? 1.05 : 0.95;
      utterance.pitch = isMarie ? 1.02 : 0.93;
      
      if (!(window as any)._activeUtterances) {
        (window as any)._activeUtterances = [];
      }
      (window as any)._activeUtterances.push(utterance);
      
      const cleanup = () => {
        if ((window as any)._activeUtterances) {
          const idx = (window as any)._activeUtterances.indexOf(utterance);
          if (idx !== -1) {
            (window as any)._activeUtterances.splice(idx, 1);
          }
        }
      };
      
      const timeoutId = setTimeout(() => {
        console.warn("[TTS Fallback Safety] Native SpeechSynthesis hang detected. Resolving dynamically.");
        window.speechSynthesis.cancel();
        cleanup();
        resolve(true);
      }, Math.max(3000, text.length * 100));
      
      utterance.onend = () => {
        clearTimeout(timeoutId);
        cleanup();
        resolve(true);
      };
      
      utterance.onerror = (evt) => {
        console.error("Web Speech API playback interrupted or failed:", evt);
        clearTimeout(timeoutId);
        cleanup();
        resolve(true);
      };
      
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    } catch (fallbackErr) {
      console.error("Web Speech API crashed completely:", fallbackErr);
      setTimeout(() => resolve(true), 1500);
    }
  });
};

export function InteractionZone() {
  const [language, setLanguage] = useState<'en-US' | 'es-ES'>('en-US');
  const [capturedData, setCapturedData] = useState<CapturedData>({ 
    intent: '', 
    industry: '', 
    tier: '', 
    staffingNeeds: '', 
    appointmentDate: '',
    appointmentTime: '', 
    appointmentConfirmed: false, 
    clientName: '',
    contact: '' 
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [micError, setMicError] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker>('idle');
  const [selectedAgentProfile, setSelectedAgentProfile] = useState<'Marie' | 'Joe' | null>(null);
  const [ttsErrorMsg, setTtsErrorMsg] = useState('');
  const [volLevel, setVolLevel] = useState(0);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [interruptionEnabled, setInterruptionEnabled] = useState(false);
  const interruptionEnabledRef = useRef(false);
  const introAudioCacheRef = useRef<{marie: any, joe: any}>({ marie: null, joe: null });

  const [sophiaVoice, setSophiaVoice] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('s_sophia_voice');
      return saved || 'Gemini';
    } catch {
      return 'Gemini';
    }
  });

  const [mikeVoice, setMikeVoice] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('s_mike_voice');
      return saved || 'Gemini';
    } catch {
      return 'Gemini';
    }
  });

  const handleSetSophiaVoice = (v: string) => {
    setSophiaVoice(v);
    introAudioCacheRef.current.marie = null;
    try {
      localStorage.setItem('s_sophia_voice', v);
    } catch (e) {
      console.warn("Storage write failed:", e);
    }
  };

  const handleSetMikeVoice = (v: string) => {
    setMikeVoice(v);
    introAudioCacheRef.current.joe = null;
    try {
      localStorage.setItem('s_mike_voice', v);
    } catch (e) {
      console.warn("Storage write failed:", e);
    }
  };
  
  const [isPlayingIntroPitch, setIsPlayingIntroPitch] = useState<'Marie' | 'Joe' | null>(null);

  const playIntroPitch = async (speaker: 'Marie' | 'Joe') => {
    if (isPlaying) return; // Prevent double trigger when the full interaction demo is running
    
    // Command the master audio playback to stop first
    stopAIAudio(false);
    
    // Unlock and resume AudioContext on direct click interaction
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    
    setIsPlayingIntroPitch(speaker);
    setCurrentSpeaker(speaker);
    
    try {
      // Small delay to allow any running audio tasks to yield
      await new Promise(resolve => setTimeout(resolve, 80));
      
      const text = speaker === 'Marie' ? MARIE_INTRO_TEXT : JOE_INTRO_TEXT;
      let cachedAudio = speaker === 'Marie' ? introAudioCacheRef.current.marie : introAudioCacheRef.current.joe;
      
      const audioResult = cachedAudio ? cachedAudio : await fetchTTSAudio(text, speaker, 'en-US');
      
      if (audioResult) {
        if (speaker === 'Marie') {
          introAudioCacheRef.current.marie = audioResult;
        } else {
          introAudioCacheRef.current.joe = audioResult;
        }
        
        isPlayingRef.current = true;
        isInterruptedRef.current = false;
        
        await playAudioData(audioResult.audio, audioResult.isRawPCM, 24000, speaker, audioResult.isFallback);
      } else {
        throw new Error("No premium audio result returned from TTS server.");
      }
    } catch (err) {
      console.warn(`Failed to play pitch stream for ${speaker}, using native speech synthesis fallback:`, err);
      const text = speaker === 'Marie' ? MARIE_INTRO_TEXT : JOE_INTRO_TEXT;
      isPlayingRef.current = true;
      isInterruptedRef.current = false;
      
      await speakNativeHelper(text, 'en-US', speaker);
    } finally {
      setCurrentSpeaker('idle');
      setIsPlayingIntroPitch(null);
      isPlayingRef.current = false;
    }
  };
  
  const MARIE_INTRO_TEXT = "Hi there! Welcome to Scionti AI. I'm Marie, our Intake Lead, and we are so glad you're here. We design custom AI specialists that take care of your business perfectly. Let me bring in Joe to show you how easy this is!";
  const JOE_INTRO_TEXT = "Hey! Joe here, Technical Specialist. We build tailored AI assistants that run your front desk, book clients, and answer questions twenty-four seven. To keep our customization elite, we only take on seven new partners a month, and we have just three spots left. To get started, what is your first name?";

  const getQuickReplies = (): string[] => {
    const isEs = language === 'es-ES';
    
    // Stage 1: Intro / Conversation just started
    if (messages.length <= 2) {
      if (isEs) {
        return [
          "¡Sí, estoy listo! Comencemos.",
          "Me gustaría hacer unas preguntas primero.",
          "¿Cuánto cuestan sus especialistas de IA?"
        ];
      }
      return [
        "Yes, I'm ready! Let's build.",
        "I'd like to ask a few questions first.",
        "What are your pricing plans?"
      ];
    }
    
    // Stage 2: Missing Name
    if (!capturedData.clientName) {
      if (isEs) {
        return [
          "Mi nombre es Juan",
          "Hola, soy dueño de un pequeño negocio",
          "Quiero un especialista para mi empresa"
        ];
      }
      return [
        "My name is John",
        "Hi, I'm a small business owner",
        "I'd like to customize an AI specialist"
      ];
    }
    
    // Stage 3: Missing Industry
    if (!capturedData.industry) {
      if (isEs) {
        return [
          "Tengo un negocio de plomería",
          "Tengo una clínica dental local",
          "Soy contratista residencial",
          "¿Qué industrias apoyan?"
        ];
      }
      return [
        "I run a plumbing business",
        "We are a local dental clinic",
        "I have a residential contracting firm",
        "What industries do you support?"
      ];
    }
    
    // Stage 4: Missing Staffing Needs / Headache
    if (!capturedData.staffingNeeds) {
      if (isEs) {
        return [
          "Necesito una recepcionista 24/7",
          "Quiero que responda llamadas y preguntas",
          "Ayuda con llamadas fuera de horario",
          "¿Qué tan avanzados son los agentes?"
        ];
      }
      return [
        "I need a receptionist to book clients 24/7",
        "I want support with customer phone calls and FAQs",
        "Can you help with after-hours calls?",
        "How capable are your AI specialists?"
      ];
    }
    
    // Stage 5: Evaluating Tiers / Pricing
    if (!capturedData.tier) {
      if (isEs) {
        return [
          "Háblame de su Plan Receptionist",
          "¿Cuánto cuesta el Digital Twin Plan?",
          "¡Quiero asegurar uno de los 3 cupos de mayo!",
          "¿Cuál plan incluye campañas de SMS?"
        ];
      }
      return [
        "Tell me about the Front Desk Plan",
        "What does the Digital Twin Plan cost?",
        "I want to lock in one of the 3 spots for May!",
        "Which plan handles automated SMS campaigns?"
      ];
    }
    
    // Stage 6: Captured Email / Booking / Details
    if (isEs) {
      return [
        "¡Sí, agenda mi prueba Beta!",
        "¿Cómo empezamos con la configuración?",
        "Confirma mi lugar, por favor"
      ];
    }
    return [
      "Yes, book my Beta Test slot!",
      "How do we start the setup?",
      "Please confirm my booking"
    ];
  };

  useEffect(() => {
    interruptionEnabledRef.current = interruptionEnabled;
  }, [interruptionEnabled]);

  // Pre-fetch intro audios on mount in background or when selected voice customizer updates
  useEffect(() => {
    introAudioCacheRef.current.marie = null;
    introAudioCacheRef.current.joe = null;
    const prefetchIntroAudio = async () => {
      try {
        const [sophiaAudio, mikeAudio] = await Promise.all([
          fetchTTSAudio(MARIE_INTRO_TEXT, 'Marie', 'en-US'),
          fetchTTSAudio(JOE_INTRO_TEXT, 'Joe', 'en-US')
        ]);
        if (sophiaAudio) {
          introAudioCacheRef.current.marie = sophiaAudio;
        }
        if (mikeAudio) {
          introAudioCacheRef.current.joe = mikeAudio;
        }
      } catch (err) {
        console.warn("Background prefetch of intro TTS failed:", err);
      }
    };
    prefetchIntroAudio();
  }, [sophiaVoice, mikeVoice]);

  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoicesLoaded(true);
    };
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoicesLoaded(true);
    }
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const chatHistoryRef = useRef<any[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const activeGainRef = useRef<GainNode | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const syntheticBgmRef = useRef<SyntheticSaxBGM | null>(null);
  
  // Initialize synthetic BGM engine on mount
  useEffect(() => {
    syntheticBgmRef.current = new SyntheticSaxBGM();
    return () => {
      if (syntheticBgmRef.current) {
        syntheticBgmRef.current.stop();
      }
    };
  }, []);

  const isPlayingRef = useRef(false);
  const isListeningRef = useRef(false);
  const currentSpeakerRef = useRef<Speaker>('idle');
  const isInterruptedRef = useRef(false);
  const isProcessingChatRef = useRef(false);
  const vadStreamRef = useRef<MediaStream | null>(null);
  const vadIntervalRef = useRef<any>(null);
  const emailSentRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const silenceTimeoutRef = useRef<any>(null);
  const micBlockedRef = useRef(false);

  useEffect(() => {
    if ((capturedData.contact || capturedData.appointmentConfirmed) && !emailSentRef.current) {
      emailSentRef.current = true;
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: capturedData.clientName || 'Anonymous',
          email: capturedData.contact || 'No Contact Provided',
          phone: capturedData.contact || 'No Contact Provided',
          message: `Industry: ${capturedData.industry}\nTier: ${capturedData.tier}\nStaffing Needs: ${capturedData.staffingNeeds}\nIntent: ${capturedData.intent}\nAppointment: ${capturedData.appointmentDate} at ${capturedData.appointmentTime}`,
          chatHistory: messages.map(m => `${m.speaker}: ${m.text}`).join('\n')
        })
      }).catch(err => console.error("Failed to send email:", err));
    }
  }, [capturedData, messages]);

  const stopAIAudio = (shouldRestartListening = true) => {
    isInterruptedRef.current = true;
    
    if (activeGainRef.current && audioCtxRef.current) {
      try {
        activeGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.03);
      } catch (e) {}
      setTimeout(() => {
        if (activeSourceRef.current) {
          try { activeSourceRef.current.stop(); } catch (e) {}
          activeSourceRef.current = null;
        }
      }, 150);
    } else if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch (e) {}
      activeSourceRef.current = null;
    }

    window.speechSynthesis.cancel();
    setCurrentSpeaker('idle');
    
    if (isPlayingRef.current && shouldRestartListening) {
      setTimeout(() => {
        if (!isListeningRef.current && isPlayingRef.current) {
          startListening();
        }
      }, 200);
    }
  };

  const startVAD = async () => {
    setMicError(false);
    micBlockedRef.current = false;
    
    if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
    vadIntervalRef.current = setInterval(() => {
      if (currentSpeakerRef.current !== 'idle') {
        const randomVol = Math.floor(Math.random() * 65) + 35; // 35 to 100
        setVolLevel(randomVol);
      } else if (isListeningRef.current) {
        // Safe, beautiful rhythmic pulsing while listening
        const pulse = Math.floor(Math.sin(Date.now() / 150) * 12) + 20; // 8 to 32 pulse
        setVolLevel(pulse);
      } else {
        setVolLevel(0);
      }
    }, 40);
  };

  const stopVAD = () => {
    if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
    setVolLevel(0);
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if (syntheticBgmRef.current) {
      syntheticBgmRef.current.setVolume(0.05); // Keep it very low so it's a nice soft saxophone background
    }
  }, []);

  useEffect(() => {
    if (syntheticBgmRef.current) {
      if (isListening) {
        syntheticBgmRef.current.setVolume(0.015); // Duck the volume significantly when listening
      } else {
        syntheticBgmRef.current.setVolume(0.05); // Normal background level
      }
    }
  }, [isListening]);

  useEffect(() => {
    currentSpeakerRef.current = currentSpeaker;
  }, [currentSpeaker]);

  // Autoplay guard: Resume AudioContext and start BGM on any user interaction with the document
  useEffect(() => {
    const resumeContext = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
          .then(() => console.log("AudioContext resumed on user gesture"))
          .catch(e => console.warn("Failed to resume AudioContext:", e));
      }
      // Play background music on first user gesture if active
      if (bgmEnabled && syntheticBgmRef.current) {
        syntheticBgmRef.current.start();
      }
    };
    window.addEventListener('click', resumeContext, { passive: true });
    window.addEventListener('touchstart', resumeContext, { passive: true });
    return () => {
      window.removeEventListener('click', resumeContext);
      window.removeEventListener('touchstart', resumeContext);
    };
  }, []);

  // Clean up all running audio, synthetic voices, and recognition on component unmount
  useEffect(() => {
    return () => {
      stopDemo();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && showTranscript) {
      const scrollEl = scrollRef.current;
      setTimeout(() => {
        scrollEl.scrollTo({
          top: scrollEl.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  }, [messages, interimText, isListening, showTranscript]);

  const processChatResponse = async (userText: string) => {
    if (isProcessingChatRef.current) return;
    
    isProcessingChatRef.current = true;
    setIsProcessing(true);
    setLastError(null);

    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          history: chatHistoryRef.current,
          marieVoice: sophiaVoice,
          joeVoice: mikeVoice
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get chat response');
      }

      const data = await response.json();
      
      // Update local history
      chatHistoryRef.current.push({ role: 'user', parts: [{ text: userText }] });
      chatHistoryRef.current.push({ 
        role: 'model', 
        parts: [{ text: JSON.stringify(data) }] 
      });
      
      setIsProcessing(false);

      if (data.capturedData) {
        setCapturedData(prev => ({ ...prev, ...data.capturedData }));
      }

      if (data.messages && data.messages.length > 0) {
        const primaryLang = data.messages[0].lang;
        if (primaryLang === 'es-ES' || primaryLang === 'en-US') {
          setLanguage(primaryLang);
        }

        // Post-process messages to fix common AI speaker misattributions
        data.messages.forEach((msg: any) => {
          // Normalize capitalization
          if (msg.speaker && typeof msg.speaker === 'string') {
            msg.speaker = msg.speaker.charAt(0).toUpperCase() + msg.speaker.slice(1).toLowerCase();
          }
          if (msg.speaker === 'Marie' || msg.speaker === 'Sophia' || msg.speaker === 'Sophie') msg.speaker = 'Marie';
          if (msg.speaker === 'Mark' || msg.speaker === 'Joe' || msg.speaker === 'Joey' || msg.speaker === 'Mike' || msg.speaker === 'Mick') msg.speaker = 'Joe';
          
          if (msg.speaker === 'Marie' && (msg.text.includes("I'm Joe") || msg.text.includes("I am Joe") || msg.text.includes("Joe here") || msg.text.includes("I'm Mike") || msg.text.includes("Mike here"))) {
            msg.speaker = 'Joe';
          } else if (msg.speaker === 'Joe' && (msg.text.includes("I'm Marie") || msg.text.includes("I am Marie") || msg.text.includes("I'm Sophia") || msg.text.includes("I am Sophia"))) {
            msg.speaker = 'Marie';
          }
        });

        // Fetch the first TTS immediately to minimize time-to-first-word
        if (data.messages && data.messages.length > 0) {
          data.messages.forEach((msg: any) => {
             if (msg.text) {
               msg.text = msg.text.replace(/\bMark\b/g, "Joe").replace(/\bJoe\b/g, "Joe").replace(/\bMike\b/g, "Joe").replace(/\bMarie\b/g, "Marie").replace(/\bSophia\b/g, "Marie");
             }
          });
        }
        
        // Fetch ALL TTS audio files concurrently immediately after text generation
        const audioPromises: Promise<{audio: string | null; isRawPCM: boolean; isFallback?: boolean} | null>[] = data.messages.map((msg: any) => 
          fetchTTSAudio(msg.text, msg.speaker, msg.lang || 'en-US')
        );

        for (let i = 0; i < data.messages.length; i++) {
          const msg = data.messages[i];
          if (!isPlayingRef.current || isInterruptedRef.current) break;
          
          setCurrentSpeaker(msg.speaker);
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            speaker: msg.speaker,
            text: msg.text,
            lang: msg.lang || 'en-US'
          }]);

          const preFetchedData = await audioPromises[i];
          
          if (!isInterruptedRef.current && isPlayingRef.current) {
            await playTTS(msg.text, msg.speaker, msg.lang || 'en-US', preFetchedData);
          }
          
          if (isInterruptedRef.current) break;

          // Natural pause between speakers for smoother handoffs
          if (data.messages.length > 1 && i < data.messages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 20)); // ultra-low pause
          }
        }
      }
      
      if (!isInterruptedRef.current) {
        setCurrentSpeaker('idle');
        if (isPlayingRef.current) {
          startListening();
        }
      }

    } catch (e: any) {
      if (e.name === 'AbortError') return;
      setIsProcessing(false);
      setLastError(e.message || "Connection intermittent...");
      console.warn("Chat error:", e);
      
      const isQuota = e?.message?.includes('429') || e?.message?.includes('quota') || e?.status === 429;
      
      const errMsg = isQuota 
        ? "I'm sorry, our system is currently overloaded. We're using our standard processing until capacity returns."
        : "I'm sorry, my link is a bit unstable. Could you say that again?";
        
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        speaker: 'Marie',
        text: errMsg,
        lang: 'en-US'
      }]);
      await playTTS(errMsg, 'Marie', 'en-US');
      
      setCurrentSpeaker('idle');
      if (isPlayingRef.current) {
        startListening();
      }
    } finally {
      isProcessingChatRef.current = false;
    }
  };

  const playAudioData = async (base64Data: string, isRawPCM: boolean, sampleRate = 24000, speaker?: 'Sophia' | 'Mike' | 'Marie' | 'Joe', isFallback?: boolean) => {
    if (!isPlayingRef.current) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    let audioBuffer: AudioBuffer | null = null;

    if (isRawPCM) {
      try {
        // Prepend WAV headers to let the browser natively decode it with high-fidelity & hardware acceleration
        const wavArrayBuffer = pcmToWav(bytes, sampleRate);
        audioBuffer = await decodeAudioDataHelper(ctx, wavArrayBuffer);
        console.log("Raw PCM successfully converted to WAV and decoded natively.");
      } catch (wavErr) {
        console.warn("Native WAV decoding on Raw PCM failed, falling back to manual float32 parser...", wavErr);
        try {
          audioBuffer = ctx.createBuffer(1, Math.floor(bytes.length / 2), sampleRate);
          const channelData = audioBuffer.getChannelData(0);
          const dataView = new DataView(bytes.buffer);
          for (let i = 0; i < channelData.length; i++) {
            channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
          }
          console.log("Audio manually parsed as RAW PCM successfully.");
        } catch (manualPcmErr: any) {
          console.error("PCM manual decoding failed:", manualPcmErr);
          throw new Error(`Failed to decode or parse audio stream: ${manualPcmErr.message || manualPcmErr}`);
        }
      }
    } else {
      try {
        // Normal container decoding (MP3, WAV, etc.)
        audioBuffer = await decodeAudioDataHelper(ctx, bytes.buffer.slice(0));
        console.log("Audio container stream natively decoded successfully.");
      } catch (decodeErr: any) {
        console.warn("Container decoding failed. Attempting to recover as Raw PCM...", decodeErr);
        try {
          const wavArrayBuffer = pcmToWav(bytes, sampleRate);
          audioBuffer = await decodeAudioDataHelper(ctx, wavArrayBuffer);
          console.log("Recovered as Raw PCM through WAV formatter.");
        } catch (recoveryErr) {
          throw decodeErr || new Error("Unable to decode audio data");
        }
      }
    }

    if (!audioBuffer) {
      throw new Error("Unable to decode audio data");
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    
    // Smoothly lower the playback rate just a tiny touch (0.94) to deepen the vocal register and drop the tone naturally, preserving high-fidelity tempo
    let customRate = 1.0;
    if (speaker === 'Joe') {
      customRate = 0.94;
    }
    source.playbackRate.value = customRate;
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    
    let lastNode: AudioNode = source;
    
    if (speaker === 'Joe' || speaker === 'Mike') {
      try {
        // High-End Conversational Mastering Filter Pipeline for Joe:
        // 1. Low-shelf filter to accentuate the comfortable, warm chest/baritone resonance of his voice
        const lowShelf = ctx.createBiquadFilter();
        lowShelf.type = 'lowshelf';
        lowShelf.frequency.setValueAtTime(190, ctx.currentTime);
        lowShelf.gain.setValueAtTime(3.5, ctx.currentTime); // Perfect baritone warm boost

        // 2. High-shelf filter to roll off sibilant treble, which sometimes makes synthesizers sound thin or sharp
        const highShelf = ctx.createBiquadFilter();
        highShelf.type = 'highshelf';
        highShelf.frequency.setValueAtTime(4200, ctx.currentTime);
        highShelf.gain.setValueAtTime(-2.0, ctx.currentTime); // Warm analog smoothing filter

        // Chain the audio enhancement nodes
        lastNode.connect(lowShelf);
        lowShelf.connect(highShelf);
        lastNode = highShelf;
        
        console.log("[Audio Engine] Applied master vocal equalizers to Joe's voice.");
      } catch (eqErr) {
        console.warn("Failed to apply eq filters, playing voice directly:", eqErr);
      }
    } else if (speaker === 'Marie' || speaker === 'Sophia') {
      try {
        // High-End Studio Mastering Filter Pipeline for Sophia/Marie:
        // 1. Low-shelf filter to give her voice a warm broadcast feel
        const lowShelf = ctx.createBiquadFilter();
        lowShelf.type = 'lowshelf';
        lowShelf.frequency.setValueAtTime(240, ctx.currentTime);
        lowShelf.gain.setValueAtTime(1.5, ctx.currentTime); // Warm microphone boost
        
        // 2. High-shelf filter for silky, smooth treble reduction that avoids harsh sibilance on high frequencies
        const highShelf = ctx.createBiquadFilter();
        highShelf.type = 'highshelf';
        highShelf.frequency.setValueAtTime(5000, ctx.currentTime);
        highShelf.gain.setValueAtTime(-1.0, ctx.currentTime); // Silky smoothing high-cut
        
        lastNode.connect(lowShelf);
        lowShelf.connect(highShelf);
        lastNode = highShelf;
        
        console.log("[Audio Engine] Applied master vocal equalizers to Marie's voice.");
      } catch (eqErr) {
        console.warn("Failed to apply eq filters to Marie's voice:", eqErr);
      }
    }
    
    lastNode.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    activeSourceRef.current = source;
    activeGainRef.current = gainNode;
    source.start();

    return new Promise(resolve => {
      source.onended = () => {
        activeSourceRef.current = null;
        resolve(true);
      };
    });
  };

  const fetchTTSAudio = async (text: string, speaker: 'Sophia' | 'Mike' | 'Marie' | 'Joe', lang: string = 'en-US'): Promise<{audio: string; isRawPCM: boolean; isFallback?: boolean} | null> => {
    try {
      const voice = (speaker === 'Marie' || speaker === 'Sophia') ? sophiaVoice : mikeVoice;
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker, lang, voice })
      });

      if (response.status === 429) {
        // We shouldn't get 429 anymore, server handles fallback.
        return null;
      }

      if (!response.ok) return null;

      const data = await response.json();
      return { audio: data.audio || null, isRawPCM: data.isRawPCM === true, isFallback: data.isFallback };
    } catch (e) {
      console.warn(`Fetch TTS error for ${speaker}:`, e);
      return null;
    }
  };

  const playGoogleTranslateDirectFallback = (text: string, lang: string, speaker: 'Sophia' | 'Mike' | 'Marie' | 'Joe' = 'Sophia'): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      try {
        const targetTl = lang.toLowerCase().startsWith('es') ? 'es' : 'en';
        
        // Simple text splitter helper to split into safe 120-character chunks
        const chunks: string[] = [];
        const words = text.split(/\s+/);
        let currentChunk = "";
        for (const word of words) {
          if ((currentChunk + " " + word).length > 120) {
            if (currentChunk.trim()) chunks.push(currentChunk.trim());
            currentChunk = word;
          } else {
            currentChunk = currentChunk ? (currentChunk + " " + word) : word;
          }
        }
        if (currentChunk.trim()) chunks.push(currentChunk.trim());

        if (chunks.length === 0) {
          resolve(true);
          return;
        }

        let currentIdx = 0;
        
        const playNext = () => {
          if (currentIdx >= chunks.length || !isPlayingRef.current) {
            resolve(true);
            return;
          }
          
          let hasMovedToNext = false;
          const moveToNext = () => {
            if (hasMovedToNext) return;
            hasMovedToNext = true;
            currentIdx++;
            playNext();
          };
          
          const chunkText = chunks[currentIdx];
          const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunkText)}&tl=${targetTl}&client=tw-ob`;
          
          const audio = new Audio(url);
          (window as any)._activeFallbackAudio = audio;
          
          audio.onended = () => {
            moveToNext();
          };
          
          audio.onerror = (err) => {
            console.warn("Direct fallback chunk play failed, falling back to speech synthesis:", err);
            speakNativeHelper(chunkText, lang, speaker).then(() => {
              moveToNext();
            });
          };
          
          audio.play().catch(playErr => {
            console.warn("Direct fallback audio play failed, falling back to speech synthesis:", playErr);
            speakNativeHelper(chunkText, lang, speaker).then(() => {
              moveToNext();
            });
          });
        };
        
        playNext();
      } catch (e) {
        console.warn("Direct Google Translate fallback failed:", e);
        resolve(false);
      }
    });
  };

  const playTTS = async (text: string, speaker: 'Sophia' | 'Mike' | 'Marie' | 'Joe', lang: string = 'en-US', preFetchedData?: {audio: string | null; isRawPCM: boolean; isFallback?: boolean} | null) => {
    if (!isPlayingRef.current) return;
    setTtsErrorMsg(''); // Clear previous error
    try {
      let audioData = preFetchedData;
      
      if (!audioData?.audio) {
        audioData = await fetchTTSAudio(text, speaker, lang);
      }

      if (audioData?.audio && isPlayingRef.current) {
        await playAudioData(audioData.audio, audioData.isRawPCM, 24000, speaker, audioData.isFallback);
      } else {
        throw new Error("No audio data available");
      }
    } catch (e: any) {
      console.warn("Server-side TTS failed or timed out. Falling back to direct HTML5 browser stream.", e);
      setTtsErrorMsg(`[Fallback Active] Streaming audio...`);
      if (!isPlayingRef.current) return;

      await playGoogleTranslateDirectFallback(text, lang || 'en-US', speaker);
    }
  };

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMicError(true);
      // Fallback if browser doesn't support speech recognition
      setTimeout(() => {
        handleUserFinishedSpeaking("(Browser doesn't support voice. Simulating response...)");
      }, 3000);
      return;
    }

    // Prevents zombie instances from conflicting
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false; // native speech-end detection
      recognition.interimResults = true;
      recognition.lang = language || 'en-US'; 

      let finalTranscript = '';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('');
        setMicError(false);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        const currentText = finalTranscript + interim;
        setInterimText(currentText);

        // Reset silence detection timeout on speech activity
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        if (currentText.trim()) {
          silenceTimeoutRef.current = setTimeout(() => {
            console.log("Speech pause detected. Stopping recognition to submit.");
            try {
              recognition.stop();
            } catch (e) {}
          }, 1500); // 1.5 seconds of silence since last word spoken to prevent cutting off mid-sentence
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn("Speech recognition error:", event.error);
        }
        if (event.error === 'not-allowed') {
          setMicError(true);
          micBlockedRef.current = true;
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }

        const responseText = finalTranscript.trim();
        
        if (!responseText) {
          // Restart listening ONLY if the microphone is fully authorized and we're in continuous mode
          if (isPlayingRef.current && !micBlockedRef.current) {
            setTimeout(() => {
              if (isPlayingRef.current && !isListeningRef.current) {
                startListening();
              }
            }, 300);
          }
          return;
        }

        handleUserFinishedSpeaking(responseText);
      };

      recognition.start();
    } catch (e: any) {
      console.warn("SpeechRecognition start exception:", e);
      if (e?.name !== 'InvalidStateError') {
        setIsListening(false);
        setMicError(true);
        micBlockedRef.current = true;
      }
    }
  };

  const handleUserFinishedSpeaking = (text: string) => {
    isInterruptedRef.current = false;
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      speaker: 'user',
      text: text
    }]);
    setInterimText('');

    processChatResponse(text);
  };

  const startDemo = async () => {
    // Unlock speech synthesis on user interaction (fixes iOS/Safari/Chrome silence)
    const unlockAudio = () => {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    };
    unlockAudio();

    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch (e) {}
    }
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    
    setMessages([]);
    setCapturedData({ 
      intent: '', 
      industry: '', 
      tier: '', 
      staffingNeeds: '', 
      appointmentDate: '',
      appointmentTime: '', 
      appointmentConfirmed: false, 
      clientName: '',
      contact: '' 
    });
    setInterimText('');
    setIsListening(false);
    setMicError(false);
    micBlockedRef.current = false;
    setLanguage('en-US');
    setIsPlaying(true);
    isPlayingRef.current = true;
    emailSentRef.current = false;
    
    if (bgmEnabled && syntheticBgmRef.current) {
      syntheticBgmRef.current.start();
    }
    
    isInterruptedRef.current = false;
    
    await startVAD();
    chatHistoryRef.current = [];
    
    const sophiaIntro = MARIE_INTRO_TEXT;
    const mikeIntro = JOE_INTRO_TEXT;
    
    chatHistoryRef.current.push({ role: 'user', parts: [{ text: "Start the demo." }] });
    chatHistoryRef.current.push({ 
      role: 'model', 
      parts: [{ text: JSON.stringify({ messages: [{speaker: 'Marie', text: sophiaIntro}, {speaker: 'Joe', text: mikeIntro}] }) }] 
    });
    
    setIsProcessing(false);
    
    // Start fetching audio immediately, but use cache if available
    const sophiaAudioPromise = introAudioCacheRef.current.marie ? Promise.resolve(introAudioCacheRef.current.marie) : fetchTTSAudio(sophiaIntro, 'Marie', 'en-US');
    const mikeAudioPromise = introAudioCacheRef.current.joe ? Promise.resolve(introAudioCacheRef.current.joe) : fetchTTSAudio(mikeIntro, 'Joe', 'en-US');
    
    // Optimistic UI for Marie
    setMessages([{ id: Date.now(), speaker: 'Marie', text: sophiaIntro, lang: 'en-US' }]);
    setCurrentSpeaker('Marie');
    
    const sophiaAudio = await sophiaAudioPromise;
    if (sophiaAudio && !introAudioCacheRef.current.marie) {
      introAudioCacheRef.current.marie = sophiaAudio;
    }
    if (!isInterruptedRef.current && isPlayingRef.current) {
      await playTTS(sophiaIntro, 'Marie', 'en-US', sophiaAudio);
    }
    
    if (isInterruptedRef.current || !isPlayingRef.current) return;
    await new Promise(resolve => setTimeout(resolve, 20));
    
    // Optimistic UI for Joe
    setMessages(prev => [...prev, { id: Date.now(), speaker: 'Joe', text: mikeIntro, lang: 'en-US' }]);
    setCurrentSpeaker('Joe');
    
    const mikeAudio = await mikeAudioPromise;
    if (mikeAudio && !introAudioCacheRef.current.joe) {
      introAudioCacheRef.current.joe = mikeAudio;
    }
    if (!isInterruptedRef.current && isPlayingRef.current) {
      await playTTS(mikeIntro, 'Joe', 'en-US', mikeAudio);
    }
    
    if (!isInterruptedRef.current) {
      setCurrentSpeaker('idle');
      if (isPlayingRef.current) {
        startListening();
      }
    }
  };

  const stopDemo = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    isInterruptedRef.current = false;
    
    if (syntheticBgmRef.current) {
      syntheticBgmRef.current.stop();
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    window.speechSynthesis.cancel();
    if ((window as any)._activeFallbackAudio) {
      try {
        (window as any)._activeFallbackAudio.pause();
        (window as any)._activeFallbackAudio.src = "";
      } catch (e) {}
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch (e) {}
    }
    stopVAD();
    setIsListening(false);
    setCurrentSpeaker('idle');
  };

  const resetDemo = () => {
    stopDemo();
    setMessages([]);
    chatHistoryRef.current = [];
    setCapturedData({ 
      intent: '', 
      industry: '', 
      tier: '', 
      staffingNeeds: '', 
      appointmentDate: '',
      appointmentTime: '', 
      appointmentConfirmed: false, 
      clientName: '',
      contact: '' 
    });
    setInterimText('');
    setLastError(null);
    setTtsErrorMsg('');
    emailSentRef.current = false;
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 md:my-12 p-4 md:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00e5ff]/5 rounded-[100%] blur-[100px] pointer-events-none" />

      <AnimatePresence>
        {/* Indicators removed per user request */}
      </AnimatePresence>



      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-12 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white/60 uppercase tracking-widest text-sm font-semibold text-center">Live Interaction Engine</span>
            
            {/* Real-time Volume Visualizer */}
            {isPlaying && (
              <div className="flex items-center gap-1 h-3 ml-2">
                {[...Array(8)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="w-1 rounded-full bg-[#00e5ff]"
                    animate={{ 
                      height: volLevel > (i * 12) ? '100%' : '20%',
                      opacity: volLevel > (i * 12) ? 1 : 0.2,
                      boxShadow: volLevel > (i * 12) ? '0 0 8px #00e5ff' : 'none'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={() => {
              const newState = !bgmEnabled;
              setBgmEnabled(newState);
              if (syntheticBgmRef.current) {
                if (newState) {
                  syntheticBgmRef.current.start();
                } else {
                  syntheticBgmRef.current.stop();
                }
              }
            }}
            className={`px-4 py-2 rounded-full transition-all uppercase tracking-widest text-xs font-bold flex items-center gap-2 border ${
              bgmEnabled 
                ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]/50' 
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/10'
            }`}
          >
            <Music className="w-3 h-3" />
            {bgmEnabled ? 'BGM: ON' : 'BGM: OFF'}
          </button>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-4 py-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest text-xs font-bold flex items-center gap-2 border border-white/10"
          >
            {showTranscript ? <MessageSquareOff className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </button>

          {(messages.length > 0 || capturedData.intent) && (
            <button
              onClick={resetDemo}
              className="px-4 py-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest text-xs font-bold flex items-center gap-2 border border-white/10"
            >
              <RotateCcw className="w-3 h-3" /> Reset Demo
            </button>
          )}

          {!isPlaying ? (
            <button 
              onClick={startDemo}
              className="px-6 py-3 rounded-full bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50 hover:bg-[#00e5ff]/30 transition-all uppercase tracking-widest text-sm font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-2 animate-pulse"
            >
              <Mic className="w-4 h-4" /> Start Live Interaction
            </button>
          ) : (
            <button 
              onClick={stopDemo}
              className="px-6 py-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all uppercase tracking-widest text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-2"
            >
              <MicOff className="w-4 h-4" /> Stop Demo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        {/* Marie Avatar */}
        <div className="flex flex-col items-center justify-start gap-4">
          <AgentAvatar 
            name="Marie" 
            isActive={currentSpeaker === 'Marie' || currentSpeaker === 'idle'} 
            isSpeaking={currentSpeaker === 'Marie'} 
            isProcessing={isProcessing}
            onClick={() => setSelectedAgentProfile('Marie')}
          />
          {!isPlaying && (
            <div className="flex flex-col gap-2 w-full max-w-[170px] relative z-20">
              <button
                id="sophia-pitch-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  playIntroPitch('Marie');
                }}
                disabled={isPlayingIntroPitch !== null}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00e5ff]/40 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-40"
              >
                <Volume2 className={`w-3.5 h-3.5 text-[#00e5ff] ${isPlayingIntroPitch === 'Marie' ? 'animate-bounce' : ''}`} />
                {isPlayingIntroPitch === 'Marie' ? 'Playing Pitch...' : 'Play Marie Pitch'}
              </button>
              <button
                id="sophia-voice-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAgentProfile('Marie');
                }}
                disabled={isPlayingIntroPitch !== null}
                className="w-full px-3 py-2 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/30 hover:bg-[#00e5ff]/20 hover:border-[#00e5ff] active:scale-95 text-[#00e5ff] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.05)] disabled:opacity-40"
              >
                <Settings className="w-3.5 h-3.5" />
                Change Custom Voice
              </button>
            </div>
          )}
        </div>

        {/* Center Area: Transcript */}
        <div id="interaction-box" className="h-[400px] md:h-[500px] bg-black/40 rounded-3xl border border-white/10 p-4 md:p-6 relative shadow-inner overflow-hidden flex flex-col">
          {showTranscript ? (
            <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-4 scroll-smooth pr-2 mb-2">
              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col justify-center items-center h-full text-center p-6 bg-white/[0.01] border border-white/5 rounded-2xl relative min-h-[340px]"
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                      <span className="text-[9px] uppercase tracking-wider text-[#00e5ff] font-extrabold font-mono bg-[#00e5ff]/10 px-2 py-0.5 rounded border border-[#00e5ff]/20">Studio Pitch Calibration</span>
                    </div>

                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00e5ff]/10 to-[#00b0ff]/10 flex items-center justify-center border border-[#00e5ff]/20 mb-4 animate-pulse">
                      <Sparkles className="w-5 h-5 text-[#00e5ff]" />
                    </div>

                    <h3 className="text-sm font-extrabold text-white tracking-widest uppercase mb-2">Vocal Identification & Pitch Hub</h3>
                    <p className="text-xs text-white/50 leading-relaxed max-w-lg mb-6">
                      Customize perfect, human-sounding AI specialists. Click on any specialist profile below to preview neural accents, swap voices, and configure active pitch-equalizers when the demo is reset or active!
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                      <div 
                        onClick={() => setSelectedAgentProfile('Marie')}
                        className="bg-black/50 border border-[#00e5ff]/20 hover:border-[#00e5ff]/60 p-4 rounded-xl cursor-pointer transition-all hover:bg-[#00e5ff]/5 flex flex-col items-center group text-center relative"
                      >
                        <div className="w-12 h-12 rounded-lg border border-[#00e5ff]/40 overflow-hidden mb-2 group-hover:scale-105 transition-transform relative">
                          <img src={mariePic} alt="Marie" className="w-full h-full object-cover animate-pulse" referrerPolicy="no-referrer" />
                        </div>
                        {/* Custom Micro Logo badge for Marie */}
                        <div className="absolute top-2 right-6 w-4 h-4 rounded-full border border-white/20 bg-black flex items-center justify-center overflow-hidden shadow">
                          <img src="/logo.jpg" alt="badge" className="w-3 h-3 object-contain rounded-full" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-[#00e5ff] transition-colors">Marie (Intake)</span>
                        <span className="text-[9px] text-[#00e5ff] uppercase font-bold tracking-widest mt-1.5 px-1.5 py-0.5 bg-[#00e5ff]/10 rounded border border-[#00e5ff]/10 hover:bg-[#00e5ff]/20">Tweak Pitch & Accent</span>
                      </div>

                      <div 
                        onClick={() => setSelectedAgentProfile('Joe')}
                        className="bg-black/50 border border-[#00b0ff]/20 hover:border-[#00b0ff]/60 p-4 rounded-xl cursor-pointer transition-all hover:bg-[#00b0ff]/5 flex flex-col items-center group text-center relative"
                      >
                        <div className="w-12 h-12 rounded-lg border border-[#00b0ff]/40 overflow-hidden mb-2 group-hover:scale-105 transition-transform relative">
                          <img src={joePic} alt="Joe" className="w-full h-full object-cover animate-pulse" referrerPolicy="no-referrer" />
                        </div>
                        {/* Custom Micro Logo badge for Joe */}
                        <div className="absolute top-2 right-6 w-4 h-4 rounded-full border border-white/20 bg-black flex items-center justify-center overflow-hidden shadow">
                          <img src="/logo.jpg" alt="badge" className="w-3 h-3 object-contain rounded-full" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-[#00b0ff] transition-colors">Joe (Technical)</span>
                        <span className="text-[9px] text-[#00b0ff] uppercase font-bold tracking-widest mt-1.5 px-1.5 py-0.5 bg-[#00b0ff]/10 rounded border border-[#00b0ff]/10 hover:bg-[#00b0ff]/20">Tweak Pitch & Accent</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {messages.map((msg, idx) => (
                  <motion.div
                    key={`${msg.id}-${idx}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col ${msg.speaker === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                        {msg.speaker === 'user' ? 'Client' : msg.speaker}
                      </span>
                    </div>
                    <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg ${
                      msg.speaker === 'user' 
                        ? 'bg-white/10 text-white rounded-tr-sm border border-white/5' 
                        : (msg.speaker === 'Marie' || msg.speaker === 'Sophia')
                          ? 'bg-gradient-to-br from-[#b388ff]/20 to-[#00e5ff]/20 text-[#e0f7fa] border border-[#00e5ff]/30 rounded-tl-sm shadow-[0_0_15px_rgba(179,136,255,0.1)]'
                          : 'bg-gradient-to-br from-[#00b0ff]/20 to-[#00e5ff]/20 text-[#e0f7fa] border border-[#00e5ff]/30 rounded-tl-sm shadow-[0_0_15px_rgba(0,176,255,0.1)]'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isProcessing && (
                  <motion.div
                    key="processing-indicator"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#00e5ff]/50 font-bold animate-pulse">
                        Generating Response...
                      </span>
                    </div>
                    <div className="px-5 py-4 rounded-2xl max-w-[85%] bg-gradient-to-br from-[#b388ff]/10 to-[#00e5ff]/10 border border-[#00e5ff]/20 rounded-tl-sm shadow-sm flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-[#00e5ff]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                       <span className="w-2 h-2 rounded-full bg-[#00e5ff]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                       <span className="w-2 h-2 rounded-full bg-[#00e5ff]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}

                {isListening && (
                  <motion.div
                    key="listening-status-indicator"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-green-400 font-extrabold flex items-center gap-1.5 animate-pulse bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        🎤 Mic is live - go ahead and speak!
                      </span>
                    </div>
                    {interimText && (
                      <div className="px-5 py-3 rounded-2xl max-w-[85%] text-sm bg-white/5 text-white/70 italic border border-white/10 rounded-tl-sm animate-pulse">
                        "{interimText}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                 {/* Abstract Voice Visualizer */}
                <motion.div 
                  className={`absolute inset-0 rounded-full border-2 ${(currentSpeaker === 'Marie' || currentSpeaker === 'Sophia') ? 'border-[#00e5ff]/50' : (currentSpeaker === 'Joe' || currentSpeaker === 'Mike') ? 'border-[#00b0ff]/50' : 'border-white/10'}`}
                  animate={{ scale: currentSpeaker !== 'idle' ? [1, 1.5, 1] : 1, opacity: currentSpeaker !== 'idle' ? [0.5, 0, 0.5] : 0.2 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className={`absolute inset-4 rounded-full border-2 ${(currentSpeaker === 'Marie' || currentSpeaker === 'Sophia') ? 'border-[#00e5ff]/50' : (currentSpeaker === 'Joe' || currentSpeaker === 'Mike') ? 'border-[#00b0ff]/50' : 'border-white/10'}`}
                  animate={{ scale: currentSpeaker !== 'idle' ? [1, 1.3, 1] : 1, opacity: currentSpeaker !== 'idle' ? [0.8, 0, 0.8] : 0.2 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
                />
                <div className={`w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-md border ${(currentSpeaker === 'Marie' || currentSpeaker === 'Sophia') ? 'bg-[#00e5ff]/20 border-[#00e5ff]/50 shadow-[0_0_30px_rgba(0,229,255,0.3)]' : (currentSpeaker === 'Joe' || currentSpeaker === 'Mike') ? 'bg-[#00b0ff]/20 border-[#00b0ff]/50 shadow-[0_0_30px_rgba(0,176,255,0.3)]' : 'bg-white/5 border-white/10'}`}>
                  <Activity className={`w-8 h-8 ${(currentSpeaker === 'Marie' || currentSpeaker === 'Sophia') ? 'text-[#00e5ff]' : (currentSpeaker === 'Joe' || currentSpeaker === 'Mike') ? 'text-[#00b0ff]' : 'text-white/20'}`} />
                </div>
              </div>
              <p className="mt-12 text-white/50 uppercase tracking-widest text-xs font-bold h-4">
                {(currentSpeaker === 'Marie' || currentSpeaker === 'Sophia') ? 'Marie is speaking...' : (currentSpeaker === 'Joe' || currentSpeaker === 'Mike') ? 'Joe is speaking...' : ''}
              </p>
            </div>
          )}

          {/* Core Chat text input bar for resilient communication */}
          {isPlaying && (
            <div className="flex flex-col gap-2 mt-2 w-full">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = typedMessage.trim();
                  if (!text) return;
                  setTypedMessage('');
                  stopAIAudio(false);
                  handleUserFinishedSpeaking(text);
                }}
                className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 focus-within:border-[#00e5ff]/50 focus-within:ring-1 focus-within:ring-[#00e5ff]/30 transition-all relative z-40 w-full"
              >
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type your answer, or just speak to me..."
                  disabled={isProcessing}
                  className="flex-1 bg-transparent px-4 py-2 border-0 focus:outline-none text-white placeholder-white/30 text-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !typedMessage.trim()}
                  className="px-4 py-2 rounded-xl bg-[#00e5ff] hover:bg-[#00b0ff] disabled:bg-gray-800 disabled:text-white/30 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:shadow-none cursor-pointer"
                >
                  Send
                </button>
              </form>

              {/* Quick Replies Row */}
              <div className="flex flex-wrap gap-1.5 items-center justify-start mt-1 px-1 relative z-50">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-extrabold flex items-center gap-1 mr-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#00e5ff] animate-pulse" />
                  Quick replies:
                </span>
                {getQuickReplies().map((reply, ridx) => (
                  <button
                    key={ridx}
                    type="button"
                    onClick={() => {
                      if (isProcessing) return;
                      stopAIAudio(false);
                      handleUserFinishedSpeaking(reply);
                    }}
                    disabled={isProcessing}
                    className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00e5ff]/30 text-[11px] text-white/70 hover:text-[#00e5ff] transition-all cursor-pointer disabled:opacity-40 disabled:hover:text-white/70 disabled:hover:border-white/10"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Joe Avatar */}
        <div className="flex flex-col items-center justify-start gap-4">
          <AgentAvatar 
            name="Joe" 
            isActive={currentSpeaker === 'Joe' || currentSpeaker === 'idle'} 
            isSpeaking={currentSpeaker === 'Joe'} 
            isProcessing={isProcessing}
            onClick={() => setSelectedAgentProfile('Joe')}
          />
          {!isPlaying && (
            <div className="flex flex-col gap-2 w-full max-w-[170px] relative z-20">
              <button
                id="mike-pitch-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  playIntroPitch('Joe');
                }}
                disabled={isPlayingIntroPitch !== null}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00b0ff]/40 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-40"
              >
                <Volume2 className={`w-3.5 h-3.5 text-[#00b0ff] ${isPlayingIntroPitch === 'Joe' ? 'animate-bounce' : ''}`} />
                {isPlayingIntroPitch === 'Joe' ? 'Playing Pitch...' : 'Play Joe Pitch'}
              </button>
              <button
                id="mike-voice-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAgentProfile('Joe');
                }}
                disabled={isPlayingIntroPitch !== null}
                className="w-full px-3 py-2 rounded-xl bg-[#00b0ff]/10 border border-[#00b0ff]/30 hover:bg-[#00b0ff]/20 hover:border-[#00b0ff] active:scale-95 text-[#00b0ff] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,176,255,0.05)] disabled:opacity-40"
              >
                <Settings className="w-3.5 h-3.5" />
                Change Custom Voice
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Data Capture Overlay - Shows in real-time as fields are captured to prove the data was taken down */}
      <AnimatePresence>
        {(capturedData.clientName || capturedData.industry || capturedData.staffingNeeds || capturedData.contact || capturedData.appointmentConfirmed) && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`mt-12 w-full max-w-2xl mx-auto bg-black/95 backdrop-blur-xl border rounded-2xl p-6 relative z-20 transition-all duration-300 ${
              (capturedData.contact || capturedData.appointmentConfirmed) 
                ? 'border-[#00e5ff] shadow-[0_10px_40px_rgba(0,229,255,0.25)]' 
                : 'border-white/10 shadow-[0_5px_20px_rgba(255,255,255,0.02)]'
            }`}
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                {(capturedData.contact || capturedData.appointmentConfirmed) ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff]/40 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00e5ff]"></span>
                  </span>
                )}
                <span className="text-xs uppercase tracking-widest text-white font-bold">
                  {(capturedData.contact || capturedData.appointmentConfirmed) 
                    ? 'Lead Captured Successfully' 
                    : 'Real-Time Voice Intake Docket (Capturing...)'}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
                {(capturedData.contact || capturedData.appointmentConfirmed) ? 'Synced to CRM' : 'Live Capture'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {capturedData.intent && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2">
                  <span className="text-white/40 block mb-1 text-[10px] uppercase tracking-wider">Client Intent</span>
                  <span className="text-white font-medium">{capturedData.intent}</span>
                </div>
              )}
              {capturedData.clientName && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2">
                  <span className="text-white/40 block mb-1 text-[10px] uppercase tracking-wider">Client Name</span>
                  <span className="text-white font-medium">{capturedData.clientName}</span>
                </div>
              )}
              {(capturedData.appointmentDate || capturedData.appointmentTime) && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-white/40 block mb-1 text-[10px] uppercase tracking-wider">Requested Appointment</span>
                    <span className="text-white font-medium">
                      {capturedData.appointmentDate && `${capturedData.appointmentDate} `}
                      {capturedData.appointmentTime && `at ${capturedData.appointmentTime}`}
                    </span>
                  </div>
                  {capturedData.appointmentConfirmed ? (
                    <span className="text-sm text-green-400 flex items-center gap-1 font-bold"><CheckCircle2 className="w-4 h-4" /> Confirmed</span>
                  ) : (
                    <span className="text-sm text-yellow-400 animate-pulse font-medium">Pending Confirmation...</span>
                  )}
                </div>
              )}
              {capturedData.industry && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-white/40 block mb-1 text-[10px] uppercase tracking-wider">Industry</span>
                  <span className="text-white font-medium">{capturedData.industry}</span>
                </div>
              )}
              {capturedData.tier && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-white/40 block mb-1 text-[10px] uppercase tracking-wider">Website Tier</span>
                  <span className="text-white font-medium">{capturedData.tier}</span>
                </div>
              )}
              {capturedData.staffingNeeds && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-white/40 block mb-1 text-[10px] uppercase tracking-wider">Staffing Needs</span>
                  <span className="text-white font-medium">{capturedData.staffingNeeds}</span>
                </div>
              )}
              {capturedData.contact && (
                <div className="bg-[#00e5ff]/10 p-4 rounded-xl border border-[#00e5ff]/20 col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[#00e5ff]/60 block mb-1 text-[10px] uppercase tracking-wider">Contact Info</span>
                    <span className="text-[#00e5ff] font-medium text-lg">{capturedData.contact}</span>
                  </div>
                  <Cpu className="w-6 h-6 text-[#00e5ff]/50" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AgentProfileModal 
        isOpen={selectedAgentProfile !== null} 
        onClose={() => setSelectedAgentProfile(null)} 
        agent={selectedAgentProfile} 
        marieVoice={sophiaVoice}
        setMarieVoice={handleSetSophiaVoice}
        joeVoice={mikeVoice}
        setJoeVoice={handleSetMikeVoice}
      />

      <audio 
        ref={bgmAudioRef} 
        loop 
      />
    </div>
  );
}
