import React, { createContext, useContext, useState, useEffect } from 'react';
import es from './es';
import en from './en';

const translations = { es, en };

const LanguageContext = createContext({
  language: 'es',
  setLanguage: () => {},
  t: (key) => key,
  toggleLanguage: () => {},
});

const STORAGE_KEY = 'bop_clips_lang';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'es' || saved === 'en')) {
        return saved;
      }
    } catch (e) {
      // ignore localStorage errors in restricted contexts
    }
    // Default language is Spanish (ES) as per project requirements
    return 'es';
  });

  const setLanguage = (newLang) => {
    if (newLang !== 'es' && newLang !== 'en') return;
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch (e) {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch (_e) {
      // ignore
    }
  }, [language]);

  /**
   * Helper function to translate keys using dot notation (e.g. 'nav.clips' or 'landing.heroTitle')
   */
  const t = (path, defaultOrParams, params) => {
    let defaultValue = typeof defaultOrParams === 'string' ? defaultOrParams : null;
    let interpolationParams = typeof defaultOrParams === 'object' ? defaultOrParams : (params || {});

    const keys = path.split('.');
    
    // 1. Try current language
    let result = translations[language];
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        result = null;
        break;
      }
    }

    // 2. Fallback to alternative language if not found
    if (result === null || result === undefined) {
      const fallbackLang = language === 'es' ? 'en' : 'es';
      let fb = translations[fallbackLang];
      for (const k of keys) {
        if (fb && typeof fb === 'object' && k in fb) {
          fb = fb[k];
        } else {
          fb = null;
          break;
        }
      }
      result = fb;
    }

    // 3. Fallback to provided defaultValue or path
    if (result === null || result === undefined) {
      result = defaultValue !== null ? defaultValue : path;
    }

    // Handle template interpolation {param}
    if (typeof result === 'string' && interpolationParams && Object.keys(interpolationParams).length > 0) {
      return result.replace(/\{(\w+)\}/g, (match, paramName) => {
        return interpolationParams[paramName] !== undefined ? interpolationParams[paramName] : match;
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Responsive language selector (ES / EN) matching Bop Clips visual identity:
 * Anthracite background, metallic gold/amber accents, accessible and mobile-ready.
 */
export function LanguageSelector({ compact = false, className = '' }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Selector de idioma / Language selector"
      className={`inline-flex items-center p-0.5 rounded-input bg-paper2 border border-rule select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('es')}
        aria-pressed={language === 'es'}
        title="Español"
        className={`px-2.5 py-1 text-xs font-mono font-medium rounded-[6px] transition-all duration-200 ${
          language === 'es'
            ? 'bg-brass text-brassink shadow-sm font-semibold'
            : 'text-muted hover:text-ink hover:bg-paper3/60'
        }`}
      >
        {compact ? 'ES' : 'ES'}
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        title="English"
        className={`px-2.5 py-1 text-xs font-mono font-medium rounded-[6px] transition-all duration-200 ${
          language === 'en'
            ? 'bg-brass text-brassink shadow-sm font-semibold'
            : 'text-muted hover:text-ink hover:bg-paper3/60'
        }`}
      >
        {compact ? 'EN' : 'EN'}
      </button>
    </div>
  );
}

export default LanguageContext;
