'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { synthesizeInterview } from '@/services/geminiService';
import { saveCompletedInterview } from '@/services/storageService';
import { useLocale } from './LocaleProvider';
import BrandHeader from './BrandHeader';
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

const Synthesis: React.FC = () => {
  const router = useRouter();
  const { tr } = useLocale();
  const {
    studyConfig,
    participantProfile,
    interviewHistory,
    behaviorData,
    synthesis,
    setSynthesis,
    setStep,
    participantToken
  } = useStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'pending' | 'saved' | 'failed' | null>(null);
  const [analysisError, setAnalysisError] = useState(false);

  // Track if analysis has been attempted to prevent re-running
  const hasAttemptedAnalysis = useRef(false);

  // Counter to trigger re-analysis when retry is clicked
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Extract save logic into a reusable function for retry
  const doSave = async (synthesisToSave: typeof synthesis) => {
    if (!studyConfig || !synthesisToSave) return;

    setIsSaving(true);
    setSaveStatus('pending');
    try {
      const interviewId = participantProfile?.id || `interview-${Date.now()}`;
      const saveResult = await saveCompletedInterview({
        id: interviewId,
        studyId: studyConfig.id,
        studyName: studyConfig.name,
        participantProfile: participantProfile || {
          id: interviewId,
          fields: [],
          rawContext: '',
          timestamp: Date.now()
        },
        transcript: interviewHistory,
        synthesis: synthesisToSave,
        behaviorData: behaviorData,
        createdAt: participantProfile?.timestamp || Date.now()
      }, participantToken);

      setSaveStatus(saveResult.success ? 'saved' : 'failed');
    } catch (error) {
      console.error('Error saving interview:', error);
      setSaveStatus('failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Retry save handler
  const handleRetrySave = () => {
    if (synthesis) {
      doSave(synthesis);
    }
  };

  // Retry analysis handler (for when synthesis itself fails)
  const handleRetryAnalysis = () => {
    setAnalysisError(false);
    hasAttemptedAnalysis.current = false;
    setRetryTrigger(prev => prev + 1);  // Trigger effect re-run
  };

  useEffect(() => {
    const analyzeAndSave = async () => {
      if (!studyConfig || interviewHistory.length === 0) return;

      // If we already have synthesis, try to save if not already saved
      if (synthesis) {
        if (saveStatus === null && !hasAttemptedAnalysis.current) {
          // Page was refreshed with synthesis in store but save never attempted
          hasAttemptedAnalysis.current = true;
          doSave(synthesis);
        }
        return;
      }

      // Prevent re-running analysis if already attempted
      if (hasAttemptedAnalysis.current) return;
      hasAttemptedAnalysis.current = true;

      setIsAnalyzing(true);
      try {
        const result = await synthesizeInterview(
          interviewHistory,
          studyConfig,
          behaviorData,
          participantProfile,
          participantToken
        );
        setSynthesis(result);

        // Save interview to KV after synthesis completes
        await doSave(result);
      } catch (error) {
        console.error('Error synthesizing interview:', error);
        setAnalysisError(true);
        hasAttemptedAnalysis.current = false;  // Allow retry
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeAndSave();
    // Note: behaviorData, participantProfile, participantToken are intentionally
    // not in deps - we only want to analyze once when the page loads, not on updates
    // retryTrigger is included to allow manual retry after failure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyConfig, interviewHistory, synthesis, saveStatus, setSynthesis, retryTrigger]);

  const handleBack = () => {
    setStep('interview');
    router.push('/interview');
  };

  const handleExport = () => {
    setStep('export');
    router.push('/export');
  };

  if (!studyConfig) {
    return (
      <main className="min-h-screen bg-listen-paper flex items-center justify-center">
        <p className="text-listen-inkMute">{tr('synthesisNoData')}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-listen-paper">
      <BrandHeader minimal />

      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-listen-paperDeep border border-listen-line/60 flex items-center justify-center">
              <BarChart3 className="text-listen-accent" size={20} />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-listen-ink">
              {tr('synthesisPageTitle')}
            </h1>
          </div>
          <p className="text-listen-inkMute ml-13">
            {tr('synthesisPageSubtitle')}
          </p>
        </motion.div>

        {isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8 text-center"
          >
            <Loader2 size={48} className="animate-spin text-listen-accent mx-auto mb-4" />
            <h2 className="font-serif text-lg text-listen-ink mb-2">
              {tr('synthesisAnalyzing')}
            </h2>
            <p className="text-listen-inkMute">
              {tr('synthesisAnalyzingDesc')}
            </p>
          </motion.div>
        ) : synthesis ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Save Status Banner */}
            {saveStatus === 'saved' && (
              <div className="bg-white border border-listen-mint/40 text-listen-mint rounded-2xl shadow-paper p-4 flex items-center gap-3">
                <CheckCircle size={20} className="text-listen-mint shrink-0" />
                <span className="text-listen-ink text-sm">{tr('synthesisSaved')}</span>
              </div>
            )}
            {saveStatus === 'failed' && (
              <div className="bg-white border border-listen-accentDeep/30 rounded-2xl shadow-paper p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <XCircle size={20} className="text-listen-accentDeep shrink-0" />
                  <span className="text-listen-inkSoft text-sm">{tr('synthesisSaveFailed')}</span>
                </div>
                <button
                  onClick={handleRetrySave}
                  disabled={isSaving}
                  className="shrink-0 px-4 py-1.5 bg-listen-accent hover:bg-listen-accentDeep text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  {tr('synthesisRetrySave')}
                </button>
              </div>
            )}
            {saveStatus === 'pending' && isSaving && (
              <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-4 flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-listen-accent" />
                <span className="text-listen-inkSoft text-sm">{tr('synthesisSaving')}</span>
              </div>
            )}

            {/* Key Insight */}
            <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3 text-listen-inkMute">
                <Target size={16} className="text-listen-accent" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  {tr('synthesisKeyInsight')}
                </span>
              </div>
              <p className="font-serif text-xl text-listen-ink leading-relaxed">
                {synthesis.bottomLine}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stated vs Revealed */}
              <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8">
                <h3 className="font-serif text-lg text-listen-ink mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-listen-accent" />
                  {tr('synthesisPatternsTitle')}
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-listen-inkMute uppercase tracking-wider mb-2">
                      {tr('synthesisPatternsStated')}
                    </div>
                    <div className="space-y-1">
                      {synthesis.statedPreferences.map((item, i) => (
                        <div
                          key={i}
                          className="text-sm bg-listen-paper text-listen-inkSoft px-3 py-1.5 rounded-xl border border-listen-line/40"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-listen-inkMute uppercase tracking-wider mb-2">
                      {tr('synthesisPatternsRevealed')}
                    </div>
                    <div className="space-y-1">
                      {synthesis.revealedPreferences.map((item, i) => (
                        <div
                          key={i}
                          className="text-sm bg-listen-paperDeep text-listen-ink px-3 py-1.5 rounded-xl border border-listen-line/40"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Themes */}
              <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8">
                <h3 className="font-serif text-lg text-listen-ink mb-4 flex items-center gap-2">
                  <Lightbulb size={18} className="text-listen-accent" />
                  {tr('synthesisThemes')}
                </h3>

                <div className="space-y-3">
                  {synthesis.themes.map((theme, i) => (
                    <div key={i} className="border-b border-listen-line/50 pb-3 last:border-0 last:pb-0">
                      <div className="font-medium text-listen-ink text-sm">{theme.theme}</div>
                      <div className="text-sm text-listen-inkMute mt-1 leading-relaxed">{theme.evidence}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tensions / Contradictions */}
            {synthesis.contradictions.length > 0 && (
              <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8">
                <h3 className="font-serif text-lg text-listen-ink mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-listen-accentDeep" />
                  {tr('synthesisTensions')}
                </h3>
                <ul className="space-y-2">
                  {synthesis.contradictions.map((c, i) => (
                    <li key={i} className="text-listen-inkSoft text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-listen-accentDeep mt-0.5 shrink-0">&#8212;</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlights / Key Insights */}
            <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8">
              <h3 className="font-serif text-lg text-listen-ink mb-4">
                {tr('synthesisHighlights')}
              </h3>
              <ul className="space-y-2">
                {synthesis.keyInsights.map((insight, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-listen-inkSoft text-sm leading-relaxed"
                  >
                    <span className="text-listen-inkMute mt-0.5 shrink-0">&#8212;</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleBack}
                className="px-5 py-2.5 bg-white border border-listen-line text-listen-inkSoft rounded-full hover:bg-listen-paperDeep transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <ArrowLeft size={16} />
                {tr('synthesisBackToInterview')}
              </button>
              <button
                onClick={handleExport}
                className="flex-1 py-2.5 bg-listen-accent hover:bg-listen-accentDeep text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-accent text-sm"
              >
                {tr('synthesisGoToExport')}
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : analysisError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-listen-accentSoft flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-listen-accentDeep" />
            </div>
            <h2 className="font-serif text-xl text-listen-ink mb-2">
              {tr('synthesisFailed')}
            </h2>
            <p className="text-listen-inkMute mb-6 text-sm">
              {tr('synthesisFailedDesc')}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleBack}
                className="px-5 py-2.5 bg-white border border-listen-line text-listen-inkSoft rounded-full hover:bg-listen-paperDeep transition-colors text-sm font-medium"
              >
                {tr('synthesisBackToInterview')}
              </button>
              <button
                onClick={handleRetryAnalysis}
                className="px-5 py-2.5 bg-listen-accent hover:bg-listen-accentDeep text-white rounded-full transition-colors flex items-center gap-2 text-sm font-medium shadow-accent"
              >
                <RefreshCw size={16} />
                {tr('synthesisRetryAnalysis')}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8 text-center">
            <p className="text-listen-inkMute text-sm mb-4">
              {tr('synthesisNoData')}
            </p>
            <button
              onClick={handleBack}
              className="px-5 py-2.5 bg-listen-accent hover:bg-listen-accentDeep text-white rounded-full shadow-accent transition-colors text-sm font-medium"
            >
              {tr('synthesisGoToInterviewBtn')}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Synthesis;
