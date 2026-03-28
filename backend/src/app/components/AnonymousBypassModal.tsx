import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface AnonymousBypassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: string) => void;
}

export function AnonymousBypassModal({
  isOpen,
  onClose,
  onSubmit,
}: AnonymousBypassModalProps) {
  const [reportText, setReportText] = useState('');

  const handleSubmit = () => {
    if (reportText.trim()) {
      onSubmit(reportText);
      // Reset form
      setReportText('');
    }
  };

  const handleClose = () => {
    // Reset form
    setReportText('');
    onClose();
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
            onClick={handleClose}
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
              className="bg-white w-full max-w-md"
              style={{
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Title */}
              <h2
                className="mb-3"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#0D1B2A',
                }}
                data-i18n="modal_anon_title"
              >
                Report Directly to State Officials
              </h2>

              {/* Body */}
              <p
                className="mb-4"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '1.5',
                }}
                data-i18n="modal_anon_body"
              >
                Use this only if you believe your report is being ignored at district
                level. District officials will NOT see this report — only state
                administrators will.
              </p>

              {/* Warning Banner - Amber */}
              <div
                className="flex items-start gap-3 mb-4 p-3"
                style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #F59E0B',
                  borderRadius: '8px',
                }}
              >
                <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '13px',
                    color: '#92400E',
                    lineHeight: '1.5',
                    fontWeight: 500,
                  }}
                  data-i18n="lbl_anon_warning"
                >
                  Your identity is visible to state officials only.
                </p>
              </div>

              {/* Mandatory Text Area */}
              <div className="mb-6">
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value.slice(0, 1000))}
                  maxLength={1000}
                  placeholder="Explain why you believe this issue is being ignored and what action you need from state officials..."
                  className="w-full px-4 py-3"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontFamily: 'Noto Sans',
                    fontSize: '14px',
                    color: '#0D1B2A',
                    minHeight: '140px',
                    resize: 'vertical',
                  }}
                  data-i18n="placeholder_anon_report"
                />
                <div className="flex items-center justify-between mt-1">
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '11px',
                      color: '#9CA3AF',
                    }}
                  >
                    {reportText.length}/1000
                  </span>
                  {!reportText.trim() && (
                    <span
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '11px',
                        color: '#DC2626',
                      }}
                    >
                      Required
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Cancel Button */}
                <button
                  onClick={handleClose}
                  className="flex-1"
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#6B7280',
                    fontFamily: 'Noto Sans',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  data-i18n="btn_cancel"
                >
                  Cancel
                </button>

                {/* Send to State Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!reportText.trim()}
                  className="flex-1 transition-opacity"
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: '#0D1B2A',
                    border: 'none',
                    color: 'white',
                    fontFamily: 'Noto Sans',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: reportText.trim() ? 'pointer' : 'not-allowed',
                    opacity: reportText.trim() ? 1 : 0.5,
                  }}
                  data-i18n="btn_anon_send"
                >
                  Send to State
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
