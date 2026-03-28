import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ResolveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  resolveReason: string;
  setResolveReason: (reason: string) => void;
  onConfirm: () => void;
  issueId: string;
}

export function ResolveConfirmModal({
  isOpen,
  onClose,
  resolveReason,
  setResolveReason,
  onConfirm,
  issueId,
}: ResolveConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '20px',
            fontWeight: 700,
            color: '#0D1B2A',
            marginBottom: '16px',
          }}
          data-i18n="modal_resolve_title"
        >
          Confirm Resolution
        </h2>

        {/* Reason Field */}
        <textarea
          value={resolveReason}
          onChange={(e) => setResolveReason(e.target.value)}
          placeholder="What was done to resolve this?"
          required
          className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#22C55E] mb-4"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '14px',
            color: '#0D1B2A',
            minHeight: '100px',
            resize: 'vertical',
          }}
          data-i18n="placeholder_resolve_reason"
        />

        {/* Warning Banner */}
        <div
          className="flex items-start gap-2 p-3 rounded-lg mb-4"
          style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #F0A500',
          }}
        >
          <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '13px',
              color: '#D97706',
              lineHeight: '1.5',
            }}
            data-i18n="lbl_resolve_warning"
          >
            School staff have 72 hours to dispute this resolution. The issue will be re-opened if disputed.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
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
              height: '40px',
            }}
            data-i18n="btn_cancel"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (resolveReason.trim().length >= 30) {
                console.log('Resolve issue:', {
                  issueId,
                  reason: resolveReason,
                  newStatus: 'Resolved (Pending Confirmation)',
                  timestamp: new Date().toISOString(),
                });
                onConfirm();
              }
            }}
            disabled={resolveReason.trim().length < 30}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              backgroundColor: '#22C55E',
              border: 'none',
              cursor: resolveReason.trim().length >= 30 ? 'pointer' : 'not-allowed',
              height: '40px',
            }}
            data-i18n="btn_confirm_resolve"
          >
            Confirm Resolution
          </button>
        </div>

        {/* Character count hint */}
        <p
          className="text-right mt-2"
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '12px',
            color: resolveReason.trim().length < 30 ? '#DC2626' : '#059669',
          }}
        >
          {resolveReason.trim().length} / 30 characters minimum
        </p>
      </motion.div>
    </div>
  );
}

