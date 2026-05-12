'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_LOCALE, Locale, t, TranslationKey } from '@/lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
  tr: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = 'listen-locale';

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === 'zh' || stored === 'en') {
        setLocaleState(stored);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // 持久化
  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    // 设置 html lang 属性方便 CSS 字体微调
    try {
      document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  }, [locale, setLocale]);

  const tr = useCallback((key: TranslationKey): string => {
    const entry = t[key];
    if (!entry) return key;
    return entry[locale] ?? entry.zh ?? key;
  }, [locale]);

  // 避免水合不一致：未水合前用默认 locale 渲染
  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggle, tr }}>
      <div data-hydrated={hydrated ? 'true' : 'false'}>{children}</div>
    </LocaleContext.Provider>
  );
};

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // 防御：未挂载 Provider 时仍能渲染（用默认 zh）
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      toggle: () => {},
      tr: (key) => {
        const entry = t[key];
        return entry?.[DEFAULT_LOCALE] ?? key;
      },
    };
  }
  return ctx;
}
