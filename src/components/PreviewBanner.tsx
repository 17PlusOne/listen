'use client';

import { useStore } from '@/store';
import { useRouter, usePathname } from 'next/navigation';
import { Eye, ArrowLeft } from 'lucide-react';
import { useLocale } from './LocaleProvider';

export default function PreviewBanner() {
  const { isPreview, setViewMode, setIsPreview, setStep, resetParticipant } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const { tr } = useLocale();

  // 仅在 isPreview 为 true 且处于受访者流页面时显示。
  // 这使研究员的预览状态与真实受访者（从 /p/<token> 进入）区分开。
  const participantPages = ['/consent', '/interview', '/synthesis', '/export'];
  const isOnParticipantPage = participantPages.some((p) => pathname?.startsWith(p));

  if (!isPreview || !isOnParticipantPage) {
    return null;
  }

  const handleExit = () => {
    setIsPreview(false);
    setViewMode('researcher');
    setStep('setup');
    resetParticipant();
    router.push('/setup');
  };

  return (
    <div className="sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between bg-listen-paperDeep border-b border-listen-line/60 shadow-sm">
      <div className="flex items-center gap-2 text-listen-ink">
        <Eye size={15} className="text-listen-accent" />
        <span className="text-[13px] font-medium tracking-wide">{tr('previewModeLabel')}</span>
      </div>
      <button
        onClick={handleExit}
        className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-listen-inkSoft hover:text-listen-ink bg-white/60 hover:bg-white rounded-full border border-listen-line/60 transition-colors"
      >
        <ArrowLeft size={13} />
        {tr('previewExitLabel')}
      </button>
    </div>
  );
}
