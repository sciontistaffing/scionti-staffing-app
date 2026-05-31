import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, BadgeDollarSign, Mail } from 'lucide-react';

export type PolicyType = 'refund' | 'privacy' | 'terms' | null;

interface PolicyModalProps {
  type: PolicyType;
  onClose: () => void;
}

export function PolicyModal({ type, onClose }: PolicyModalProps) {
  const getPolicyContent = () => {
    switch (type) {
      case 'refund':
        return {
          title: 'Refund & Placement Guarantee Policy',
          subtitle: 'Talent Placement Guarantee & Contingency Safeguards',
          icon: BadgeDollarSign,
          color: '#00e5ff',
          body: (
            <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans">
              <p>
                At Scionti Staffing, we deliver elite recruitment and talent matching services. Because our services involve human capital placements, all completed placements are final, and Scionti Staffing does not offer cash refunds.
              </p>
              <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/10 rounded-xl p-4 my-4">
                <span className="text-[#00e5ff] font-bold block mb-1 text-xs uppercase tracking-wider">30-Day Candidate Replacement Guarantee</span>
                <p className="text-white/90">
                  However, we stand behind the quality of our talent. All standard contracts include a 30-Day Candidate Replacement Guarantee.
                </p>
              </div>
              <p>
                If a placed candidate terminates employment or is let go for performance issues within the first 30 days of their start date, Scionti Staffing will source, vet, and deliver a qualified replacement candidate at zero additional cost to the client.
              </p>
            </div>
          )
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'Data Integrity, Encryption & Communication Privacy',
          icon: Shield,
          color: '#b388ff',
          body: (
            <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans">
              <p>
                Scionti Staffing (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting the privacy of our clients and candidates. This Privacy Policy outlines how we collect, use, and secure your data.
              </p>
              <p>
                We collect personal information (such as names, resumes, email addresses, and phone numbers) strictly for recruitment, staffing, and placement optimization. We do not sell, rent, or trade your personal information to third parties.
              </p>
              <div className="bg-[#b388ff]/5 border border-[#b388ff]/10 rounded-xl p-4 my-4">
                <span className="text-[#b388ff] font-bold block mb-1 text-xs uppercase tracking-wider">Secure Encrypted Processing</span>
                <p className="text-white/90">
                  All data is securely processed via encrypted backend networks to ensure compliance with privacy regulations.
                </p>
              </div>
              <p>
                By submitting your information or utilizing our AI intake engines, you consent to the data practices described in this policy. For inquiries, contact us at <a href="mailto:jo@sciontistaffing.com" className="text-[#b388ff] hover:underline font-semibold">jo@sciontistaffing.com</a>.
              </p>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          subtitle: 'Website Usage & Digital Interaction Standards',
          icon: FileText,
          color: '#00b0ff',
          body: (
            <div className="space-y-4 text-sm text-white/80 leading-relaxed font-sans">
              <p>
                Welcome to Scionti Staffing (sciontistaffing.com). By accessing our website, interacting with our digital AI specialists, or submitting hiring requests, you agree to comply with and be bound by these Terms of Service.
              </p>
              <p>
                Our platform provides AI-driven staffing consultations and candidate pairing intake.
              </p>
              <div className="bg-[#00b0ff]/5 border border-[#00b0ff]/10 rounded-xl p-4 my-4">
                <span className="text-[#00b0ff] font-bold block mb-1 text-xs uppercase tracking-wider">Client Fee Agreements</span>
                <p className="text-white/90">
                  Official fee structures, contingency parameters, and placement terms are strictly governed by our standalone Client Fee Agreement, which must be digitally signed prior to candidate interviews.
                </p>
              </div>
              <p>
                We reserve the right to modify site features or refuse service to ensure platform integrity and security.
              </p>
            </div>
          )
        };
      default:
        return null;
    }
  };

  const content = getPolicyContent();
  if (!content) return null;

  const Icon = content.icon;

  return (
    <AnimatePresence>
      {type && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            id="policy-modal-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-[#0b1013] border border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl z-[101] overflow-hidden my-8"
            id="policy-modal-container"
          >
            {/* Top decorative gradient bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: content.color }}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/10"
              aria-label="Close policy"
              id="policy-modal-close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center border"
                style={{ 
                  backgroundColor: `${content.color}0a`, 
                  borderColor: `${content.color}30`,
                  color: content.color 
                }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">{content.title}</h3>
                <p className="text-xs text-white/40 uppercase tracking-widest mt-0.5">{content.subtitle}</p>
              </div>
            </div>

            {/* Content Body */}
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar border-y border-white/5 py-6">
              {content.body}
            </div>

            {/* Footer with Branding Pin */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/logo.jpg" 
                  alt="Scionti Logo" 
                  className="w-8 h-8 object-contain rounded-full drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs uppercase tracking-widest text-white/60">Scionti AI Staffing</span>
              </div>
              
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 rounded-lg font-bold text-sm tracking-wide bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                id="policy-modal-accept"
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
