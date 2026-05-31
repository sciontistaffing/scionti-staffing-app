import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Headset,
  CalendarClock,
  LineChart,
  PhoneOutgoing,
  ShoppingCart,
  ScanEye,
  Users,
  DollarSign,
  CheckCircle2,
  Clock
} from 'lucide-react';

const SKILLS = [
  { id: 'reception', name: '24/7 Reception', icon: Headset, desc: 'Call handling & basic bilingual support', status: 'available' },
  { id: 'dispatch', name: 'Auto Schedule', icon: CalendarClock, desc: 'Automated dispatch & rerouting', status: 'available' },
  { id: 'admin', name: "Owner's Intel", icon: LineChart, desc: 'Daily briefs on market & competitors', status: 'available' },
  { id: 'sales', name: 'Outbound Sales', icon: PhoneOutgoing, desc: 'Sales ops & review generation', status: 'available' },
  { id: 'alacarte', name: 'A La Carte', icon: ShoppingCart, desc: 'Hold music, jingles, & languages', status: 'available' },
  { id: 'diagnostics', name: 'Visual Triage', icon: ScanEye, desc: 'Video diagnostics (Coming Soon)', status: 'soon' },
  { id: 'payroll', name: 'Payroll Sync', icon: DollarSign, desc: 'Full payroll access (Coming Soon)', status: 'soon' },
  { id: 'headhunter', name: 'Advanced HR', icon: Users, desc: 'Pre-interviews (Coming Soon)', status: 'soon' },
];

export function SkillsGrid() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [animatingSkill, setAnimatingSkill] = useState<string | null>(null);

  const toggleSkill = (id: string) => {
    setAnimatingSkill(id);
    setTimeout(() => setAnimatingSkill(null), 400);

    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-24 px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
          Build Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#b388ff]">Staff</span>
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto uppercase tracking-widest text-sm">
          Select specialized AI agents to integrate instantly into your workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SKILLS.map((skill, index) => {
          const Icon = skill.icon;
          const isSelected = selectedSkills.includes(skill.id);
          const isAvailable = skill.status === 'available';

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: animatingSkill === skill.id ? 0 : index * 0.1, 
                duration: animatingSkill === skill.id ? 0.4 : 0.5 
              }}
              whileHover={isAvailable ? { y: -5, scale: 1.02 } : {}}
              animate={animatingSkill === skill.id ? { scale: [1, 1.08, 1] } : {}}
              onClick={() => isAvailable && toggleSkill(skill.id)}
              className={`group relative p-6 rounded-2xl backdrop-blur-lg overflow-hidden transition-all duration-300 ${
                !isAvailable 
                  ? 'bg-white/5 border border-white/5 opacity-60 grayscale-[50%]'
                  : isSelected 
                    ? 'bg-[#00e5ff]/10 border border-[#00e5ff]/50 shadow-[0_10px_30px_rgba(0,229,255,0.2)] cursor-pointer' 
                    : 'bg-white/5 border border-white/10 shadow-sm hover:shadow-xl hover:border-[#00e5ff]/30 cursor-pointer'
              }`}
            >
              {/* Hover/Active Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
                !isAvailable
                  ? 'from-transparent to-transparent'
                  : isSelected 
                    ? 'from-[#00e5ff]/20 to-transparent' 
                    : 'from-transparent to-transparent group-hover:from-[#00e5ff]/10 group-hover:to-transparent'
              }`} />
              
              <AnimatePresence>
                {isSelected && isAvailable && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-[#00e5ff] text-black shadow-md z-20"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Deployed
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                  !isAvailable 
                    ? 'bg-black/30 border border-white/5'
                    : isSelected ? 'bg-[#00e5ff]/20 border border-[#00e5ff]/50' : 'bg-black/30 border border-white/10 group-hover:border-[#00e5ff]/30'
                }`}>
                  <Icon className={`w-6 h-6 transition-all ${
                    !isAvailable
                      ? 'text-white/30'
                      : isSelected ? 'text-[#00e5ff]' : 'text-white/70 group-hover:text-[#00e5ff]'
                  }`} />
                </div>
                
                <h3 className={`text-xl font-semibold mb-2 tracking-wide ${!isAvailable ? 'text-white/50' : 'text-white'}`}>{skill.name}</h3>
                <p className="text-sm text-white/50 leading-relaxed mt-auto">
                  {skill.desc}
                </p>
                
                {/* Add button indicator */}
                <div className={`mt-6 flex items-center gap-2 text-xs uppercase tracking-widest transition-all duration-300 ${
                  !isAvailable 
                    ? 'text-white/40 opacity-100'
                    : isSelected ? 'text-[#00e5ff] opacity-100' : 'text-[#00e5ff]/70 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0'
                }`}>
                  {!isAvailable ? (
                    <div className="flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5 text-[#b388ff]" />
                       <span>In Development</span>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {isSelected ? (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]"
                        />
                        <span>Active</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="deploy"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <span>Deploy Agent</span>
                        <motion.span 
                          animate={{ x: [0, 4, 0] }} 
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
