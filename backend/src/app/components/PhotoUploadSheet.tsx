/**
 * SETU – Photo Upload Bottom Sheet
 * Bottom sheet for selecting photo source (Camera/Gallery)
 * 
 * Design Spec: A-06 Report Issue Step 2, Modal Section
 */

import { CSSProperties } from 'react';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

interface PhotoUploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseGallery: () => void;
  onRemovePhoto?: () => void;
  hasPhoto?: boolean;
}

/**
 * PhotoUploadSheet – Bottom sheet for photo selection
 * 
 * @example
 * <PhotoUploadSheet
 *   isOpen={showSheet}
 *   onClose={() => setShowSheet(false)}
 *   onTakePhoto={() => console.log('Camera')}
 *   onChooseGallery={() => console.log('Gallery')}
 *   onRemovePhoto={() => console.log('Remove')}
 *   hasPhoto={true}
 * />
 */
export function PhotoUploadSheet({
  isOpen,
  onClose,
  onTakePhoto,
  onChooseGallery,
  onRemovePhoto,
  hasPhoto = false,
}: PhotoUploadSheetProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-end',
    fontFamily: 'Noto Sans',
  };

  const sheetStyle: CSSProperties = {
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    paddingBottom: 'env(safe-area-inset-bottom)',
    boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
  };

  const handleBarStyle: CSSProperties = {
    width: '32px',
    height: '4px',
    backgroundColor: '#9CA3AF',
    borderRadius: '2px',
    margin: '12px auto 8px',
  };

  const optionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
    borderBottom: '1px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const iconStyle: CSSProperties = {
    fontSize: '24px',
    color: '#0D1B2A',
  };

  const textStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    color: '#0D1B2A',
  };

  return (
    <div 
      style={overlayStyle} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-upload-title"
    >
      <div 
        style={sheetStyle} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div style={handleBarStyle} />

        {/* Title */}
        <h2
          id="photo-upload-title"
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#0D1B2A',
            padding: '16px 24px 8px',
            margin: 0,
          }}
        >
          {t('lbl_photo', language)}
        </h2>

        {/* Options */}
        <div>
          {/* Take Photo Option */}
          <button
            onClick={() => {
              onTakePhoto();
              onClose();
            }}
            style={{
              ...optionStyle,
              width: '100%',
              border: 'none',
              background: 'none',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            data-i18n="opt_take_photo"
          >
            <span className="material-symbols-rounded" style={iconStyle}>
              photo_camera
            </span>
            <span style={textStyle}>
              {t('opt_take_photo', language)}
            </span>
          </button>

          {/* Choose from Gallery Option */}
          <button
            onClick={() => {
              onChooseGallery();
              onClose();
            }}
            style={{
              ...optionStyle,
              width: '100%',
              border: 'none',
              background: 'none',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            data-i18n="opt_choose_gallery"
          >
            <span className="material-symbols-rounded" style={iconStyle}>
              photo_library
            </span>
            <span style={textStyle}>
              {t('opt_choose_gallery', language)}
            </span>
          </button>

          {/* Remove Photo Option (only if photo exists) */}
          {hasPhoto && onRemovePhoto && (
            <button
              onClick={() => {
                onRemovePhoto();
                onClose();
              }}
              style={{
                ...optionStyle,
                width: '100%',
                border: 'none',
                background: 'none',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FEE2E2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              data-i18n="opt_remove_photo"
            >
              <span 
                className="material-symbols-rounded" 
                style={{ ...iconStyle, color: '#EF4444' }}
              >
                delete
              </span>
              <span style={{ ...textStyle, color: '#EF4444' }}>
                {t('opt_remove_photo', language)}
              </span>
            </button>
          )}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#6B7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Noto Sans',
          }}
          data-i18n="btn_cancel"
        >
          {t('btn_cancel', language)}
        </button>
      </div>
    </div>
  );
}
