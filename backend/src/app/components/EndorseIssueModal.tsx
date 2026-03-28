import { motion } from 'motion/react';
import { X, BadgeCheck } from 'lucide-react';
import { useState } from 'react';

interface EndorseIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  issueTitle?: string;
}

export function EndorseIssueModal({
  isOpen,
  onClose,
  onConfirm,
  issueTitle,
}: EndorseIssueModalProps) {
  const [note, setNote] = useState('');

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
            <BadgeCheck size={20} color="#166534" />
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0D1B2A',
              }}
              data-i18n="modal_endorse_title"
            >
              Formal Endorsement
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
          {/* Issue context */}
          {issueTitle && (
            <div
              className="flex items-start gap-2 px-3 py-2 mb-4 rounded-lg"
              style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}
            >
              <p
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0D1B2A',
                  lineHeight: '1.5',
                }}
              >
                "{issueTitle}"
              </p>
            </div>
          )}

          <p
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              color: '#6B7280',
              lineHeight: '1.6',
              marginBottom: '16px',
            }}
            data-i18n="modal_endorse_body"
          >
            Your endorsement formally signals to district officials that you, as Principal, confirm this issue is genuine and requires urgent attention. This action is permanently recorded.
          </p>

          {/* Optional Note Field */}
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
              Official note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an official note…"
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#166534]"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: '#0D1B2A',
                minHeight: '80px',
                resize: 'vertical',
              }}
              data-i18n="placeholder_endorse_note"
            />
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
              onConfirm(note);
              setNote('');
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-lg transition-colors"
            style={{
              fontFamily: 'Noto Sans',
              fontSize: '14px',
              fontWeight: 700,
              color: 'white',
              backgroundColor: '#0D1B2A',
              border: 'none',
              cursor: 'pointer',
              minHeight: '40px',
            }}
            data-i18n="btn_endorse_confirm"
          >
            <BadgeCheck size={16} strokeWidth={2} />
            Endorse Issue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
