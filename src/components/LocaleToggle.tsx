'use client';

import React from 'react';
import { useLocale } from './LocaleProvider';

interface LocaleToggleProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const LocaleToggle: React.FC<LocaleToggleProps> = ({ className = '', variant = 'light' }) => {
  const { locale, toggle } = useLocale();

  const base = 'inline-flex items-center gap-1 text-[13px] font-medium tracking-wide select-none transition-all';
  const lightStyle = 'text-listen-inkMute hover:text-listen-ink';
  const darkStyle = 'text-listen-paper/70 hover:text-listen-paper';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle language"
      className={`${base} ${variant === 'dark' ? darkStyle : lightStyle} ${className}`}
    >
      <span
        className={`px-1.5 py-0.5 rounded transition-all ${
          locale === 'zh'
            ? 'bg-listen-ink text-listen-paper'
            : 'opacity-50'
        }`}
      >
        中
      </span>
      <span className="opacity-30 text-[10px]">/</span>
      <span
        className={`px-1.5 py-0.5 rounded transition-all ${
          locale === 'en'
            ? 'bg-listen-ink text-listen-paper'
            : 'opacity-50'
        }`}
      >
        EN
      </span>
    </button>
  );
};

export default LocaleToggle;
