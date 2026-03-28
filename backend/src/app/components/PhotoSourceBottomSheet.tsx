import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image, Trash2 } from 'lucide-react';

interface PhotoSourceBottomSheetProps {
  isOpen: boolean;
  hasPhoto: boolean;
  onTakePhoto: () => void;
  onChooseGallery: () => void;
  onRemovePhoto?: () => void;
  onCancel: () => void;
}

export function PhotoSourceBottomSheet({
  isOpen,
  hasPhoto,
  onTakePhoto,
  onChooseGallery,
  onRemovePhoto,
  onCancel,
}: PhotoSourceBottomSheetProps) {
  const handleTakePhoto = () => {
    onTakePhoto();
    onCancel();
  };

  const handleChooseGallery = () => {
    onChooseGallery();
    onCancel();
  };

  const handleRemovePhoto = () => {
    onRemovePhoto?.();
    onCancel();
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
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onClick={onCancel}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white flex flex-col"
            style={{
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              height: '40vh',
              minHeight: '280px',
            }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-4">
              <div
                style={{
                  width: '32px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: '#D1D5DB',
                }}
              />
            </div>

            {/* Options List */}
            <div className="flex-1 overflow-y-auto">
              {/* Take Photo */}
              <button
                onClick={handleTakePhoto}
                className="w-full flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F8F9FA]"
                data-i18n="opt_take_photo"
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#F0F4F8',
                  }}
                >
                  <Camera size={20} color="#0D1B2A" />
                </div>
                <span
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#0D1B2A',
                  }}
                >
                  Take Photo
                </span>
              </button>

              {/* Choose from Gallery */}
              <button
                onClick={handleChooseGallery}
                className="w-full flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F8F9FA]"
                data-i18n="opt_gallery"
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#F0F4F8',
                  }}
                >
                  <Image size={20} color="#0D1B2A" />
                </div>
                <span
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#0D1B2A',
                  }}
                >
                  Choose from Gallery
                </span>
              </button>

              {/* Remove Photo - Only shown if photo exists */}
              {hasPhoto && (
                <button
                  onClick={handleRemovePhoto}
                  className="w-full flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#FEE2E2]"
                  data-i18n="opt_remove_photo"
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#FEE2E2',
                    }}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </div>
                  <span
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#EF4444',
                    }}
                  >
                    Remove Photo
                  </span>
                </button>
              )}
            </div>

            {/* Cancel Button */}
            <div className="border-t border-[#E5E7EB] p-4">
              <button
                onClick={onCancel}
                className="w-full transition-colors hover:bg-[#F8F9FA]"
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontFamily: 'Noto Sans',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#6B7280',
                }}
                data-i18n="btn_cancel"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
