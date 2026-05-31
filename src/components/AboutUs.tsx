import { motion } from 'motion/react';
import { ShieldCheck, BrainCircuit, Rocket } from 'lucide-react';

export function AboutUs() {
  const pillars = [
    {
      title: "Integrity",
      subtitle: "Security You Can Trust",
      icon: <ShieldCheck className="w-8 h-8 text-[#00e5ff]" />,
      description: "We believe in absolute honesty and security. Our specialized digital workforce never takes a day off, never calls in sick, and never complains. More importantly, we respect your privacy above all else. When you no longer need us, we no longer remember anything. Your data, your leads, and your business secrets are wiped clean."
    },
    {
      title: "Intelligence",
      subtitle: "Seamless Integration",
      icon: <BrainCircuit className="w-8 h-8 text-[#b388ff]" />,
      description: "Our solutions are designed to work for you, not the other way around. If you already have a website, our systems integrate flawlessly into what you’ve already built from day one. If you don't have a website, we will build you one—and if we part ways, you keep the site. You own your assets; we just make them smarter."
    },
    {
      title: "Innovation",
      subtitle: "Cutting-Edge, Without the Clutter",
      icon: <Rocket className="w-8 h-8 text-[#00e5ff]" />,
      description: "We put elite technology at your fingertips without the confusing tech-jargon. We act as your lookout, keeping you informed on the latest industry trends, security updates, and skill sets your business needs to stay ahead. As technology improves, so do you—we provide free upgrades on applicable services you already use, ensuring you never fall behind the competition."
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto mt-24 px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#00e5ff] mb-4">
          About Us: Scionti AI Specialists
        </h2>
        <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
          Our Mission is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#b388ff]">Your Success</span>
        </h3>
        <p className="text-white/70 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
          At Scionti AI Specialists, we don't just fill gaps in your schedule; we provide personalized, unshakeable staffing solutions that protect your bottom line. We understand that local businesses are the backbone of the community, and you need reliable, secure systems that let you focus on the work—not the phone lines. Everything we do is built on three core pillars: <span className="text-white font-semibold">Integrity, Intelligence, and Innovation.</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
          >
            <div className="bg-black/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300">
              {pillar.icon}
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">{pillar.title}</h4>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-[#00e5ff] mb-4">{pillar.subtitle}</h5>
            <p className="text-white/60 leading-relaxed">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
