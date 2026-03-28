import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'calc(100% - 32px)',
              maxWidth: '400px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              zIndex: 9999,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  fontFamily: 'Noto Sans',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#0D1B2A',
                  margin: 0,
                }}
                data-i18n="modal_logout_title"
              >
                Log Out?
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={24} color="#6B7280" />
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                padding: '24px',
              }}
            >
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '1.6',
                  margin: 0,
                }}
                data-i18n="modal_logout_body"
              >
                You will need your School ID and password to log back in.
              </p>
            </div>

            {/* Footer - Actions */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                gap: '12px',
              }}
            >
              {/* Cancel Button - Ghost */}
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                data-i18n="btn_cancel"
              >
                Cancel
              </button>

              {/* Log Out Button - Danger Red Fill */}
              <button
                onClick={onConfirm}
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                data-i18n="btn_confirm_logout"
              >
                Log Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
