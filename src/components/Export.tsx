'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { useLocale } from './LocaleProvider';
import BrandHeader from './BrandHeader';
import {
  Download,
  FileJson,
  FileText,
  RotateCcw,
  CheckCircle,
  Copy,
  User,
  Check,
  Lightbulb,
  Target
} from 'lucide-react';

const Export: React.FC = () => {
  const { tr } = useLocale();
  const {
    studyConfig,
    participantProfile,
    interviewHistory,
    questionProgress,
    behaviorData,
    synthesis,
    resetParticipant,
    reset
  } = useStore();

  const generateJSON = () => {
    // Build profile fields with labels
    const profileFields = participantProfile?.fields.map(f => {
      const schema = studyConfig?.profileSchema.find(s => s.id === f.fieldId);
      return {
        fieldId: f.fieldId,
        label: schema?.label || f.fieldId,
        value: f.value,
        status: f.status,
        extractedAt: f.extractedAt ? new Date(f.extractedAt).toISOString() : null
      };
    }) || [];

    const data = {
      study: {
        id: studyConfig?.id,
        name: studyConfig?.name,
        researchQuestion: studyConfig?.researchQuestion,
        aiBehavior: studyConfig?.aiBehavior,
        coreQuestions: studyConfig?.coreQuestions,
        topicAreas: studyConfig?.topicAreas
      },
      participant: {
        id: participantProfile?.id,
        profile: {
          fields: profileFields,
          rawContext: participantProfile?.rawContext
        }
      },
      interview: {
        messageCount: interviewHistory.length,
        questionsAsked: questionProgress.questionsAsked,
        totalQuestions: studyConfig?.coreQuestions.length || 0,
        duration: interviewHistory.length > 1
          ? (interviewHistory[interviewHistory.length - 1].timestamp - interviewHistory[0].timestamp) / 1000
          : 0,
        transcript: interviewHistory.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp).toISOString()
        }))
      },
      behavior: behaviorData,
      synthesis: synthesis,
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  };

  const generateTranscript = () => {
    const lines = [
      `# Interview Transcript`,
      `Study: ${studyConfig?.name}`,
      `Research Question: ${studyConfig?.researchQuestion}`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``
    ];

    // Add participant profile summary
    if (participantProfile && participantProfile.fields.length > 0) {
      lines.push(`## Participant Profile`);
      participantProfile.fields.forEach(f => {
        const schema = studyConfig?.profileSchema.find(s => s.id === f.fieldId);
        const label = schema?.label || f.fieldId;
        const value = f.status === 'extracted' ? f.value : `(${f.status})`;
        lines.push(`- **${label}**: ${value}`);
      });
      if (participantProfile.rawContext) {
        lines.push(``);
        lines.push(`**Context**: ${participantProfile.rawContext}`);
      }
      lines.push(``);
    }

    lines.push(`---`);
    lines.push(``);
    lines.push(`## Conversation`);
    lines.push(``);

    interviewHistory.forEach(msg => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      const role = msg.role === 'user' ? 'PARTICIPANT' : 'INTERVIEWER';
      lines.push(`[${time}] ${role}:`);
      lines.push(msg.content);
      lines.push('');
    });

    if (synthesis) {
      lines.push('---');
      lines.push('');
      lines.push('## Analysis Summary');
      lines.push('');
      lines.push(`**Key Insight:** ${synthesis.bottomLine}`);
      lines.push('');
      if (synthesis.themes.length > 0) {
        lines.push('**Themes:**');
        synthesis.themes.forEach(t => {
          lines.push(`- ${t.theme}: ${t.evidence}`);
        });
        lines.push('');
      }
      if (synthesis.keyInsights.length > 0) {
        lines.push('**Key Insights:**');
        synthesis.keyInsights.forEach(insight => {
          lines.push(`- ${insight}`);
        });
      }
    }

    return lines.join('\n');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const content = generateJSON();
    const filename = `interview-${studyConfig?.id || 'export'}-${Date.now()}.json`;
    downloadFile(content, filename, 'application/json');
    setJsonDownloaded(true);
    setTimeout(() => setJsonDownloaded(false), 3000);
  };

  const handleDownloadTranscript = () => {
    const content = generateTranscript();
    const filename = `transcript-${studyConfig?.id || 'export'}-${Date.now()}.md`;
    downloadFile(content, filename, 'text/markdown');
    setMdDownloaded(true);
    setTimeout(() => setMdDownloaded(false), 3000);
  };

  const [jsonCopied, setJsonCopied] = useState(false);
  const [jsonDownloaded, setJsonDownloaded] = useState(false);
  const [mdCopied, setMdCopied] = useState(false);
  const [mdDownloaded, setMdDownloaded] = useState(false);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(generateJSON());
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateTranscript());
    setMdCopied(true);
    setTimeout(() => setMdCopied(false), 2000);
  };

  const handleNewParticipant = () => {
    if (window.confirm(tr('exportConfirmNewParticipant'))) {
      resetParticipant();
    }
  };

  const handleNewStudy = () => {
    if (window.confirm(tr('exportConfirmNewStudy'))) {
      reset();
    }
  };

  // Calculate extracted profile fields
  const extractedFields = participantProfile?.fields.filter(f => f.status === 'extracted') || [];
  const totalFields = participantProfile?.fields.length || 0;

  const jsonFilename = `interview-${studyConfig?.id || 'export'}.json`;
  const mdFilename = `transcript-${studyConfig?.id || 'export'}.md`;

  return (
    <div className="min-h-screen bg-listen-paper">
      <BrandHeader minimal />

      <main className="min-h-screen bg-listen-paper pb-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 space-y-6">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-listen-accentSoft flex items-center justify-center">
                <CheckCircle size={20} className="text-listen-mint" />
              </div>
              <h1 className="font-serif text-3xl text-listen-ink">
                {tr('exportTitle')}
              </h1>
            </div>
            <p className="text-listen-inkMute pl-[52px]">
              {tr('exportSubtitle')}
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-5 sm:p-6"
          >
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-semibold font-serif text-listen-ink">
                  {interviewHistory.length}
                </div>
                <div className="text-xs text-listen-inkMute">{tr('exportStatsMessages')}</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold font-serif text-listen-ink">
                  {questionProgress.questionsAsked.length}/{studyConfig?.coreQuestions.length || 0}
                </div>
                <div className="text-xs text-listen-inkMute">{tr('exportStatsQuestions')}</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold font-serif text-listen-ink">
                  {extractedFields.length}/{totalFields}
                </div>
                <div className="text-xs text-listen-inkMute">{tr('exportStatsProfile')}</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold font-serif text-listen-ink">
                  {synthesis?.themes.length || 0}
                </div>
                <div className="text-xs text-listen-inkMute">{tr('exportStatsThemes')}</div>
              </div>
            </div>
          </motion.div>

          {/* Export action cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8 space-y-5"
          >
            <h2 className="font-serif text-xl text-listen-ink">{tr('exportActionsTitle')}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* JSON card */}
              <div className="border border-listen-line/60 rounded-xl p-5 space-y-4 bg-listen-paper/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-listen-accentSoft flex items-center justify-center flex-shrink-0">
                    <FileJson size={20} className="text-listen-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-listen-ink text-sm leading-snug">
                      {tr('exportJsonTitle')}
                    </div>
                    <div className="text-xs text-listen-inkMute mt-0.5 font-mono truncate">
                      {jsonFilename}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-listen-inkMute leading-relaxed">
                  {tr('exportJsonDesc')}
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleDownloadJSON}
                    className="w-full flex items-center justify-center gap-2 bg-listen-accent hover:bg-listen-accentDeep text-white rounded-full px-5 py-2.5 text-sm font-medium shadow-accent transition-colors"
                  >
                    {jsonDownloaded ? (
                      <>
                        <Check size={15} className="text-listen-mint" />
                        {tr('exportJsonDownloaded')}
                      </>
                    ) : (
                      <>
                        <Download size={15} />
                        {tr('exportJsonDownload')}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCopyJSON}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-listen-line text-listen-inkSoft hover:bg-listen-paperDeep rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
                  >
                    {jsonCopied ? (
                      <>
                        <CheckCircle size={15} className="text-listen-mint" />
                        {tr('exportJsonCopied')}
                      </>
                    ) : (
                      <>
                        <Copy size={15} />
                        {tr('exportJsonCopy')}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Markdown card */}
              <div className="border border-listen-line/60 rounded-xl p-5 space-y-4 bg-listen-paper/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-listen-accentSoft flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-listen-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-listen-ink text-sm leading-snug">
                      {tr('exportMdTitle')}
                    </div>
                    <div className="text-xs text-listen-inkMute mt-0.5 font-mono truncate">
                      {mdFilename}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-listen-inkMute leading-relaxed">
                  {tr('exportMdDesc')}
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleDownloadTranscript}
                    className="w-full flex items-center justify-center gap-2 bg-listen-accent hover:bg-listen-accentDeep text-white rounded-full px-5 py-2.5 text-sm font-medium shadow-accent transition-colors"
                  >
                    {mdDownloaded ? (
                      <>
                        <Check size={15} className="text-listen-mint" />
                        {tr('exportMdDownloaded')}
                      </>
                    ) : (
                      <>
                        <Download size={15} />
                        {tr('exportMdDownload')}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCopyMarkdown}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-listen-line text-listen-inkSoft hover:bg-listen-paperDeep rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
                  >
                    {mdCopied ? (
                      <>
                        <CheckCircle size={15} className="text-listen-mint" />
                        {tr('exportMdCopied')}
                      </>
                    ) : (
                      <>
                        <Copy size={15} />
                        {tr('exportMdCopy')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Participant profile summary */}
          {participantProfile && extractedFields.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8 space-y-4"
            >
              <h2 className="font-serif text-xl text-listen-ink flex items-center gap-2">
                <User size={18} className="text-listen-inkMute" />
                {tr('exportProfileTitle')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {participantProfile.fields.map(f => {
                  const schema = studyConfig?.profileSchema.find(s => s.id === f.fieldId);
                  return (
                    <div key={f.fieldId} className="flex justify-between items-baseline py-1.5 border-b border-listen-line/40 last:border-0">
                      <span className="text-listen-inkMute">{schema?.label || f.fieldId}</span>
                      <span className={`ml-4 text-right ${
                        f.status === 'extracted'
                          ? 'text-listen-ink font-medium'
                          : 'text-listen-inkMute italic'
                      }`}>
                        {f.status === 'extracted'
                          ? f.value
                          : f.status === 'refused'
                          ? tr('exportProfileDeclined')
                          : f.status === 'vague'
                          ? tr('exportProfileUnclear')
                          : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Synthesis review */}
          {synthesis && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8 space-y-5"
            >
              <h2 className="font-serif text-xl text-listen-ink">
                {tr('exportSynthesisTitle')}
              </h2>

              {/* Key insight */}
              <div className="bg-listen-paperDeep rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-listen-inkMute uppercase tracking-wider font-medium">
                  <Target size={13} />
                  {tr('exportSynthesisKeyInsight')}
                </div>
                <p className="text-listen-ink font-medium leading-relaxed">
                  {synthesis.bottomLine}
                </p>
              </div>

              {/* Themes */}
              {synthesis.themes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-listen-inkMute uppercase tracking-wider font-medium">
                    <Lightbulb size={13} />
                    {tr('exportSynthesisThemes')}
                  </div>
                  <div className="space-y-2">
                    {synthesis.themes.map((theme, i) => (
                      <div key={i} className="border-b border-listen-line/40 pb-2 last:border-0">
                        <div className="text-sm font-medium text-listen-ink">{theme.theme}</div>
                        <div className="text-xs text-listen-inkMute mt-0.5">{theme.evidence}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key insights */}
              {synthesis.keyInsights.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-listen-inkMute uppercase tracking-wider font-medium">
                    {tr('exportSynthesisHighlights')}
                  </div>
                  <ul className="space-y-1.5">
                    {synthesis.keyInsights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-listen-inkSoft">
                        <span className="text-listen-accent mt-0.5 select-none">·</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* Reset zone */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8 space-y-4"
          >
            <div>
              <h2 className="font-serif text-xl text-listen-ink">{tr('exportResetTitle')}</h2>
              <p className="text-sm text-listen-inkMute mt-1">{tr('exportResetDesc')}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleNewParticipant}
                className="flex items-center justify-center gap-2 border border-listen-accentDeep/40 text-listen-accentDeep hover:bg-listen-accentSoft rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
              >
                <RotateCcw size={15} className="text-listen-accentDeep" />
                {tr('exportNewParticipant')}
              </button>
              <button
                onClick={handleNewStudy}
                className="flex items-center justify-center gap-2 border border-listen-accentDeep/40 text-listen-accentDeep hover:bg-listen-accentSoft rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
              >
                <RotateCcw size={15} className="text-listen-accentDeep" />
                {tr('exportNewStudy')}
              </button>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Export;
