import { motion } from 'motion/react';
import mariePic from '../assets/images/marie_profile_1779927562287.png';
import joePic from '../assets/images/joe_profile_1779927538635.png';

interface AgentAvatarProps {
  name: 'Sophia' | 'Mike' | 'Marie' | 'Joe';
  isSpeaking: boolean;
  isActive: boolean;
  isProcessing?: boolean;
  onClick?: () => void;
}

export function AgentAvatar({ name, isSpeaking, isActive, isProcessing, onClick }: AgentAvatarProps) {
  const isMarie = name === 'Marie' || name === 'Sophia';
  const primaryColor = isMarie ? '#00e5ff' : '#00b0ff';
  
  // Using the high-quality custom generated images for Marie and Joe
  const imageUrl = isMarie ? mariePic : joePic;

  const isIdle = isActive && !isSpeaking && !isProcessing;
  const isJoeThinking = !isMarie && isProcessing;

  return (
    <motion.div 
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}
    >
      {/* Glowing aura when speaking or thinking */}
      {(isSpeaking || isJoeThinking) && (
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${primaryColor}60 0%, transparent 70%)` }}
          animate={{ 
            opacity: isSpeaking ? [0.4, 0.7, 0.4] : [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      )}

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 border border-white/20 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 shadow-xl backdrop-blur-sm">
        Click to view profile
      </div>

      {/* Avatar Container and Lapel Badge Wrappers */}
      <div className="relative">
        <div className={`relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.2)] transition-colors duration-300 ${isSpeaking ? (isMarie ? 'border-[#00e5ff]' : 'border-[#00b0ff]') : isJoeThinking ? 'border-[#00b0ff]' : 'border-white/10 group-hover:border-[#00e5ff]/50'}`}>
          <motion.img 
            src={imageUrl} 
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            animate={
              isJoeThinking ? { filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'] } : 
              {}
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Glass overlay for tech vibe */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
          
          {/* Speaking indicator rings */}
          {isSpeaking && (
            <motion.div 
              className={`absolute inset-0 rounded-full border ${isMarie ? 'border-[#00e5ff]' : 'border-[#00b0ff]'}`}
              animate={{ scale: [1, 1.1], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Joe's Thinking indicator rings */}
          {isJoeThinking && (
            <>
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-[#00b0ff] border-dashed opacity-70"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-2 rounded-full border border-[#00b0ff]/50 border-dashed opacity-50"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}
        </div>

        {/* Dynamic Corporate Lapel Badge (Scionti Staff Pin) */}
        <div className="absolute bottom-1 right-1 w-9 h-9 md:w-12 md:h-12 rounded-full border-2 border-white/20 bg-black/95 backdrop-blur-md flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-[#00e5ff]/50 transition-colors z-30">
          <img 
            src="/logo.jpg" 
            alt="Scionti Lapel Logo Pin" 
            className="w-6 h-6 md:w-8 md:h-8 object-contain rounded-full" 
            referrerPolicy="no-referrer" 
          />
        </div>
      </div>
      
      <div className="mt-6 text-center relative z-10 bg-black/50 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-sm group-hover:border-[#00e5ff]/50 transition-colors duration-300">
        <h3 className="text-xl font-semibold tracking-widest text-white uppercase">{name}</h3>
        <p className={`text-[10px] tracking-widest uppercase opacity-80 mt-1 ${isMarie ? 'text-[#00e5ff]' : 'text-[#00b0ff]'}`}>
          {isMarie ? 'Intake Lead' : 'Tech Lead'}
        </p>
        {isJoeThinking && (
          <motion.p 
            className="text-[9px] text-[#00b0ff] tracking-widest uppercase mt-1 font-bold"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Processing...
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
