import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Quote, Building2, TrendingUp, CheckCircle, Award } from 'lucide-react';
import mariePic from '../assets/images/marie_profile_1779927562287.png';
import joePic from '../assets/images/joe_profile_1779927538635.png';

interface Testimonial {
  id: number;
  clientName: string;
  companyName: string;
  industry: string;
  quote: string;
  aiSpecialist: 'Marie' | 'Joe';
  specialistTitle: string;
  metric: string;
  subMetric: string;
  specialistImage: string;
  specialistColor: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    clientName: "Sector Focus",
    companyName: "Residential & Commercial Plumbing",
    industry: "Triage & Emergency Dispatch",
    quote: "Scionti AI acts as a 24/7 triage desk for high-volume plumbing teams. The engine filters routine scheduling from middle-of-the-night emergency slab leaks, ensuring zero dropped revenue while technicians are in the field.",
    aiSpecialist: "Marie",
    specialistTitle: "Marie (Intake Lead)",
    metric: "+42% Inbound Bookings",
    subMetric: "$12k+ Added Monthly Revenue",
    specialistImage: mariePic,
    specialistColor: "#00e5ff",
    stars: 5,
  },
  {
    id: 2,
    clientName: "Sector Focus",
    companyName: "Medical & Dental Practices",
    industry: "Patient Intake & Bilingual Scheduling",
    quote: "Integrating custom front-desk AI assistants optimizes intake workflows. Marie manages bilingual appointment schedules, pre-qualifies dental insurance, and instantly notifies office staff of emergency treatment bookings.",
    aiSpecialist: "Marie",
    specialistTitle: "Marie (Bilingual Office Lead)",
    metric: "100% Inbound Calls Answered",
    subMetric: "0% Voicemail Drops",
    specialistImage: mariePic,
    specialistColor: "#00e5ff",
    stars: 5,
  },
  {
    id: 3,
    clientName: "Sector Focus",
    companyName: "Commercial Construction & Bidding",
    industry: "Pre-Qualification & Specs Query",
    quote: "Scionti AI operates as a technical specialist lead for high-stakes commercial tenders. The custom-trained engine cross-references project specs, licensing details, and safety requirements to automate bid pre-qualification.",
    aiSpecialist: "Joe",
    specialistTitle: "Joe (Technical Spec Lead)",
    metric: "Outbound Lead Nurturing up 280%",
    subMetric: "Zero Admin Overhead",
    specialistImage: joePic,
    specialistColor: "#00b0ff",
    stars: 5,
  },
  {
    id: 4,
    clientName: "Sector Focus",
    companyName: "Artisan Bakeries & Food Service",
    industry: "Catering Quotes & CRM Dispatch",
    quote: "Conversational AI provides 24/7 client triage and automated order calculations. The engine handles allergen disclosures, custom quotes, and reservation dispatch, removing administrative burdens during peak kitchen hours.",
    aiSpecialist: "Marie",
    specialistTitle: "Marie (Office Intake)",
    metric: "24/7 Reception Coverage",
    subMetric: "15+ Hours Saved/Week",
    specialistImage: mariePic,
    specialistColor: "#00e5ff",
    stars: 5,
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      handleNext();
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(timer);
  }, [currentIndex, isAutoPlaying]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <section 
      className="w-full max-w-5xl mx-auto mt-24 mb-16 px-4 relative z-40" 
      id="testimonial-section"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00e5ff]/20 bg-[#00e5ff]/5 mb-4"
        >
          <Award className="w-4 h-4 text-[#00e5ff]" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#00e5ff]">Client Coherence & Proof</span>
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          How Scionti AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#b388ff]">Transforms the Field</span>
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base font-sans">
          See how customized digital workers seamlessly integrate across diverse business sectors to scale operations, eliminate missed leads, and secure 24/7 coverage.
        </p>
      </div>

      <div className="relative min-h-[480px] md:min-h-[380px] flex items-center justify-center">
        {/* Carousel Navigation Arrows */}
        <div className="absolute -left-2 md:-left-12 z-30">
          <button
            onClick={handlePrev}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-black/60 hover:bg-[#00e5ff]/10 hover:border-[#00e5ff]/40 flex items-center justify-center text-white/70 hover:text-[#00e5ff] transition-all cursor-pointer backdrop-blur-md"
            aria-label="Previous testimonial"
            id="testimonial-prev-btn"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="absolute -right-2 md:-right-12 z-30">
          <button
            onClick={handleNext}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-black/60 hover:bg-[#00e5ff]/10 hover:border-[#00e5ff]/40 flex items-center justify-center text-white/70 hover:text-[#00e5ff] transition-all cursor-pointer backdrop-blur-md"
            aria-label="Next testimonial"
            id="testimonial-next-btn"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Carousel Slide Container */}
        <div className="w-full overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl relative shadow-2xl">
          {/* Accent glow behind active image */}
          <div 
            className="absolute top-1/2 left-10 -translate-y-1/2 w-[250px] h-[250px] rounded-full blur-[80px] pointer-events-none opacity-10 transition-all duration-700"
            style={{ backgroundColor: current.specialistColor }}
          />

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center relative z-10"
            >
              {/* Left Column: Testimonial & Client Metadata */}
              <div className="md:col-span-8 flex flex-col justify-between">
                <div>
                  {/* Quote Icon & Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(current.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-10 h-10 text-white/10 flex-shrink-0" />
                  </div>

                  {/* Industry Profile Overview */}
                  <p className="text-base md:text-xl font-medium text-white/90 leading-relaxed font-sans mb-6">
                    {current.quote}
                  </p>
                </div>

                {/* Client info & Industry badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/5 pt-6 gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white tracking-wide">{current.clientName}</h4>
                    <div className="flex items-center gap-2 mt-1 text-white/60 text-xs">
                      <Building2 className="w-3.5 h-3.5 text-[#00e5ff]" />
                      <span className="font-semibold text-white/80">{current.companyName}</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{current.industry}</p>
                  </div>

                  {/* Dynamic placement status badge */}
                  <div className="self-start sm:self-center bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Placement Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Specialist & Key Metrics */}
              <div className="md:col-span-4 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                {/* AI Specialist Avatar Link */}
                <div className="relative group/avatar mb-4">
                  <div 
                    className="absolute inset-0 rounded-2xl blur-md opacity-40 transition-opacity duration-300 group-hover/avatar:opacity-60"
                    style={{ backgroundColor: current.specialistColor }}
                  />
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 overflow-hidden relative z-10 bg-black/40" style={{ borderColor: current.specialistColor }}>
                    <img 
                      src={current.specialistImage} 
                      alt={current.aiSpecialist}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Miniature corporate badge on success avatar */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border border-white/20 bg-black flex items-center justify-center overflow-hidden shadow-md z-20">
                    <img src="/logo.jpg" alt="badge" className="w-4 h-4 object-contain rounded-full" referrerPolicy="no-referrer" />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <span className="text-xs font-extrabold uppercase tracking-widest block text-white/50">Active Worker</span>
                  <h5 className="text-sm font-bold text-white mt-0.5" style={{ color: current.specialistColor }}>
                    {current.specialistTitle}
                  </h5>
                </div>

                {/* Performance Metrics Block */}
                <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
                  <TrendingUp className="w-5 h-5 mb-2" style={{ color: current.specialistColor }} />
                  <span className="text-lg md:text-xl font-extrabold text-white tracking-tight">{current.metric}</span>
                  <span className="text-[10px] md:text-xs text-white/50 font-medium uppercase tracking-wider mt-1">{current.subMetric}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2.5 mt-6" id="testimonial-indicators">
        {testimonials.map((test, index) => (
          <button
            key={test.id}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? 'w-8' : 'w-2 bg-white/20 hover:bg-white/45'}`}
            style={{ backgroundColor: index === currentIndex ? current.specialistColor : undefined }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
