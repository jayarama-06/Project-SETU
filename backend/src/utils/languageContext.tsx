/**
 * SETU – Global Language Context
 * Provides i18n toggle state (EN ↔ TE) across the entire app.
 * State persists to localStorage under key "setu_lang".
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export type AppLanguage = 'en' | 'te';

const STORAGE_KEY = 'setu_lang';

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  toggle: () => {},
});

function readStoredLang(): AppLanguage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'te') return stored;
  } catch {
    // SSR / privacy mode
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState<AppLanguage>(readStoredLang);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLangState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: AppLanguage = prev === 'en' ? 'te' : 'en';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook – use this anywhere to read/set the current app language.
 * @example
 *   const { language, setLanguage } = useLanguage();
 */
export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
