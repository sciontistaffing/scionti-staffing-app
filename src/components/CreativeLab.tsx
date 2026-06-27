import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Video, 
  Sparkles, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Loader2, 
  FileVideo, 
  Image as ImageIcon, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

type TabType = 'music' | 'video';
type VideoMode = 'text' | 'image';

export function CreativeLab() {
  const [activeTab, setActiveTab] = useState<TabType>('music');
  
  // Music state
  const [musicPrompt, setMusicPrompt] = useState('');
  const [durationType, setDurationType] = useState<'clip' | 'pro'>('clip');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<{
    audio: string;
    mimeType: string;
    lyrics?: string;
  } | null>(null);
  const [musicError, setMusicError] = useState<string | null>(null);
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Video state
  const [videoMode, setVideoMode] = useState<VideoMode>('text');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoOperation, setVideoOperation] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [videoError, setVideoError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Poll video status
  useEffect(() => {
    let intervalId: any;
    
    if (videoOperation && videoStatus === 'generating') {
      const checkStatus = async () => {
        try {
          const res = await fetch('/api/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: videoOperation })
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.done) {
              if (data.error) {
                setVideoStatus('failed');
                setVideoError('The rendering engine is temporarily calibrating its visual pipes. Please try again shortly.');
                setIsGeneratingVideo(false);
              } else {
                setVideoStatus('completed');
                setIsGeneratingVideo(false);
              }
            }
          }
        } catch (err: any) {
          console.warn("[Status] Soft warning - polling video status failed (can occur during HMR or network transition):", err.message || err);
        }
      };

      intervalId = setInterval(checkStatus, 5000); // Poll every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoOperation, videoStatus]);

  // Handle music play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (generatedMusic) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audioUrl = `data:${generatedMusic.mimeType};base64,${generatedMusic.audio}`;
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
      setIsPlaying(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [generatedMusic]);

  // Generate Music handler
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setIsGeneratingMusic(true);
    setMusicError(null);
    setGeneratedMusic(null);
    
    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          durationType
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate music.');
      }

      setGeneratedMusic({
        audio: data.audio,
        mimeType: data.mimeType || 'audio/wav',
        lyrics: data.lyrics
      });
    } catch (err: any) {
      setMusicError('The orchestration suite is temporarily optimizing its soundscapes. Please try again shortly.');
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // Generate Video handler
  const handleGenerateVideo = async () => {
    if (videoMode === 'text' && !videoPrompt.trim()) return;
    if (videoMode === 'image' && !selectedImage) return;

    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoOperation(null);
    setVideoStatus('generating');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio,
          image: videoMode === 'image' ? selectedImage : undefined,
          imageMimeType: videoMode === 'image' ? imageMimeType : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate video generation.');
      }

      setVideoOperation(data.operationName);
    } catch (err: any) {
      setVideoError('The rendering engine is temporarily calibrating its visual pipes. Please try again shortly.');
      setVideoStatus('failed');
      setIsGeneratingVideo(false);
    }
  };

  // Handle Image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Downloader for music
  const downloadMusic = () => {
    if (!generatedMusic) return;
    const link = document.createElement('a');
    link.href = `data:${generatedMusic.mimeType};base64,${generatedMusic.audio}`;
    link.download = `scionti-audio-${durationType}-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full max-w-7xl mx-auto py-16 px-4" id="creative-lab">
      <div className="text-center mb-12">
        <span className="px-4 py-1.5 bg-[#00e5ff]/10 text-[#00e5ff] text-[11px] font-black uppercase tracking-[0.25em] rounded-full border border-[#00e5ff]/20">
          Scionti Creative Engine
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mt-4 mb-3">
          AI Staff <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#b388ff]">Media Lab</span>
        </h2>
        <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto">
          Equip your custom AI specialists with the ability to generate customized premium background tracks, branded hold music, or dynamic virtual promotional spokesperson clips.
        </p>
      </div>

      <div className="relative rounded-[2.5rem] bg-black border border-white/5 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#00e5ff_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        </div>

        {/* Tab Selection Headers */}
        <div className="flex border-b border-white/5 bg-white/[0.02]">
          <button 
            onClick={() => setActiveTab('music')}
            className={`flex-1 py-6 px-4 md:px-8 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs md:text-sm transition-all relative ${
              activeTab === 'music' ? 'text-[#00e5ff] bg-white/[0.01]' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Music className="w-4 h-4" />
            Hold Music (Lyria Gen)
            {activeTab === 'music' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00e5ff]" />
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-6 px-4 md:px-8 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs md:text-sm transition-all relative ${
              activeTab === 'video' ? 'text-[#b388ff] bg-white/[0.01]' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Video className="w-4 h-4" />
            AI Video Promos (Veo Gen)
            {activeTab === 'video' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b388ff]" />
            )}
          </button>
        </div>

        {/* Interactive Workspace Area */}
        <div className="p-6 md:p-12 min-h-[500px] flex flex-col justify-between relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'music' ? (
              <motion.div 
                key="music-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
              >
                {/* Left Side: Parameters */}
                <div className="flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">
                      Powered by Lyria AI Model Suite
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-white uppercase mb-4">
                      Tailor Custom Hold & Ambient Melodies
                    </h3>
                    <p className="text-white/60 text-sm mb-6 leading-relaxed">
                      Enter a detailed description of the style, vibe, and instruments to build unique, royalty-free audio tracks that perfectly match your industry.
                    </p>

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 block">
                          Audio Composition Prompt
                        </label>
                        <textarea
                          value={musicPrompt}
                          onChange={(e) => setMusicPrompt(e.target.value)}
                          placeholder="E.g., An elegant, relaxing lo-fi ambient jazz tune with soft piano and subtle saxophone, perfect for a modern dental clinic's call hold queue..."
                          className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/50 transition-all resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 block">
                          Melody Duration & Depth
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setDurationType('clip')}
                            className={`py-3 px-4 rounded-xl border font-bold uppercase tracking-wider text-[11px] transition-all flex flex-col items-center gap-1 ${
                              durationType === 'clip' 
                                ? 'bg-[#00e5ff]/10 border-[#00e5ff]/30 text-[#00e5ff]' 
                                : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <span>Short Melody Clip</span>
                            <span className="text-[9px] opacity-60 font-medium font-mono">Up to 30s (Fast Gen)</span>
                          </button>
                          
                          <button
                            onClick={() => setDurationType('pro')}
                            className={`py-3 px-4 rounded-xl border font-bold uppercase tracking-wider text-[11px] transition-all flex flex-col items-center gap-1 ${
                              durationType === 'pro' 
                                ? 'bg-[#00e5ff]/10 border-[#00e5ff]/30 text-[#00e5ff]' 
                                : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <span>Full Composition</span>
                            <span className="text-[9px] opacity-60 font-medium font-mono">Extended Play (Premium)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateMusic}
                    disabled={isGeneratingMusic || !musicPrompt.trim()}
                    className="w-full mt-6 py-4 px-6 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#00b0ff] text-black font-black uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:shadow-none disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isGeneratingMusic ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Composing Orchestral Wave...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Custom Hold Music
                      </>
                    )}
                  </button>
                </div>

                {/* Right Side: Media Output */}
                <div className="flex flex-col justify-center items-center bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 min-h-[350px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.03)_0%,transparent_100%)]" />
                  
                  {isGeneratingMusic ? (
                    <div className="text-center relative z-10 space-y-4">
                      <div className="relative flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full border-2 border-[#00e5ff]/10 border-t-[#00e5ff] animate-spin" />
                        <Music className="w-8 h-8 text-[#00e5ff] absolute animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-1">Synthesizing Acoustics</h4>
                        <p className="text-xs text-white/40 font-mono">Running neural stream blocks...</p>
                      </div>
                    </div>
                  ) : generatedMusic ? (
                    <div className="w-full text-center relative z-10 space-y-6 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                        <Check className="w-6 h-6 text-[#00e5ff]" />
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-widest font-mono text-[#00e5ff] bg-[#00e5ff]/5 px-3 py-1 rounded-full border border-[#00e5ff]/15">
                          Generation Complete
                        </span>
                        <h4 className="text-lg font-black uppercase tracking-tight text-white mt-2">
                          Your Branded Soundtrack is Ready
                        </h4>
                        <p className="text-xs text-white/50 max-w-sm mx-auto">
                          Click below to preview or download the high-fidelity track for your company hold queues.
                        </p>
                      </div>

                      {/* Waveform Visualization */}
                      <div className="w-full max-w-xs flex items-end justify-center gap-1.5 h-12 py-2">
                        {[...Array(16)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              height: isPlaying ? [10, Math.random() * 35 + 10, 10] : 10
                            }}
                            transition={{
                              duration: 0.8 + (i * 0.05),
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="w-1 bg-[#00e5ff] rounded-full"
                          />
                        ))}
                      </div>

                      {/* Control Buttons */}
                      <div className="flex flex-wrap gap-4 justify-center w-full">
                        <button
                          onClick={togglePlay}
                          className="flex items-center gap-2 py-3 px-6 rounded-xl bg-white text-black font-bold uppercase tracking-wider text-[11px] hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-4 h-4 fill-black" />
                              Pause Preview
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 fill-black" />
                              Play Audio
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={downloadMusic}
                          className="flex items-center gap-2 py-3 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all font-bold uppercase tracking-wider text-[11px] cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          Download WAV
                        </button>
                      </div>

                      {/* Lyrics/Description Box */}
                      {generatedMusic.lyrics && (
                        <div className="w-full mt-4 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-left">
                          <span className="text-[9px] uppercase tracking-widest font-bold text-white/40 block mb-2">Lyrics & Description Metadata</span>
                          <p className="text-xs text-white/70 italic leading-relaxed whitespace-pre-wrap font-mono max-h-32 overflow-y-auto pr-2 scrollbar-thin">
                            {generatedMusic.lyrics}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : musicError ? (
                    <div className="text-center relative z-10 space-y-4 max-w-sm">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-red-500">Generation Failed</h4>
                        <p className="text-xs text-white/50 leading-relaxed mt-2">{musicError}</p>
                      </div>
                      <button
                        onClick={handleGenerateMusic}
                        className="py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider text-[10px] hover:bg-white/10 transition-colors"
                      >
                        Retry Orchestration
                      </button>
                    </div>
                  ) : (
                    <div className="text-center relative z-10 space-y-3">
                      <Music className="w-12 h-12 text-white/10 mx-auto" />
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Studio Idle</h4>
                        <p className="text-xs text-white/30 max-w-xs mt-1">Configure your soundtrack parameters on the left and trigger compilation.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="video-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
              >
                {/* Left Side: Parameters */}
                <div className="flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2 block">
                      Powered by Veo 3 Video AI Ecosystem
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-white uppercase mb-4">
                      Create High-Fidelity Spokesperson Clips
                    </h3>
                    <p className="text-white/60 text-sm mb-6 leading-relaxed">
                      This feature is built for generating high-fidelity marketing video ads, quick social media spokesperson clips, and promotional media campaigns (not real-time video calls). These video clips include <strong className="text-[#b388ff] font-bold">Custom Premium AI Voiceover Generation</strong> tailored specifically to read your custom ad scripts naturally.
                    </p>
                    
                    {/* Toggle Mode */}
                    <div className="flex gap-2 p-1.5 bg-white/[0.02] border border-white/10 rounded-xl mb-6">
                      <button
                        onClick={() => setVideoMode('text')}
                        className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                          videoMode === 'text' ? 'bg-[#b388ff]/10 text-[#b388ff]' : 'text-white/40 hover:text-white/80'
                        }`}
                      >
                        Generate from Text
                      </button>
                      <button
                        onClick={() => setVideoMode('image')}
                        className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                          videoMode === 'image' ? 'bg-[#b388ff]/10 text-[#b388ff]' : 'text-white/40 hover:text-white/80'
                        }`}
                      >
                        Animate Photo (Img-to-Video)
                      </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      {videoMode === 'image' && (
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 block">
                            Upload Starting Photo
                          </label>
                          
                          {selectedImage ? (
                            <div className="relative group rounded-xl border border-white/10 overflow-hidden bg-black aspect-video max-w-sm mx-auto">
                              <img src={selectedImage} alt="Starting asset" className="w-full h-full object-contain" />
                              <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white/80 hover:text-white text-[10px] uppercase tracking-wider font-bold hover:bg-black/80 transition-all border border-white/10"
                              >
                                Replace
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={triggerFileSelect}
                              className="border-2 border-dashed border-white/10 hover:border-[#b388ff]/50 rounded-2xl p-8 text-center cursor-pointer bg-white/[0.01] hover:bg-white/[0.02] transition-all max-w-sm mx-auto"
                            >
                              <ImageIcon className="w-8 h-8 text-white/20 mx-auto mb-3" />
                              <span className="text-xs font-bold uppercase tracking-wider text-white/60 block">Drag & Drop or Select Image</span>
                              <span className="text-[9px] text-white/30 uppercase tracking-widest block mt-1 font-mono">PNG, JPG, WEBP (Max 5MB)</span>
                              <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange}
                                className="hidden" 
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 block">
                          {videoMode === 'image' ? 'Animation / Motion Guidelines (Optional)' : 'Video Scene Prompt'}
                        </label>
                        <textarea
                          value={videoPrompt}
                          onChange={(e) => setVideoPrompt(e.target.value)}
                          placeholder={videoMode === 'image' ? "E.g., Make the specialist in the photo wave and talk directly to the camera with a friendly smile..." : "E.g., A professional virtual AI spokesperson wearing a slate-gray blazer, welcoming visitors to a corporate roofing service platform, highly cinematic..."}
                          className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#b388ff]/50 focus:ring-1 focus:ring-[#b388ff]/50 transition-all resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 block">
                          Aspect Ratio (Frame Geometry)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setAspectRatio('16:9')}
                            className={`py-3 px-4 rounded-xl border font-bold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-2 ${
                              aspectRatio === '16:9' 
                                ? 'bg-[#b388ff]/10 border-[#b388ff]/30 text-[#b388ff]' 
                                : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <span className="w-4 h-2.5 border border-current rounded-sm opacity-80" />
                            <span>16:9 Landscape</span>
                          </button>
                          
                          <button
                            onClick={() => setAspectRatio('9:16')}
                            className={`py-3 px-4 rounded-xl border font-bold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-2 ${
                              aspectRatio === '9:16' 
                                ? 'bg-[#b388ff]/10 border-[#b388ff]/30 text-[#b388ff]' 
                                : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <span className="w-2.5 h-4 border border-current rounded-sm opacity-80" />
                            <span>9:16 Portrait</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo || (videoMode === 'text' && !videoPrompt.trim()) || (videoMode === 'image' && !selectedImage)}
                    className="w-full mt-6 py-4 px-6 rounded-xl bg-gradient-to-r from-[#b388ff] to-[#7c4dff] text-white font-black uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(179,136,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:shadow-none disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Queuing Neural Frame Compute...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {videoMode === 'image' ? 'Animate Photo to Video' : 'Generate Spokesperson Video'}
                      </>
                    )}
                  </button>
                </div>

                {/* Right Side: Video Output Container */}
                <div className="flex flex-col justify-center items-center bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 min-h-[350px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(179,136,255,0.03)_0%,transparent_100%)]" />
                  
                  {videoStatus === 'generating' ? (
                    <div className="text-center relative z-10 space-y-4 max-w-sm">
                      <div className="relative flex items-center justify-center mx-auto">
                        <div className="w-20 h-20 rounded-full border-2 border-[#b388ff]/10 border-t-[#b388ff] animate-spin" />
                        <FileVideo className="w-8 h-8 text-[#b388ff] absolute animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-1">Veo Core Rendering</h4>
                        <p className="text-xs text-white/40 font-mono mb-2">Operation ID: {videoOperation?.substring(0, 20)}...</p>
                        <p className="text-[10px] text-white/30 italic leading-relaxed">
                          This is a deep learning compilation block and typically takes about 30 to 90 seconds. We are actively polling the engine. Feel free to wait here!
                        </p>
                      </div>
                    </div>
                  ) : videoStatus === 'completed' && videoOperation ? (
                    <div className="w-full text-center relative z-10 space-y-4 flex flex-col items-center">
                      <div className="space-y-1 text-center">
                        <span className="text-[10px] uppercase tracking-widest font-mono text-[#b388ff] bg-[#b388ff]/5 px-3 py-1 rounded-full border border-[#b388ff]/15">
                          Rendering Complete
                        </span>
                        <h4 className="text-sm font-black uppercase tracking-tight text-white mt-1">
                          Generated Virtual Clip Preview
                        </h4>
                      </div>

                      {/* Video Player */}
                      <div className={`relative rounded-2xl border border-white/10 overflow-hidden bg-black shadow-2xl w-full max-w-sm ${
                        aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[350px]' : 'aspect-video'
                      }`}>
                        <video 
                          src={`/api/video-download?operationName=${encodeURIComponent(videoOperation)}&t=${Date.now()}`}
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                          loop
                          playsInline
                        />
                      </div>

                      {/* Download Link */}
                      <a
                        href={`/api/video-download?operationName=${encodeURIComponent(videoOperation)}`}
                        download={`scionti-video-${Date.now()}.mp4`}
                        className="flex items-center gap-2 py-3 px-6 rounded-xl bg-[#b388ff] text-black font-bold uppercase tracking-wider text-[11px] hover:bg-[#b388ff]/95 active:scale-95 transition-all mt-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Download Video MP4
                      </a>
                    </div>
                  ) : videoStatus === 'failed' ? (
                    <div className="text-center relative z-10 space-y-4 max-w-sm">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-red-500">Video Render Blocked</h4>
                        <p className="text-xs text-white/50 leading-relaxed mt-2">{videoError || "Synthesis could not be established."}</p>
                      </div>
                      <button
                        onClick={handleGenerateVideo}
                        className="py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider text-[10px] hover:bg-white/10 transition-colors"
                      >
                        Retry Generation Loop
                      </button>
                    </div>
                  ) : (
                    <div className="text-center relative z-10 space-y-3">
                      <FileVideo className="w-12 h-12 text-white/10 mx-auto" />
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Studio Idle</h4>
                        <p className="text-xs text-white/30 max-w-xs mt-1">Configure your rendering parameters on the left and trigger compilation.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
