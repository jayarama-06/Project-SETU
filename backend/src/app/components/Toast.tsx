import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#059669" />;
      case 'error':
        return <AlertCircle size={20} color="#DC2626" />;
      case 'info':
        return <Info size={20} color="#2563EB" />;
      default:
        return <CheckCircle2 size={20} color="#059669" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: '#D1FAE5', text: '#065F46', border: '#059669' };
      case 'error':
        return { bg: '#FEE2E2', text: '#7F1D1D', border: '#DC2626' };
      case 'info':
        return { bg: '#DBEAFE', text: '#1E3A8A', border: '#2563EB' };
      default:
        return { bg: '#D1FAE5', text: '#065F46', border: '#059669' };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]"
          style={{ maxWidth: 'calc(100vw - 32px)' }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 shadow-lg"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              minWidth: '300px',
            }}
          >
            {getIcon()}
            <p
              className="flex-1"
              style={{
                fontFamily: 'Noto Sans',
                fontSize: '14px',
                color: colors.text,
                fontWeight: 500,
              }}
            >
              {message}
            </p>
            <button
              onClick={onClose}
              className="flex items-center justify-center"
              style={{
                width: '24px',
                height: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <X size={16} color={colors.text} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
