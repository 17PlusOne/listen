'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { StoredStudy } from '@/types';
import { getAllStudies, deleteStudy } from '@/services/storageService';
import { useLocale } from './LocaleProvider';
import BrandHeader from './BrandHeader';
import {
  Loader2,
  Plus,
  Users,
  Calendar,
  Lock,
  CheckCircle2,
  Trash2,
  Eye,
  Link as LinkIcon,
  MoreVertical,
  LogOut,
  AlertTriangle,
  Database,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const StudyList: React.FC = () => {
  const router = useRouter();
  const { tr, locale } = useLocale();
  const [studies, setStudies] = useState<StoredStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [kvWarning, setKvWarning] = useState<string | null>(null);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadStudies();
  }, []);

  const loadStudies = async () => {
    setLoading(true);
    try {
      const { studies: data, warning } = await getAllStudies();
      setStudies(data);
      setKvWarning(warning || null);
    } catch (error) {
      console.error('Error loading studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr('confirmDeleteStudy'))) return;

    setDeletingId(id);
    try {
      const result = await deleteStudy(id);
      if (result.success) {
        setStudies(studies.filter((s) => s.id !== id));
      } else {
        alert(result.error || tr('deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting study:', error);
      alert(tr('deleteFailed'));
    } finally {
      setDeletingId(null);
      setMenuOpenId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    setDemoMessage(null);
    try {
      const response = await fetch('/api/demo/seed', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setDemoMessage({ type: 'success', text: tr('demoLoadedSuccess') });
        await loadStudies();
      } else {
        setDemoMessage({ type: 'error', text: data.error || tr('demoLoadingFailed') });
      }
    } catch (error) {
      console.error('Error loading demo:', error);
      setDemoMessage({ type: 'error', text: tr('demoLoadingFailed') });
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleClearDemo = async () => {
    if (!confirm(tr('demoConfirmClear'))) return;
    setLoadingDemo(true);
    setDemoMessage(null);
    try {
      const response = await fetch('/api/demo/seed', { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        setDemoMessage({ type: 'success', text: tr('demoClearedSuccess') });
        await loadStudies();
      } else {
        setDemoMessage({ type: 'error', text: data.error || tr('demoLoadingFailed') });
      }
    } catch (error) {
      console.error('Error clearing demo:', error);
      setDemoMessage({ type: 'error', text: tr('demoLoadingFailed') });
    } finally {
      setLoadingDemo(false);
    }
  };

  const hasDemoData = studies.some((s) => s.id.startsWith('demo-'));

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="eyebrow mb-3">{tr('navStudies')}</div>
              <h1 className="font-serif text-[42px] sm:text-[52px] leading-[1.05] tracking-tight text-listen-ink">
                {tr('studiesTitle')}
              </h1>
              <p className="mt-3 text-[15px] text-listen-inkMute">
                <span className="serif-numeral">{studies.length}</span> {studies.length === 1 ? (locale === 'zh' ? '份研究' : 'study') : tr('studiesCountLabel')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/setup')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={16} />
                {tr('navCreateStudy')}
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Users size={16} />
                {tr('navInterviews')}
              </button>
              {hasDemoData ? (
                <button
                  onClick={handleClearDemo}
                  disabled={loadingDemo}
                  className="btn-ghost inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingDemo ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
                  {tr('navClearDemo')}
                </button>
              ) : (
                <button
                  onClick={handleLoadDemo}
                  disabled={loadingDemo || !!kvWarning}
                  className="btn-ghost inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingDemo ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {tr('navLoadDemo')}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* KV warning */}
        {kvWarning && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4 flex items-start gap-3"
          >
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">{tr('storageWarning')}</h4>
              <p className="text-sm text-amber-800/80">{tr('storageWarningDesc')}</p>
            </div>
          </motion.div>
        )}

        {/* Demo banner */}
        {demoMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 rounded-2xl border px-5 py-4 flex items-center gap-3 ${
              demoMessage.type === 'success'
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
                : 'border-rose-200 bg-rose-50/70 text-rose-900'
            }`}
          >
            {demoMessage.type === 'success' ? (
              <Sparkles size={18} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle size={18} className="text-rose-600 flex-shrink-0" />
            )}
            <p className="text-sm flex-1">{demoMessage.text}</p>
            <button
              onClick={() => setDemoMessage(null)}
              className="text-listen-inkMute hover:text-listen-ink"
              aria-label="close"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-listen-inkMute" />
          </div>
        ) : studies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="paper-card p-12 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-listen-paperDeep border border-listen-line flex items-center justify-center mx-auto mb-5">
              <BookOpen size={26} className="text-listen-inkMute" />
            </div>
            <h2 className="font-serif text-2xl text-listen-ink mb-2">{tr('studiesEmptyTitle')}</h2>
            <p className="text-listen-inkMute mb-7 max-w-md mx-auto">{tr('studiesEmptyDesc')}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => router.push('/setup')} className="btn-primary inline-flex items-center gap-2">
                <Plus size={16} />
                {tr('navCreateStudy')}
              </button>
              {!kvWarning && (
                <button
                  onClick={handleLoadDemo}
                  disabled={loadingDemo}
                  className="btn-ghost inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingDemo ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {tr('navLoadDemo')}
                </button>
              )}
            </div>
            {!kvWarning && (
              <p className="text-listen-inkMute text-xs mt-5">{tr('demoIncludesNote')}</p>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {studies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="paper-card p-6 relative group"
              >
                {/* Menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === study.id ? null : study.id)}
                    className="p-1.5 text-listen-inkMute hover:text-listen-ink rounded-lg hover:bg-listen-paperDeep transition-colors"
                    aria-label="menu"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuOpenId === study.id && (
                    <div className="absolute right-0 mt-1.5 w-56 bg-white border border-listen-line rounded-xl shadow-paper z-10 overflow-hidden">
                      <button
                        onClick={() => {
                          router.push(`/studies/${study.id}`);
                          setMenuOpenId(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-listen-ink hover:bg-listen-paperDeep flex items-center gap-2"
                      >
                        <Eye size={14} />
                        {tr('menuViewDetails')}
                      </button>
                      <button
                        onClick={() => {
                          sessionStorage.setItem('prefillStudyConfig', JSON.stringify(study.config));
                          router.push(`/setup?prefill=edit&studyId=${study.id}`);
                          setMenuOpenId(null);
                        }}
                        disabled={study.isLocked}
                        className="w-full px-4 py-2.5 text-left text-sm text-listen-ink hover:bg-listen-paperDeep flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <LinkIcon size={14} />
                        {tr('menuEditAndGenerate')}
                      </button>
                      <button
                        onClick={() => handleDelete(study.id)}
                        disabled={deletingId === study.id || study.interviewCount > 0}
                        className="w-full px-4 py-2.5 text-left text-sm text-listen-accent hover:bg-rose-50 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed border-t border-listen-line/60"
                      >
                        {deletingId === study.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        {tr('menuDelete')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="cursor-pointer pr-8" onClick={() => router.push(`/studies/${study.id}`)}>
                  <h3 className="font-serif text-[22px] leading-snug text-listen-ink mb-1.5">
                    {study.config.name}
                  </h3>
                  {study.config.description && (
                    <p className="text-[14px] text-listen-inkMute line-clamp-2 leading-relaxed mb-4">
                      {study.config.description}
                    </p>
                  )}

                  <div className="flex items-center gap-5 text-[12px] text-listen-inkMute mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users size={13} />
                      <span className="serif-numeral text-listen-ink">{study.interviewCount}</span>
                      <span>{study.interviewCount === 1 ? tr('studiesInterviewLabel') : tr('studiesInterviewsLabel')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      <span>{formatDate(study.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 text-[11px] tracking-wide rounded-full inline-flex items-center gap-1 ${
                        study.isLocked
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                          : 'bg-listen-paperDeep text-listen-inkMute border border-listen-line'
                      }`}
                    >
                      {study.isLocked ? <CheckCircle2 size={11} /> : <Lock size={11} />}
                      {study.isLocked ? tr('studyStatusLocked') : tr('studyStatusDraft')}
                    </span>
                    <span className="px-2.5 py-1 text-[11px] rounded-full bg-listen-paperDeep text-listen-inkMute border border-listen-line">
                      <span className="serif-numeral">{study.config.coreQuestions.length}</span> {tr('studiesQuestionsLabel')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudyList;
