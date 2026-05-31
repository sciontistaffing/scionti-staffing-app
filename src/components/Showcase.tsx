import { motion } from 'motion/react';
import { Camera, Search, Box, Zap, AlertCircle } from 'lucide-react';

export function Showcase() {
  return (
    <section className="w-full max-w-7xl mx-auto py-24 px-4">
      <div className="relative rounded-[3rem] bg-black border border-white/5 overflow-hidden group">
        {/* Diagnostic Visual - Simulated by high-end design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          <div className="relative p-12 flex flex-col justify-center border-r border-white/5">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#00e5ff_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full animate-pulse border border-red-500/30">
                  Coming Soon
                </span>
                <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">R&D Lab 04</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
                Visual <br />
                <span className="text-[#00e5ff]">Diagnostics</span>
              </h2>
              
              <p className="text-white/60 text-lg mb-10 max-w-lg leading-relaxed">
                The future of field service. Our AI identifies broken components through live video, instantly analyzes repair steps, and automates part logistics.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Camera />, title: "Live Vision AI", desc: "Instance segmentation of mechanical parts in real-time." },
                  { icon: <Search />, title: "Instant Fix Analysis", desc: "Automated retrieval of repair manuals and fix steps." },
                  { icon: <Box />, title: "Logistics Sync", desc: "One-click part ordering based on identified model numbers." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="p-2 bg-white/5 rounded-lg text-[#00e5ff] border border-white/10">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative bg-[#050505] overflow-hidden flex items-center justify-center p-12">
            {/* Visual simulation of AI vision */}
            <div className="relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 border border-[#00e5ff]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.1)]">
                {/* Simulated Camera Feed */}
                <img 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000" 
                  alt="Industrial Machinery"
                  className="w-full h-full object-cover grayscale opacity-50 contrast-125"
                />
                
                {/* Scanner Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-[#00e5ff] shadow-[0_0_15px_#00e5ff] z-10"
                />

                {/* Tracking Boxes */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-[20%] left-[30%] w-32 h-32 border-2 border-red-500 rounded-lg"
                >
                  <div className="absolute -top-6 left-0 bg-red-500 text-white text-[8px] font-bold uppercase px-2 py-0.5 whitespace-nowrap">
                    Fault Detected: Hydr-401
                  </div>
                  <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                </motion.div>

                <motion.div 
                  className="absolute bottom-[25%] right-[20%] w-40 h-24 border-2 border-[#00e5ff] rounded-lg"
                >
                  <div className="absolute -top-6 left-0 bg-[#00e5ff] text-black text-[8px] font-bold uppercase px-2 py-0.5 whitespace-nowrap">
                    Serial: 994-AX2-SCIONTI
                  </div>
                </motion.div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
              </div>

              {/* HUD Elements */}
              <div className="absolute -top-4 -right-4 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl z-20">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-4 h-4 text-[#00e5ff]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Diagnostic Hub</span>
                </div>
                <div className="space-y-1.5">
                  <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['20%', '85%', '60%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-full bg-[#00e5ff]" 
                    />
                  </div>
                  <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['40%', '20%', '95%'] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                      className="h-full bg-[#b388ff]" 
                    />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-[#0a0a0a] border border-red-500/30 p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-3 animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-red-500">Critical Anomaly</div>
                  <div className="text-[10px] text-white/60">Gasket leakage threshold exceeded.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
