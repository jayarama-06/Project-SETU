import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { getSession } from '../utils/session';

export function Splash() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 2250;
    const interval = 16;
    const increment = (100 / duration) * interval;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    const completeTimer = setTimeout(() => {
      // If a session exists, skip login and go straight to the app
      const session = getSession();
      if (session) {
        const dest = session.role === 'staff' ? '/staff/my-issues' : '/admin/dashboard';
        navigate(dest, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-[#0D1B2A] flex flex-col items-center justify-center">
      {/* Wordmark and Tagline - centered with -40px Y offset */}
      <div className="flex flex-col items-center" style={{ marginTop: '-40px' }}>
        {/* SETU Wordmark */}
        <h1
          className="font-bold text-[#F0A500]"
          style={{ fontSize: '40px', fontFamily: 'Noto Sans' }}
          data-i18n="lbl_app_name"
        >
          SETU
        </h1>

        {/* Tagline */}
        <p
          className="text-white font-normal text-center"
          style={{ fontSize: '16px', marginTop: '12px', fontFamily: 'Noto Sans' }}
          data-i18n="lbl_app_tagline"
        >
          Smart Escalation &amp; Tracking Utility
        </p>
      </div>

      {/* Linear Progress Bar - pinned to bottom - 4px height */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '4px' }}>
        <motion.div
          className="h-full bg-[#F0A500]"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
    </div>
  );
}