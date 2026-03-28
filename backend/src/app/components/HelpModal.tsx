import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Mail, FileText } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const supportWhatsApp = '+91-XXXXXXXXXX';
  const supportEmail = 'support@setu.gov.in';
  const userGuideUrl = '/assets/SETU_User_Guide.pdf';

  const handleWhatsAppClick = () => {
    // Open WhatsApp with pre-filled message
    const message = encodeURIComponent('Hi, I need help with SETU platform');
    const whatsappNumber = supportWhatsApp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    // Open default email client
    const subject = encodeURIComponent('SETU Support Request');
    const body = encodeURIComponent('Hi,\n\nI need assistance with:\n\n');
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  const handleGuideDownload = () => {
    // Trigger PDF download
    const link = document.createElement('a');
    link.href = userGuideUrl;
    link.download = 'SETU_User_Guide.pdf';
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-[#FFFFFF] rounded-lg w-full max-w-md border border-[#E5E7EB] pointer-events-auto"
              style={{
                boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
                padding: '24px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-semibold text-[#0D1B2A]"
                  data-i18n="modal_help_title"
                >
                  Need Help?
                </h2>
                <button
                  onClick={onClose}
                  className="min-w-[48px] min-h-[48px] flex items-center justify-center -mr-3 -mt-3 text-[#6B7280] hover:text-[#0D1B2A]"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Support Options */}
              <div className="space-y-2">
                {/* WhatsApp Support */}
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-[#F8F9FA] transition-colors min-h-[56px]"
                  style={{ borderRadius: '8px' }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366]/10">
                    <MessageCircle size={20} className="text-[#25D366]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-[#6B7280] mb-0.5">WhatsApp Support</p>
                    <p className="text-base font-medium text-[#0D1B2A]" data-i18n="lbl_whatsapp_support">
                      {supportWhatsApp}
                    </p>
                  </div>
                </button>

                {/* Email Support */}
                <button
                  onClick={handleEmailClick}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-[#F8F9FA] transition-colors min-h-[56px]"
                  style={{ borderRadius: '8px' }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0D1B2A]/10">
                    <Mail size={20} className="text-[#0D1B2A]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-[#6B7280] mb-0.5">Email Support</p>
                    <p className="text-base font-medium text-[#0D1B2A]" data-i18n="lbl_email_support">
                      {supportEmail}
                    </p>
                  </div>
                </button>

                {/* User Guide Download */}
                <button
                  onClick={handleGuideDownload}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-[#F8F9FA] transition-colors min-h-[56px]"
                  style={{ borderRadius: '8px' }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F0A500]/10">
                    <FileText size={20} className="text-[#F0A500]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-base font-medium text-[#0D1B2A]" data-i18n="lnk_user_guide">
                      Download PDF Guide
                    </p>
                    <p className="text-sm text-[#6B7280]">User manual & tutorials</p>
                  </div>
                </button>
              </div>

              {/* Footer Info */}
              <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                <p className="text-xs text-center text-[#6B7280]">
                  SETU v1.1 • FOSS Hack 2026
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
