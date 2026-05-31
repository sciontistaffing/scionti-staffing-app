import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Sparkles, Code, Briefcase, Award, Clock, Volume2, Check } from 'lucide-react';
import mariePic from '../assets/images/marie_profile_1779927562287.png';
import joePic from '../assets/images/joe_profile_1779927538635.png';

interface AgentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: 'Marie' | 'Joe' | null;
  marieVoice: string;
  setMarieVoice: (voice: string) => void;
  joeVoice: string;
  setJoeVoice: (voice: string) => void;
}

export function AgentProfileModal({ 
  isOpen, 
  onClose, 
  agent, 
  marieVoice, 
  setMarieVoice, 
  joeVoice, 
  setJoeVoice 
}: AgentProfileModalProps) {
  const [isPlayingPreview, setIsPlayingPreview] = useState<string | null>(null);

  if (!agent) return null;

  const isMarie = agent === 'Marie';
  const currentVoiceId = isMarie ? marieVoice : joeVoice;
  const setVoice = isMarie ? setMarieVoice : setJoeVoice;

  const voicesList = isMarie 
    ? [
        { id: 'Gemini', name: 'Sophia (Neural) 🌟', desc: 'Vibrant, Warm & Youthfully Energetic (Primary)' },
        { id: 'Kimberly', name: 'Sophia (Expressive) 🇺🇸', desc: 'Highly Upbeat & Active' },
        { id: 'Salli', name: 'Lucy (Conversational) 🇺🇸', desc: 'Friendly, Expressive & Bright' },
        { id: 'Joanna', name: 'Joanna (Professional) 🇺🇸', desc: 'Smooth, Corporate & Engaging' },
        { id: 'Mia', name: 'Mia (Bilingual) 🇲🇽/🇺🇸', desc: 'Fluid Bilingual Spanish-English' },
        { id: 'Penelope', name: 'Elena (Bilingual) 🇲🇽', desc: 'Soft, Friendly Accented' },
        { id: 'Conchita', name: 'Isabella (Castilian) 🇪🇸', desc: 'Traditional Spanish Vocalization' },
      ]
    : [
        { id: 'Gemini', name: 'Mike (Neural) 🌟', desc: 'Action-Oriented, Dynamic & Enthusiastic (Primary)' },
        { id: 'Joey', name: 'Mike (Expressive) 🇺🇸', desc: 'Bright, High-Energy & Fast' },
        { id: 'Matthew', name: 'David (Professional) 🇺🇸', desc: 'Clear, Executive & Confident' },
        { id: 'Andres', name: 'Andres (Bilingual) 🇲🇽/🇺🇸', desc: 'Fluid Bilingual Spanish-English' },
        { id: 'Miguel', name: 'Mateo (Bilingual) 🇲🇽', desc: 'Clear Latin American Accent' },
        { id: 'Enrique', name: 'Carlos (Castilian) 🇪🇸', desc: 'Traditional Male Castilian Voice' },
      ];

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
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStringHelper(view, 36, 'data');
    view.setUint32(40, pcmBytes.length, true);

    const dst = new Uint8Array(buffer, 44);
    dst.set(pcmBytes);

    return buffer;
  };

  const handlePlayPreview = async (voiceId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (isPlayingPreview) return;
    setIsPlayingPreview(voiceId);

    try {
      const previewText = isMarie 
        ? "Hello, this is my premium voice sample." 
        : "Hey, this is my custom audio profile.";

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: previewText, 
          speaker: agent, 
          lang: 'en-US',
          voice: voiceId 
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audio) {
          const binaryString = atob(data.audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          let audioBuffer: AudioBuffer;
          if (data.isRawPCM) {
            const wavArrayBuffer = pcmToWav(bytes, 24000);
            audioBuffer = await audioCtx.decodeAudioData(wavArrayBuffer);
          } else {
            audioBuffer = await audioCtx.decodeAudioData(bytes.buffer.slice(0));
          }
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioCtx.destination);
          
          source.start(0);
          source.onended = () => {
            setIsPlayingPreview(null);
          };
        } else {
          setIsPlayingPreview(null);
        }
      } else {
        setIsPlayingPreview(null);
      }
    } catch (err) {
      console.warn("Failed voice preview:", err);
      setIsPlayingPreview(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
           onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-2xl overflow-hidden rounded-3xl border ${
              isMarie ? 'border-[#00e5ff]/30 bg-gradient-to-b from-[#00e5ff]/10 to-black' : 'border-[#00b0ff]/30 bg-gradient-to-b from-[#00b0ff]/10 to-black'
            } p-6 md:p-8 shadow-2xl my-8`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-6">
              <div className="flex-shrink-0 mx-auto md:mx-0 relative">
                <div className={`w-28 h-28 rounded-2xl flex items-center justify-center border-2 overflow-hidden ${
                  isMarie ? 'bg-[#00e5ff]/20 border-[#00e5ff]/50 shadow-[0_0_30px_rgba(0,229,255,0.3)]' : 'bg-[#00b0ff]/20 border-[#00b0ff]/50 shadow-[0_0_30px_rgba(0,176,255,0.3)]'
                }`}>
                  <img 
                    src={isMarie ? mariePic : joePic} 
                    alt={agent}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Beautiful lapel badge absolute overlay on profile picture */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border border-white/20 bg-black flex items-center justify-center overflow-hidden shadow-xl z-20">
                  <img 
                    src="/logo.jpg" 
                    alt="Scionti Badge Pin" 
                    className="w-5 h-5 object-contain rounded-full" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{isMarie ? 'Sophia' : 'Mike'}</h2>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                    isMarie ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/30' : 'bg-[#00b0ff]/10 text-[#00b0ff] border-[#00b0ff]/30'
                  }`}>
                    {isMarie ? 'Intake Lead' : 'Tech Lead'}
                  </div>
                </div>
                
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {isMarie 
                    ? "Sophia (referenced as Marie in communication logs) is our premium Spanish-English Intake Lead. Dynamic and polite, she captures client needs down flawlessly to customize enterprise staff."
                    : "Mike (referenced as Joe in communication logs) is our expert Technical Specialist. Full of energy, he designs robust, tailored backend models that keep your front office booking clients 24/7."}
                </p>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {isMarie ? <Briefcase className="w-3.5 h-3.5 text-[#00e5ff]" /> : <Code className="w-3.5 h-3.5 text-[#00b0ff]" />}
                      <span className="text-white font-semibold text-xs">Expertise</span>
                    </div>
                    <p className="text-white/40 text-[10px]">
                      {isMarie ? "Client Intake, Needs" : "System Diagnostics"}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {isMarie ? <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" /> : <Shield className="w-3.5 h-3.5 text-[#00b0ff]" />}
                      <span className="text-white font-semibold text-xs">Approach</span>
                    </div>
                    <p className="text-white/40 text-[10px]">
                      {isMarie ? "Charismatic" : "Enthusiastic"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Voice Customized Hub */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
                  <Volume2 className={`w-4 h-4 ${isMarie ? 'text-[#00e5ff]' : 'text-[#00b0ff]'}`} />
                  Select Premium Voice Identity
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#00e5ff] font-bold bg-[#00e5ff]/10 px-2 py-0.5 rounded border border-[#00e5ff]/30">
                  Adaptive Multilingual
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {voicesList.map((voice) => {
                  const isSelected = voice.id === currentVoiceId;
                  return (
                    <div
                      key={voice.id}
                      onClick={() => setVoice(voice.id)}
                      className={`relative flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected 
                          ? isMarie 
                            ? 'bg-[#00e5ff]/10 border-[#00e5ff]/60 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                            : 'bg-[#00b0ff]/10 border-[#00b0ff]/60 shadow-[0_0_15px_rgba(0,176,255,0.2)]'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          {voice.name}
                          {isSelected && (
                            <Check className={`w-3.5 h-3.5 ${isMarie ? 'text-[#00e5ff]' : 'text-[#00b0ff]'}`} />
                          )}
                        </span>
                        <span className="text-[10px] text-white/50 mt-0.5">{voice.desc}</span>
                      </div>

                      <button
                        onClick={(e) => handlePlayPreview(voice.id, e)}
                        disabled={isPlayingPreview !== null}
                        className={`p-2 rounded-xl transition-all ${
                          isPlayingPreview === voice.id 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/40 animate-pulse'
                            : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                        title="Play voice preview"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
