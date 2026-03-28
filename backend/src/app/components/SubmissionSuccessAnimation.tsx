import { useEffect } from 'react';
import { motion } from 'motion/react';

interface SubmissionSuccessAnimationProps {
  onComplete: () => void;
}

export function SubmissionSuccessAnimation({ onComplete }: SubmissionSuccessAnimationProps) {
  useEffect(() => {
    // Auto-navigate after 1.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Navy Circle */}
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Circle path that draws in */}
          <motion.circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="#0D1B2A"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.6,
              ease: 'easeInOut',
              delay: 0.1,
            }}
          />

          {/* Saffron Checkmark */}
          <motion.path
            d="M 35 60 L 52 77 L 85 44"
            fill="none"
            stroke="#F0A500"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
              delay: 0.5,
            }}
          />
        </motion.svg>

        {/* "Submitted!" Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.9,
          }}
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '24px',
            fontWeight: 700,
            color: '#0D1B2A',
            marginTop: '24px',
          }}
          data-i18n="lbl_submitted"
        >
          Submitted!
        </motion.p>
      </div>
    </div>
  );
}
