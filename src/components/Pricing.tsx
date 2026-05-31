import { motion } from 'motion/react';
import { Check, Plus, Rocket, Shield, Zap, Globe, Video, MessageSquare, Bell } from 'lucide-react';

const tiers = [
  {
    name: "Tier 1: Front Desk",
    price: "$99",
    setup: "$199",
    minutes: "500",
    overage: "$0.15",
    description: "Bilingual AI Receptionist",
    features: [
      "Bilingual AI Receptionist (English & Spanish)",
      "500 Minutes of Call Time",
      "Instant Message Routing",
      "Lead Capture",
      "24/7 Availability"
    ],
    icon: <Shield className="w-6 h-6 text-[#00e5ff]" />,
    color: "from-[#00e5ff]/20 to-transparent"
  },
  {
    name: "Tier 2: Operations Manager",
    price: "$249",
    setup: "$499",
    minutes: "1,500",
    overage: "$0.15",
    description: "Multilingual Operations Lead",
    popular: true,
    features: [
      "Multilingual Capabilities",
      "1,500 Minutes of Call Time",
      "Real-Time Call Summaries & Analytics",
      "Email Organizing & Invoicing",
      "Workflow Automation"
    ],
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    color: "from-amber-400/20 to-transparent"
  },
  {
    name: "Tier 3: Digital Twin",
    price: "$399",
    setup: "$1,500",
    minutes: "4,000",
    overage: "$0.15",
    description: "Total Persona Simulation",
    features: [
      "Custom Voice Cloning",
      "4,000 Minutes of Call Time",
      "Full CRM Integration",
      "Automated Follow-Ups",
      "Outbound Reactivation"
    ],
    icon: <Rocket className="w-6 h-6 text-[#b388ff]" />,
    color: "from-[#b388ff]/20 to-transparent"
  },
  {
    name: "Tier 4: Scionti Elite Apex",
    price: "$499/mo",
    setup: "$1,500",
    minutes: "5,000",
    overage: "$0.10",
    description: "Full Custom Ecosystem",
    comingSoon: true,
    features: [
      "Full Custom 5-Page Web Design & Launch",
      "Full Voice-Cloned \"Digital Twin\" AI Employee",
      "5,000 Monthly High-Speed Voice Minutes",
      "Complete CRM Integration & Live Leads Dashboard",
      "24/7 Premium Website Hosting & Security Updates"
    ],
    icon: <Globe className="w-6 h-6 text-emerald-400" />,
    color: "from-emerald-400/20 to-transparent"
  }
];

const upgrades = [
  { name: "Emergency Dispatch", price: "+$75/mo", icon: <Bell className="w-4 h-4" /> },
  { name: "AI Video Spokesperson", price: "$199 Setup + $49/mo", icon: <Video className="w-4 h-4" /> },
  { name: "Global Languages", price: "+$50/mo", icon: <Globe className="w-4 h-4" /> },
  { name: "Smart SMS Follow-up", price: "+$30/mo", icon: <MessageSquare className="w-4 h-4" /> },
  { name: "Daily Call Summaries", price: "+$20/mo", icon: <Plus className="w-4 h-4" /> },
  { name: "Custom Hold Music", price: "$149 one-time + $25/mo", icon: <Plus className="w-4 h-4" /> }
];

export function Pricing() {
  const handleCheckout = async (tier: typeof tiers[0]) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierName: tier.name,
          price: tier.price,
          setupFee: tier.setup,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred while preparing your checkout. Please try again.");
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto py-24 px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4 uppercase">
          Elite Specialist <span className="text-[#00e5ff]">Plans</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">
          Select the level of intelligence your business deserves. Elite staffing with zero training required.
        </p>
        
        {/* Cohort Scarcity / Waiting List Status Notification */}
        <div className="mt-8 max-w-xl mx-auto p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-md flex items-center justify-between gap-4 text-left shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest select-none">May Cohort Capacity Notice</div>
              <p className="text-white/70 text-xs mt-0.5 leading-relaxed">
                We limit custom builds to <span className="text-white font-semibold">7 businesses per month</span> to ensure high-fidelity vocal and behavioral customization. <span className="text-amber-300 font-bold">Only 3 spots remain</span>. Overflow signups will join our VIP Priority Waitlist.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase text-amber-400 px-2 md:px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25 whitespace-nowrap shrink-0">
            3 slots left
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {tiers.map((tier, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className={`relative p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl h-full flex flex-col ${tier.popular ? 'ring-2 ring-amber-400/50' : ''}`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                Most Popular
              </div>
            )}
            {tier.comingSoon && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20">
                Coming Soon
              </div>
            )}
            
            <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} rounded-3xl pointer-events-none`} />
            
            <div className="relative z-10 flex-1">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight leading-tight">{tier.name}</h3>
                  </div>
                </div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-white/5 rounded border border-white/5 inline-block self-start">
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">{tier.price.includes('/') ? tier.price.split('/')[0] : tier.price}</span>
                  <span className="text-white/40 text-xs">{tier.price.includes('/') ? `/${tier.price.split('/')[1]}` : '/ month'}</span>
                </div>
                <div className="text-[10px] font-bold text-[#00e5ff] mt-1 uppercase tracking-widest">
                  ${tier.setup} One-Time Setup
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-lg font-bold text-[#00e5ff]">{tier.minutes}</span>
                  <div className="text-[10px] uppercase tracking-widest leading-none">
                    <div className="text-white">Included Minutes</div>
                    <div className="text-white/40">{tier.overage}/min overage</div>
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {tier.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-xs text-white/70">
                    <Check className="w-3 h-3 text-[#00e5ff] mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {tier.comingSoon ? (
              <button 
                disabled={true}
                className="relative z-10 w-full py-4 mt-8 rounded-2xl bg-white/5 border border-white/5 text-white/30 text-[10px] font-bold uppercase tracking-widest cursor-not-allowed select-none"
              >
                Coming Soon
              </button>
            ) : (
              <button 
                onClick={() => handleCheckout(tier)}
                className="relative z-10 w-full py-4 mt-8 rounded-2xl bg-white/5 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                Select {tier.name.includes(':') ? tier.name.split(':')[1].trim() : tier.name}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-24 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-[400px] h-full bg-[#00e5ff]/5 blur-[80px] -rotate-12 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase mb-2">
                A La Carte <span className="text-[#00e5ff]">Upgrades</span>
              </h2>
              <p className="text-white/60 text-sm uppercase tracking-widest">Tailor your AI staff for specific mission requirements.</p>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Scionti AI Specialist Customization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upgrades.map((upgrade, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#00e5ff]/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-[#00e5ff] group-hover:bg-[#00e5ff]/10 transition-colors">
                    {upgrade.icon}
                  </div>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    {upgrade.name}
                  </span>
                </div>
                <span className="text-[10px] font-black tracking-widest text-[#00e5ff] uppercase px-3 py-1 bg-[#00e5ff]/5 rounded-full border border-[#00e5ff]/10">
                  {upgrade.price}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-gradient-to-br from-[#00e5ff]/10 to-transparent border border-[#00e5ff]/20 backdrop-blur-xl relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#00e5ff]" />
              Scionti Referral Network
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Grow with the Scionti family. Refer a business and you both win.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl">
                <div className="text-[#00e5ff] text-2xl font-black mb-1">$100</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Billing Credit (You)</div>
              </div>
              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl">
                <div className="text-amber-400 text-2xl font-black mb-1">$100</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Setup Discount (Them)</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-[#00e5ff]" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-[#b388ff]/10 to-transparent border border-[#b388ff]/20 backdrop-blur-xl relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#b388ff]" />
              Scionti Family Bundle
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Signing up multiple family businesses? We've got you covered.
            </p>
            <div className="flex items-center gap-6">
              <div className="bg-black/40 border border-white/10 px-6 py-4 rounded-2xl">
                <div className="text-[#b388ff] text-2xl font-black mb-1">WAIVED</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">2nd Setup Fee</div>
              </div>
              <div className="text-sm text-white/40 uppercase tracking-wider font-medium leading-tight">
                Includes free <br />
                <span className="text-[#b388ff]">Global Languages</span> <br />
                for Scionti VIPs
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="w-24 h-24 text-[#b388ff]" />
          </div>
        </motion.div>
      </div>

      {/* S-Integration (Scionti Integration Network) - Upcoming Launch Block */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#00e5ff]/20 via-[#b388ff]/10 to-transparent border border-white/15 backdrop-blur-xl relative overflow-hidden group shadow-[0_20px_50px_rgba(0,229,255,0.15)] animate-pulse hover:animate-none transition-all duration-300"
      >
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-4 right-4 bg-[#00e5ff] text-black text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full z-20 shadow-md">
          Upcoming Launch
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#00e5ff]">
              <MessageSquare className="w-6 h-6 animate-pulse" />
            </span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white select-none">
              S-Integration (Scionti Integration Network) — Outbound SMS & AI Campaign Platform
            </h3>
          </div>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            We are about to launch our highly anticipated **AI-Powered SMS Campaigns & Two-Way Conversation Platform**! Directly launch automated updates, promotions, scheduling reminders, and customer follow-ups from your custom CRM with a record-high **98% open rate**. Our AI engages in smart, two-way text chatting to convert cold leads into booked accounts with zero human effort.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider">
            <span className="px-3.5 py-2 bg-white/5 rounded-xl border border-white/5 text-white/70 select-none">
              ✓ Fully Autonomous 2-Way Texting
            </span>
            <span className="px-3.5 py-2 bg-white/5 rounded-xl border border-white/5 text-white/70 select-none">
              ✓ 98% Open Rate Campaigns
            </span>
            <span className="px-3.5 py-2 bg-white/5 rounded-xl border border-white/5 text-white/70 select-none font-bold text-[#00e5ff]">
              ✓ Pre-Order Available with Family Bundle
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
