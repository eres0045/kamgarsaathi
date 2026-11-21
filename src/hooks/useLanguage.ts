
'use client';

import { useCallback, useEffect, useState } from 'react';

export type Language = 'mr' | 'en';

export const LANGUAGE_STORAGE_KEY = 'kamgarsaathi.language';
export const DEFAULT_LANGUAGE: Language = 'mr';

function isLanguage(value: unknown): value is Language {
  return value === 'mr' || value === 'en';
}

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function writeStoredLanguage(next: Language): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
  } catch {
    // Storage may be unavailable (private mode, quota, sandboxed iframe).
    // The in-memory state still updates, so the UI keeps working.
  }
}

export function useLanguage() {
  // Server and first client render both use the default so markup matches.
  // The stored preference is applied after mount to avoid hydration mismatches.
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    setLanguageState(readStoredLanguage());

    function onStorage(event: StorageEvent) {
      if (event.key !== LANGUAGE_STORAGE_KEY && event.key !== null) return;
      setLanguageState(isLanguage(event.newValue) ? event.newValue : DEFAULT_LANGUAGE);
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    writeStoredLanguage(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => {
      const next: Language = current === 'mr' ? 'en' : 'mr';
      writeStoredLanguage(next);
      return next;
    });
  }, []);

  return {
    language,
    setLanguage,
    toggleLanguage,
    isMarathi: language === 'mr',
  };
}