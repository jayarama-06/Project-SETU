import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendOTP: (schoolId: string) => void;
}

export function ForgotPasswordModal({ isOpen, onClose, onSendOTP }: ForgotPasswordModalProps) {
  const [schoolId, setSchoolId] = useState('');

  const handleSendOTP = () => {
    if (schoolId.trim()) {
      onSendOTP(schoolId);
      setSchoolId('');
    }
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
                  data-i18n="modal_forgot_pw_title"
                >
                  Forgot Password?
                </h2>
                <button
                  onClick={onClose}
                  className="min-w-[48px] min-h-[48px] flex items-center justify-center -mr-3 -mt-3 text-[#6B7280] hover:text-[#0D1B2A]"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* School ID Input */}
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="forgot-school-id" className="text-[#0D1B2A]" data-i18n="lbl_school_id">
                    School ID
                  </Label>
                  <Input
                    id="forgot-school-id"
                    placeholder="Enter your School ID"
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="h-12 bg-[#FFFFFF] border-[#E5E7EB]"
                    style={{ borderRadius: '8px' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendOTP();
                      }
                    }}
                  />
                </div>

                {/* Helper Text */}
                <p
                  className="text-sm text-[#6B7280]"
                  data-i18n="lbl_otp_info"
                >
                  An OTP will be sent to the registered contact number.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {/* Send OTP Button */}
                <Button
                  onClick={handleSendOTP}
                  className="w-full h-12 font-semibold bg-[#0D1B2A] text-white hover:bg-[#162336]"
                  style={{ borderRadius: '8px' }}
                  data-i18n="btn_send_otp"
                  disabled={!schoolId.trim()}
                >
                  Send OTP
                </Button>

                {/* Cancel Link */}
                <button
                  onClick={onClose}
                  className="w-full text-sm text-[#6B7280] hover:text-[#0D1B2A] underline hover:no-underline min-h-[48px]"
                  data-i18n="btn_cancel"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
