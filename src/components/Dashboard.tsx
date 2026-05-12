'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { StoredInterview, StoredStudy } from '@/types';
import { getAllInterviews, exportAllInterviews, getStudyInterviews, getAllStudies } from '@/services/storageService';
import { useLocale } from './LocaleProvider';
import BrandHeader from './BrandHeader';
import {
  Loader2,
  FileText,
  Download,
  Eye,
  Clock,
  MessageSquare,
  Quote,
  ArrowLeft,
  LogOut,
  Filter,
  BookOpen,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { tr, locale } = useLocale();
  const [interviews, setInterviews] = useState<StoredInterview[]>([]);
  const [studies, setStudies] = useState<StoredStudy[]>([]);
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadStudies();
  }, []);

  useEffect(() => {
    loadInterviews(selectedStudyId);
  }, [selectedStudyId]);

  const loadStudies = async () => {
    try {
      const { studies: data } = await getAllStudies();
      setStudies(data);
    } catch (error) {
      console.error('Error loading studies:', error);
    }
  };

  const loadInterviews = async (studyId: string | null) => {
    setLoading(true);
    try {
      const data = studyId ? await getStudyInterviews(studyId) : await getAllInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Error loading interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const blob = await exportAllInterviews();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `listen-interviews-${Date.now()}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleViewInterview = (id: string) => {
    router.push(`/dashboard/interview/${id}`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDuration = (start: number, end: number) => {
    const minutes = Math.round((end - start) / 1000 / 60);
    return `${minutes} ${tr('durationUnit')}`;
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-listen-paper">
      <BrandHeader
        actions={
          <button
            onClick={handleLogout}
            className="text-[13px] text-listen-inkMute hover:text-listen-ink flex items-center gap-1.5 transition-colors"
          >
            <LogOut size={14} />
            {tr('navLogout')}
          </button>
        }
      />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="eyebrow mb-3">{tr('navInterviews')}</div>
              <h1 className="font-serif text-[42px] sm:text-[52px] leading-[1.05] tracking-tight text-listen-ink">
                {tr('dashboardTitle')}
              </h1>
              <p className="mt-3 text-[15px] text-listen-inkMute">
                <span className="serif-numeral">{interviews.length}</span>{' '}
                {interviews.length === 1 ? tr('studiesInterviewLabel') : tr('studiesInterviewsLabel')} ·{' '}
                {tr('dashboardCollected')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/studies')}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <BookOpen size={16} />
                {tr('navStudies')}
              </button>
              <button
                onClick={() => router.push('/setup')}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                {tr('backToSetup')}
              </button>
              {interviews.length > 0 && (
                <button
                  onClick={handleExportAll}
                  disabled={exporting}
                  className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  {tr('dashboardExportAll')}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        {studies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 flex items-center gap-3"
          >
            <Filter size={14} className="text-listen-inkMute" />
            <select
              value={selectedStudyId || ''}
              onChange={(e) => setSelectedStudyId(e.target.value || null)}
              className="input-paper max-w-md py-2.5"
            >
              <option value="">{tr('dashboardFilterAll')}</option>
              {studies.map((study) => (
                <option key={study.id} value={study.id}>
                  {study.config.name} ({study.interviewCount})
                </option>
              ))}
            </select>
            {selectedStudyId && (
              <button
                onClick={() => setSelectedStudyId(null)}
                className="text-sm text-listen-inkMute hover:text-listen-ink"
              >
                {tr('dashboardClearFilter')}
              </button>
            )}
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-listen-inkMute" />
          </div>
        ) : interviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="paper-card p-12 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-listen-paperDeep border border-listen-line flex items-center justify-center mx-auto mb-5">
              <FileText size={26} className="text-listen-inkMute" />
            </div>
            <h2 className="font-serif text-2xl text-listen-ink mb-2">{tr('dashboardEmptyTitle')}</h2>
            <p className="text-listen-inkMute mb-7 max-w-md mx-auto">{tr('dashboardEmptyDesc')}</p>
            <button
              onClick={() => router.push('/setup')}
              className="btn-primary inline-flex items-center gap-2"
            >
              {tr('dashboardCreateLink')}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="paper-card p-6 cursor-pointer"
                onClick={() => handleViewInterview(interview.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-3 mb-2">
                      <h3 className="font-serif text-[19px] text-listen-ink">{interview.studyName}</h3>
                      <span
                        className={`px-2 py-0.5 text-[11px] tracking-wide rounded-full border ${
                          interview.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200/70'
                            : 'bg-listen-paperDeep text-listen-inkMute border-listen-line'
                        }`}
                      >
                        {interview.status === 'completed' ? tr('statusCompleted') : tr('statusInProgress')}
                      </span>
                    </div>

                    {interview.participantProfile && interview.participantProfile.fields.length > 0 && (
                      <div className="text-[13px] text-listen-inkMute mb-3">
                        {interview.participantProfile.fields
                          .filter((f) => f.status === 'extracted' && f.value)
                          .slice(0, 3)
                          .map((f) => f.value)
                          .join(' · ')}
                      </div>
                    )}

                    {interview.synthesis?.bottomLine && (
                      <div className="flex items-start gap-2.5 text-[14px] text-listen-inkSoft bg-listen-paperDeep/70 rounded-xl p-3.5 mb-3 border border-listen-lineSoft">
                        <Quote size={15} className="text-listen-accent flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{interview.synthesis.bottomLine}</span>
                      </div>
                    )}

                    <div className="flex items-center flex-wrap gap-4 text-[12px] text-listen-inkMute">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span className="serif-numeral text-listen-inkSoft">
                          {formatDuration(interview.createdAt, interview.completedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={12} />
                        <span className="serif-numeral text-listen-inkSoft">{interview.transcript.length}</span>
                        <span>{tr('messagesLabel')}</span>
                      </div>
                      <div>{formatDate(interview.createdAt)}</div>
                    </div>
                  </div>

                  <button
                    className="p-2 text-listen-inkMute hover:text-listen-accent transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewInterview(interview.id);
                    }}
                    aria-label="view"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
