import { motion, AnimatePresence } from "motion/react";

interface DiscardDraftModalProps {
  isOpen: boolean;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
}

export function DiscardDraftModal({
  isOpen,
  onDiscard,
  onSaveDraft,
  onCancel,
}: DiscardDraftModalProps) {
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
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            onClick={onCancel}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="bg-white pointer-events-auto"
              style={{
                borderRadius: "12px",
                maxWidth: "400px",
                width: "100%",
                padding: "24px",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Title */}
              <h2
                className="mb-3 text-[#0D1B2A]"
                style={{
                  fontFamily: "Noto Sans",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
                data-i18n="modal_discard_title"
              >
                Leave without saving?
              </h2>

              {/* Body */}
              <p
                className="mb-6 text-[#6B7280]"
                style={{
                  fontFamily: "Noto Sans",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
                data-i18n="modal_discard_body"
              >
                Your draft will be saved and you can continue
                later.
              </p>

              {/* Buttons - Stacked */}
              <div className="flex flex-col gap-3">
                {/* Discard - Danger Red Text */}
                <button
                  onClick={onDiscard}
                  className="w-full transition-colors hover:bg-[#FEE2E2]"
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#EF4444",
                    fontFamily: "Noto Sans",
                    fontWeight: 600,
                    fontSize: "15px",
                  }}
                  data-i18n="btn_discard"
                >
                  Discard
                </button>

                {/* Save Draft - Outlined Navy */}
                <button
                  onClick={onSaveDraft}
                  className="w-full transition-colors hover:bg-[#F8F9FA]"
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    border: "2px solid #0D1B2A",
                    color: "#0D1B2A",
                    fontFamily: "Noto Sans",
                    fontWeight: 600,
                    fontSize: "15px",
                  }}
                  data-i18n="btn_save_draft"
                >
                  Save Draft
                </button>

                {/* Cancel - Ghost */}
                <button
                  onClick={onCancel}
                  className="w-full transition-colors hover:bg-[#F8F9FA]"
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#6B7280",
                    fontFamily: "Noto Sans",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
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
