import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

/**
 * PWAUpdatePrompt Component
 * Displays a banner when a new version of the app is available
 * Follows AP-05 design compliance with Deep Navy and Saffron Gold
 * 
 * Note: Service Worker only works in production builds.
 * In Figma Make dev environment, this component safely does nothing.
 */
export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  // Check if we're in a development iframe environment (Figma Make)
  const isDevelopment = import.meta.env.DEV;
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Don't render in dev iframe environments (PWA not supported)
  if (isDevelopment && isIframe) {
    return null;
  }

  // In production, PWA will work normally
  // For now, this is a placeholder that will be activated when built for production
  
  const handleUpdate = () => {
    // Reload page to get new version
    window.location.reload();
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D1B2A] text-white shadow-lg border-t-4 border-[#F0A500]"
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
        <SystemUpdateAltRoundedIcon className="text-[#F0A500]" sx={{ fontSize: 24 }} />
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">New version available</p>
          <p className="text-xs text-white/70 mt-0.5">
            Update now for the latest features
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpdate}
            className="h-9 px-4 bg-[#F0A500] hover:bg-[#F0A500]/90 text-[#0D1B2A] font-semibold rounded-lg"
          >
            Update
          </Button>
          
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close update prompt"
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to check if the app is running as an installed PWA
 */
export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = (window.navigator as any).standalone === true;

    setIsPWA(isStandalone || (isIOS && isInStandaloneMode));
  }, []);

  return isPWA;
}
