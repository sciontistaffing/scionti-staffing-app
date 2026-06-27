/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InteractionZone } from './components/InteractionZone';
import { SkillsGrid } from './components/SkillsGrid';
import { AboutUs } from './components/AboutUs';
import { Pricing } from './components/Pricing';
import { Showcase } from './components/Showcase';
import { CreativeLab } from './components/CreativeLab';
import { TestimonialCarousel } from './components/TestimonialCarousel';
import { PolicyModal, PolicyType } from './components/PolicyModal';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, X, Send } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback: feedbackText })
      });
      if (res.ok) {
        setFeedbackText('');
        setShowFeedbackModal(false);
      } else {
        console.error("Failed to submit feedback");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFeedback = async () => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clear: true })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f12] text-white font-sans overflow-x-hidden selection:bg-[#00e5ff]/30">
      {/* Ambient Background Glows & Grid */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated Light Flares */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00e5ff]/15 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#b388ff]/15 rounded-full blur-[120px]" 
        />

        {/* Subtle Particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#00e5ff]"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -150],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-50 w-full py-4 px-6 md:px-8 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative flex items-center justify-center cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-[#00e5ff] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-full z-0 pointer-events-none" />
            
            {/* Clean, crisp Main Image Layer with a white drop-shadow for text readability without a solid box */}
            <div className="relative z-10">
              <img 
                src="/logo.jpg" 
                alt="Scionti AI Logo" 
                className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                onError={(e: any) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }} 
              />
            </div>
          </motion.div>
          {/* Fallback text if logo fails to load */}
          <div className="hidden flex-col">
            <span className="text-white font-bold tracking-widest uppercase text-sm md:text-base">Scionti Staffing</span>
            <span className="text-[#00e5ff] text-xs tracking-widest uppercase">AI Specialist</span>
          </div>
        </div>

        <div className="flex flex-col items-end text-right">
          <a 
            href="https://sciontistaffing.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm md:text-base font-bold uppercase tracking-widest text-[#00e5ff] hover:text-white transition-colors duration-300 mb-1.5"
          >
            sciontistaffing.com
          </a>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs md:text-sm uppercase tracking-widest text-white/90 font-semibold">
              AI Specialist
            </span>
            <div className="flex items-center gap-1.5 md:gap-2 opacity-80">
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/70">Integrity</span>
              <span className="w-1 h-1 rounded-full bg-[#00e5ff]/60" />
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/70">Intelligence</span>
              <span className="w-1 h-1 rounded-full bg-[#00e5ff]/60" />
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/70">Innovation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-12 pb-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#b388ff]">Elite Staffing</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Meet <span className="text-white font-bold">Marie</span> and <span className="text-white font-bold">Joe</span>, your new elite specialist team. Experience our live interaction demo engine—capturing leads, handling technical diagnostics, and providing multilingual support with unshakeable integrity.
          </p>
        </motion.div>

        <InteractionZone />
        
        <Showcase />

        <CreativeLab />

        <Pricing />
        
        <TestimonialCarousel />
        
        <SkillsGrid />

        <AboutUs />
      </main>

      {/* Footer */}
      <footer className="relative z-50 w-full py-10 border-t border-white/5 bg-black/40 backdrop-blur-md mt-12" id="site-footer">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm font-medium uppercase tracking-widest text-white/70">
              <a href="tel:903-776-4825" className="hover:text-[#00e5ff] transition-colors flex items-center gap-2" id="footer-phone">
                <span>Phone:</span> 903-776-4825
              </a>
              <span className="hidden md:inline w-1 h-1 rounded-full bg-[#00e5ff]/60" />
              <a href="https://sciontistaffing.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00e5ff] transition-colors" id="footer-website">
                sciontistaffing.com
              </a>
            </div>
            
            {/* Core Corporate Legal Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white/50 mt-1" id="footer-policy-links">
              <button 
                onClick={() => setActivePolicy('refund')} 
                className="hover:text-[#00e5ff] transition-colors cursor-pointer"
                id="footer-refund-policy"
              >
                Refund Policy
              </button>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <button 
                onClick={() => setActivePolicy('privacy')} 
                className="hover:text-[#00e5ff] transition-colors cursor-pointer"
                id="footer-privacy-policy"
              >
                Privacy Policy
              </button>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <button 
                onClick={() => setActivePolicy('terms')} 
                className="hover:text-[#00e5ff] transition-colors cursor-pointer"
                id="footer-terms-of-service"
              >
                Terms of Service
              </button>
            </div>

            <p className="text-xs text-white/40 uppercase tracking-widest mt-2" id="site-copyright">
              © {new Date().getFullYear()} Scionti Staffing. All Rights Reserved.
            </p>
          </div>

          {/* QR Code Generation Feature */}
          <div className="flex flex-col items-center md:items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md" id="footer-qrcode-wrapper">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#00e5ff] font-bold">Mobile Gateway</span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff]/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00e5ff]"></span>
              </span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all duration-300 hover:scale-[1.03]">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=000000&bgcolor=ffffff&qzone=1&data=https://sciontistaffing.com" 
                alt="Scionti Staffing Mobile QR Code" 
                className="w-24 h-24 select-none"
                referrerPolicy="no-referrer"
                id="footer-qrcode-img"
              />
            </div>
            <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Scan for sciontistaffing.com</span>
          </div>
        </div>
      </footer>
      {/* AI AI Learning Feedback Button */}
      <motion.button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] p-4 rounded-full border border-[#00e5ff]/20 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Brain className="w-5 h-5 group-hover:animate-pulse" />
      </motion.button>

      {/* Corporate Policies Modals */}
      <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />

      {/* AI Learning Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f151a] border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#00e5ff]/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#00e5ff]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">Train AI Behavior</h3>
                  <p className="text-xs text-white/50 uppercase tracking-widest">Feedback Loop Engine</p>
                </div>
              </div>

              <p className="text-sm text-white/70 mb-4 leading-relaxed">
                Notice an error or want to adjust the AI's coherence or tone? Write a correction below. The AI will learn instantly.
              </p>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="E.g., Speak faster, focus less on jargon..."
                className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/50 mb-4 resize-none transition-all"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={() => { handleClearFeedback(); setShowFeedbackModal(false); }}
                  className="text-xs text-white/40 hover:text-red-400 tracking-widest uppercase transition-colors"
                >
                  Clear Memory
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || !feedbackText.trim()}
                  className="bg-[#00e5ff] text-black px-6 py-2 rounded-lg font-bold text-sm tracking-wide hover:bg-[#00e5ff]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? 'Training...' : 'Inject Knowledge'}
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
