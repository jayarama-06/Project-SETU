import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface SubmissionErrorModalProps {
  isOpen: boolean;
  onTryAgain: () => Promise<void>;
  onViewDrafts?: () => void;
}

export function SubmissionErrorModal({
  isOpen,
  onTryAgain,
  onViewDrafts,
}: SubmissionErrorModalProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleTryAgain = async () => {
    setIsRetrying(true);
    try {
      await onTryAgain();
    } finally {
      setIsRetrying(false);
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
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white w-full max-w-sm"
              style={{
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              }}
            >
              {/* Title */}
              <h2
                className="text-center mb-3"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                }}
                data-i18n="modal_submit_fail_title"
              >
                Submission Failed
              </h2>

              {/* Body */}
              <p
                className="text-center mb-6"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '1.5',
                }}
                data-i18n="modal_submit_fail_body"
              >
                Your draft has been saved. It will be submitted automatically when you
                reconnect.
              </p>

              {/* Try Again Button */}
              <button
                onClick={handleTryAgain}
                disabled={isRetrying}
                className="w-full flex items-center justify-center gap-2 mb-4 transition-opacity"
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#0D1B2A',
                  color: 'white',
                  fontFamily: 'Noto Sans',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  cursor: isRetrying ? 'not-allowed' : 'pointer',
                  opacity: isRetrying ? 0.7 : 1,
                }}
                data-i18n="btn_try_again"
              >
                {isRetrying && <Loader2 size={18} color="white" className="animate-spin" />}
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </button>

              {/* View Saved Drafts Link */}
              <button
                onClick={onViewDrafts}
                className="w-full text-center"
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#F0A500',
                  cursor: 'pointer',
                  padding: '8px',
                }}
                data-i18n="lnk_view_drafts"
              >
                View Saved Drafts
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
