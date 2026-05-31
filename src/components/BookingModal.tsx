import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Briefcase, Mail, Phone, CheckCircle2 } from 'lucide-react';

interface CapturedData {
  intent?: string;
  industry?: string;
  tier?: string;
  staffingNeeds?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentConfirmed?: boolean;
  contact?: string;
  clientName?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CapturedData;
  onConfirm: (data: CapturedData) => void;
}

export function BookingModal({ isOpen, onClose, initialData, onConfirm }: BookingModalProps) {
  const [formData, setFormData] = useState<CapturedData>({ ...initialData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialData });
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm({ ...formData, appointmentConfirmed: true });
        onClose();
      }, 1500);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#00e5ff]" />
                Confirm Appointment
              </h2>
              <p className="text-sm text-white/50 mt-1">Review and finalize your booking details.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                <p className="text-white/60">Your appointment has been successfully scheduled.</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Cohort Scarcity / VIP Waitlist Warning Banner */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
                  <span className="p-1 px-1.5 rounded bg-amber-500/20 text-[10px] font-black uppercase text-amber-400 shrink-0 select-none">
                    Capacity Alert
                  </span>
                  <div>
                    <h4 className="font-bold mb-1 text-amber-300">Bespoke Custom Intake Limit (Slots Remaining: 3/7)</h4>
                    <p className="text-white/70">
                      To preserve our extreme, premium high-fidelity engineering standards, we restrict client intakes to small monthly cohorts of <span className="text-white font-semibold">7 businesses</span>. 
                      We currently have <span className="text-[#00e5ff] font-bold">only 3 openings leftover</span> for this cohort. Confirming your details below locks in your spot; otherwise, you will be automatically positioned on our <span className="text-[#00e5ff] font-semibold">Priority VIP Waitlist</span>.
                    </p>
                  </div>
                </div>

                <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">Client Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName || ''}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/50 transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Contact (Email/Phone)
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact || ''}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/50 transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">Date & Time</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Date
                      </label>
                      <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate || ''}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/50 transition-all [color-scheme:dark]"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Time
                      </label>
                      <input
                        type="time"
                        name="appointmentTime"
                        value={formData.appointmentTime || ''}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/50 transition-all [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> Industry
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry || ''}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/50 transition-all"
                        placeholder="e.g. Real Estate, E-commerce"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/60">Website Tier</label>
                      <select
                        name="tier"
                        value={formData.tier || ''}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/50 transition-all appearance-none"
                      >
                        <option value="" className="bg-gray-900">Select Tier</option>
                        <option value="Basic" className="bg-gray-900">Basic</option>
                        <option value="Standard" className="bg-gray-900">Standard</option>
                        <option value="Premium" className="bg-gray-900">Premium</option>
                        <option value="Enterprise" className="bg-gray-900">Enterprise</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-white/60">Staffing Needs</label>
                      <textarea
                        name="staffingNeeds"
                        value={formData.staffingNeeds || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e5ff]/50 focus:ring-1 focus:ring-[#00e5ff]/50 transition-all resize-none"
                        placeholder="Describe your AI staffing requirements..."
                      />
                    </div>
                  </div>
                </div>
              </form>
              </div>
            )}
          </div>

          {!isSuccess && (
            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="booking-form"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#00e5ff] text-black hover:bg-[#00b0ff] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
