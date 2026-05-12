'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { ParticipantToken } from '@/types';
import Consent from '@/components/Consent';
import InterviewChat from '@/components/InterviewChat';
import Synthesis from '@/components/Synthesis';
import Export from '@/components/Export';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function ParticipantPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const {
    currentStep,
    setStep,
    setStudyConfig,
    setViewMode,
    setIsPreview,
    setParticipantToken,
    studyConfig
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify token and load study config on mount
  useEffect(() => {
    const loadStudyFromToken = async () => {
      if (!token) {
        setError('No token provided');
        setLoading(false);
        return;
      }

      try {
        // Verify and decode the token
        const response = await fetch(`/api/generate-link?token=${encodeURIComponent(token)}`);
        const result = await response.json();

        if (!result.valid || !result.data) {
          setError('Invalid or expired link');
          setLoading(false);
          return;
        }

        const tokenData = result.data as ParticipantToken;

        // Set the study config from token
        setStudyConfig(tokenData.studyConfig);
        setParticipantToken(token);
        // 真实受访者入口——显式清除潜在残留的预览状态，避免误显示预览横幅
        setIsPreview(false);
        setViewMode('participant');
        setStep('consent');
        setLoading(false);
      } catch (err) {
        console.error('Error loading study from token:', err);
        setError('Failed to load study configuration');
        setLoading(false);
      }
    };

    loadStudyFromToken();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-listen-paper flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-listen-accent mx-auto mb-4" />
          <p className="text-listen-inkMute">正在载入访谈…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-listen-paper flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-listen-accentSoft flex items-center justify-center mx-auto mb-5 border border-listen-accentDeep/20">
            <AlertTriangle size={28} className="text-listen-accentDeep" />
          </div>
          <h1 className="font-serif text-2xl text-listen-ink mb-2">访谈链接无法载入</h1>
          <p className="text-listen-inkSoft mb-6">{error}</p>
          <p className="text-listen-inkMute text-sm">
            请核实你拿到的是完整链接，或联系发起研究的作者。
          </p>
        </div>
      </div>
    );
  }

  // No study config loaded
  if (!studyConfig) {
    return (
      <div className="min-h-screen bg-listen-paper flex items-center justify-center">
        <p className="text-listen-inkMute">未找到访谈配置。</p>
      </div>
    );
  }

  // Render the appropriate step
  switch (currentStep) {
    case 'consent':
      return <Consent />;
    case 'interview':
      return <InterviewChat />;
    case 'synthesis':
      return <Synthesis />;
    case 'export':
      return <Export />;
    default:
      return <Consent />;
  }
}
