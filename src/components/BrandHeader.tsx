'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from './LocaleProvider';
import LocaleToggle from './LocaleToggle';

interface BrandHeaderProps {
  /** 是否显示右侧操作区（默认 true） */
  showActions?: boolean;
  /** 右侧自定义内容 */
  actions?: React.ReactNode;
  /** 是否半透明背景（在 Hero 上使用） */
  transparent?: boolean;
  /** 是否隐藏副标语 */
  minimal?: boolean;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({
  showActions = true,
  actions,
  transparent = false,
  minimal = false,
}) => {
  const { tr } = useLocale();

  return (
    <header
      className={`w-full ${
        transparent
          ? 'absolute top-0 left-0 right-0 z-30 bg-transparent'
          : 'sticky top-0 z-30 bg-listen-paper/85 backdrop-blur-md border-b border-listen-line/60'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3 group">
          <span className="font-serif text-[22px] font-semibold text-listen-ink tracking-tight">
            {tr('brand')}
          </span>
          <span className="text-[11px] tracking-[0.24em] uppercase text-listen-inkMute hidden sm:inline-block">
            Listen
          </span>
          {!minimal && (
            <span className="hidden md:inline-block text-[12px] text-listen-inkMute font-light">
              · {tr('brandSubtitle')}
            </span>
          )}
        </Link>

        {showActions && (
          <div className="flex items-center gap-5">
            {actions}
            <LocaleToggle />
          </div>
        )}
      </div>
    </header>
  );
};

export default BrandHeader;
