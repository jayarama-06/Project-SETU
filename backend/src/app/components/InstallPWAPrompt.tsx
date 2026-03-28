import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useLanguage } from '../utils/languageContext';
import { t } from '../utils/translations';

/**
 * InstallPWAPrompt Component
 * Shows "Add to Home Screen" prompt for non-installed users
 * Follows AP-05 design compliance
 */
export function InstallPWAPrompt() {
  const { language } = useLanguage();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;

    // Check if user dismissed the prompt before
    const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';

    if (isInstalled || isDismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // Show the custom install prompt after 10 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 10000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`[PWA] User choice: ${outcome}`);

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);

    // Store the outcome
    localStorage.setItem('pwa-install-dismissed', outcome === 'dismissed' ? 'true' : 'false');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div
      className="fixed bottom-16 left-4 right-4 z-40 bg-white rounded-lg shadow-xl border border-gray-200 md:max-w-sm md:left-auto md:right-4"
      role="dialog"
      aria-labelledby="install-pwa-title"
      aria-describedby="install-pwa-description"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-[#0D1B2A] rounded-lg flex items-center justify-center">
            <GetAppRoundedIcon className="text-[#F0A500]" sx={{ fontSize: 24 }} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 id="install-pwa-title" className="font-semibold text-sm text-[#0D1B2A]">
              {t('pwa.install.title', language, 'Install SETU App')}
            </h3>
            <p id="install-pwa-description" className="text-xs text-gray-600 mt-1">
              {t('pwa.install.description', language, 'Access SETU faster and work offline')}
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} className="text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button
            onClick={handleInstall}
            className="flex-1 h-10 bg-[#F0A500] hover:bg-[#F0A500]/90 text-[#0D1B2A] font-semibold rounded-lg"
          >
            {t('pwa.install.cta', language, 'Install')}
          </Button>
          
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="px-4 h-10 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            {t('pwa.install.notNow', language, 'Not now')}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * iOS Install Instructions Component
 * Shows manual installation instructions for iOS Safari
 */
export function IOSInstallInstructions() {
  const { language } = useLanguage();
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Only show on iOS Safari when not installed
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isInstalled = (window.navigator as any).standalone === true;
    const isDismissed = localStorage.getItem('ios-install-dismissed') === 'true';

    if (isIOS && isSafari && !isInstalled && !isDismissed) {
      // Show after 15 seconds
      setTimeout(() => {
        setShowInstructions(true);
      }, 15000);
    }
  }, []);

  const handleDismiss = () => {
    setShowInstructions(false);
    localStorage.setItem('ios-install-dismissed', 'true');
  };

  if (!showInstructions) return null;

  return (
    <div
      className="fixed bottom-16 left-4 right-4 z-40 bg-white rounded-lg shadow-xl border border-gray-200 md:max-w-sm md:left-auto md:right-4"
      role="dialog"
      aria-labelledby="ios-install-title"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 id="ios-install-title" className="font-semibold text-sm text-[#0D1B2A]">
            {t('pwa.ios.title', language, 'Install SETU on iPhone')}
          </h3>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} className="text-gray-500" />
          </button>
        </div>

        <ol className="space-y-2 text-xs text-gray-600">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-[#0D1B2A] text-white rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
            <span>{t('pwa.ios.step1', language, 'Tap the Share button at the bottom of Safari')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-[#0D1B2A] text-white rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
            <span>{t('pwa.ios.step2', language, 'Scroll down and tap "Add to Home Screen"')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-[#0D1B2A] text-white rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
            <span>{t('pwa.ios.step3', language, 'Tap "Add" to install SETU')}</span>
          </li>
        </ol>

        <Button
          onClick={handleDismiss}
          className="w-full h-10 mt-4 bg-[#F0A500] hover:bg-[#F0A500]/90 text-[#0D1B2A] font-semibold rounded-lg"
        >
          {t('pwa.ios.gotIt', language, 'Got it')}
        </Button>
      </div>
    </div>
  );
}
