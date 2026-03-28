import { motion } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface WithdrawEndorsementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  issueId: string;
}

export function WithdrawEndorsementModal({
  isOpen,
  onClose,
  onConfirm,
  issueId,
}: WithdrawEndorsementModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg w-full"
        style={{ maxWidth: '400px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} color="#DC2626" />
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0D1B2A',
              }}
              data-i18n="modal_withdraw_title"
            >
              Withdraw Endorsement?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg hover:bg-[#F8F9FA] transition-colors"
          >
            <X size={20} color="#6B7280" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#6B7280',
              lineHeight: '1.6',
              marginBottom: '16px',
            }}
            data-i18n="modal_withdraw_body"
          >
            Are you sure you want to remove your endorsement from this issue?
          </p>

          {/* Mandatory Reason Field */}
          <div>
            <label
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0D1B2A',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Reason <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you are withdrawing your endorsement"
              required
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#DC2626]"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
                minHeight: '100px',
                resize: 'vertical',
              }}
              data-i18n="placeholder_withdraw_reason"
            />
            <p
              className="mt-2"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                color: reason.trim().length >= 20 ? '#059669' : '#DC2626',
              }}
            >
              {reason.trim().length} / 20 characters minimum
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6B7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              minHeight: '40px',
            }}
            data-i18n="btn_cancel"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (reason.trim().length >= 20) {
                onConfirm(reason);
                setReason('');
              }
            }}
            disabled={reason.trim().length < 20}
            className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              backgroundColor: '#DC2626',
              border: 'none',
              cursor: reason.trim().length >= 20 ? 'pointer' : 'not-allowed',
              minHeight: '40px',
            }}
            data-i18n="btn_withdraw_confirm"
          >
            Withdraw
          </button>
        </div>
      </motion.div>
    </div>
  );
}
