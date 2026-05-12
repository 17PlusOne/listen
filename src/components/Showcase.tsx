'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Quote,
  Target,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Users,
} from 'lucide-react';
import { useLocale } from './LocaleProvider';
import BrandHeader from './BrandHeader';
import {
  DEMO_STUDY_CONFIG,
  DEMO_INTERVIEWS,
  DEMO_AGGREGATE_SYNTHESIS,
} from '@/lib/demoData';

type Tab = 'study' | 'interviews' | 'aggregate';

const Showcase: React.FC = () => {
  const { tr } = useLocale();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('study');
  const [selectedInterview, setSelectedInterview] = useState(0);

  const interview = DEMO_INTERVIEWS[selectedInterview];

  return (
    <div className="min-h-screen bg-listen-paper">
      <BrandHeader
        actions={
          <button
            onClick={() => router.push('/login')}
            className="text-[13px] text-listen-inkSoft hover:text-listen-accent transition-colors"
          >
            {tr('showcaseEnterAdmin')}
            <ArrowRight size={13} className="inline ml-1" />
          </button>
        }
      />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 pt-12 pb-8">
        <button
          onClick={() => router.push('/')}
          className="text-[13px] text-listen-inkMute hover:text-listen-ink transition-colors mb-6 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          {tr('showcaseBackHome')}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-[34px] sm:text-[42px] leading-[1.2] font-semibold text-listen-ink tracking-tight">
            {tr('showcaseTitle')}
          </h1>
          <p className="mt-4 text-[15px] text-listen-inkSoft leading-relaxed max-w-2xl">
            {tr('showcaseSubtitle')}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-listen-line">
          {([
            { id: 'study' as Tab, label: tr('showcaseTabStudy') },
            { id: 'interviews' as Tab, label: tr('showcaseTabInterviews') },
            { id: 'aggregate' as Tab, label: tr('showcaseTabAggregate') },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-[14px] font-medium transition-colors border-b-2 -mb-[1px] ${
                tab === t.id
                  ? 'text-listen-accent border-listen-accent'
                  : 'text-listen-inkMute border-transparent hover:text-listen-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab content */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 pb-24">
        {tab === 'study' && <StudyTab />}
        {tab === 'interviews' && (
          <InterviewsTab
            selected={selectedInterview}
            onSelect={setSelectedInterview}
            interview={interview}
          />
        )}
        {tab === 'aggregate' && <AggregateTab />}
      </section>
    </div>
  );
};

// ====== Study brief tab ======
const StudyTab: React.FC = () => {
  const { tr } = useLocale();
  const cfg = DEMO_STUDY_CONFIG;

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <h2 className="font-serif text-[22px] font-semibold text-listen-ink mb-3">
          {cfg.name}
        </h2>
        <p className="text-[14.5px] text-listen-inkSoft leading-relaxed">
          {cfg.description}
        </p>
      </Card>

      <Card>
        <SectionLabel icon={<Target size={15} />} label={tr('showcaseStudyQuestionLabel')} />
        <p className="text-[15px] text-listen-ink leading-relaxed italic">
          “{cfg.researchQuestion}”
        </p>
      </Card>

      <Card>
        <SectionLabel icon={<Lightbulb size={15} />} label={tr('showcaseStudyCoreQLabel')} />
        <ol className="space-y-3 mt-2">
          {cfg.coreQuestions.map((q, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-serif text-[13px] text-listen-accent font-semibold pt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[14.5px] text-listen-inkSoft leading-relaxed flex-1">{q}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <SectionLabel icon={<BarChart3 size={15} />} label={tr('showcaseStudyTopicsLabel')} />
        <div className="flex flex-wrap gap-2 mt-3">
          {cfg.topicAreas.map((topic, i) => (
            <span
              key={i}
              className="px-3 py-1 text-[12.5px] bg-listen-paperDeep border border-listen-line rounded-full text-listen-inkSoft"
            >
              {topic}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel icon={<Users size={15} />} label={tr('showcaseStudyProfileLabel')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {cfg.profileSchema.map((field) => (
            <div
              key={field.id}
              className="px-4 py-3 bg-listen-paperDeep/60 border border-listen-line rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-medium text-listen-ink">{field.label}</span>
                {field.required && (
                  <span className="text-[10.5px] text-listen-accent font-medium">*</span>
                )}
              </div>
              <p className="mt-1 text-[12.5px] text-listen-inkMute leading-snug">
                {field.extractionHint}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ====== Interviews tab ======
const InterviewsTab: React.FC<{
  selected: number;
  onSelect: (i: number) => void;
  interview: typeof DEMO_INTERVIEWS[number];
}> = ({ selected, onSelect, interview }) => {
  const { tr } = useLocale();
  const synthesis = interview.synthesis;
  if (!synthesis) return null; // Demo data guarantees this is non-null

  return (
    <div className="mt-8">
      {/* Participant chips */}
      <div className="flex flex-wrap gap-3 mb-8">
        {DEMO_INTERVIEWS.map((iv, i) => {
          const cat = iv.participantProfile.fields.find((f) => f.fieldId === 'category')?.value || '';
          const followers =
            iv.participantProfile.fields.find((f) => f.fieldId === 'follower_range')?.value || '';
          const name = extractName(iv.participantProfile.rawContext);
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`px-5 py-3 text-left rounded-xl border transition-all ${
                selected === i
                  ? 'bg-listen-accent text-white border-listen-accent shadow-accent'
                  : 'bg-listen-paperDeep/60 border-listen-line text-listen-inkSoft hover:border-listen-accent/50'
              }`}
            >
              <div className="font-medium text-[14px]">{name}</div>
              <div
                className={`text-[12px] mt-0.5 ${
                  selected === i ? 'text-white/85' : 'text-listen-inkMute'
                }`}
              >
                {cat} · {followers}
              </div>
            </button>
          );
        })}
      </div>

      {/* Profile */}
      <Card>
        <SectionLabel icon={<Users size={15} />} label={tr('showcaseInterviewProfile')} />
        <div className="flex flex-wrap gap-2 mt-3">
          {interview.participantProfile.fields.map((f, i) => (
            <span
              key={i}
              className="px-3 py-1 text-[12.5px] bg-listen-paperDeep border border-listen-line rounded-full text-listen-inkSoft"
            >
              {f.value}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[13.5px] text-listen-inkMute leading-relaxed italic">
          {interview.participantProfile.rawContext}
        </p>
      </Card>

      {/* Transcript */}
      <Card className="mt-8">
        <SectionLabel icon={<Quote size={15} />} label={tr('showcaseInterviewTranscript')} />
        <div className="mt-4 space-y-4 max-h-[420px] overflow-y-auto pr-2">
          {interview.transcript.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <div className="flex-shrink-0 w-16 text-right">
                <span
                  className={`text-[11px] tracking-wide uppercase font-medium ${
                    msg.role === 'ai' ? 'text-listen-accent' : 'text-listen-inkMute'
                  }`}
                >
                  {msg.role === 'ai' ? tr('showcaseAiTurn') : tr('showcaseUserTurn')}
                </span>
              </div>
              <div className="flex-1 text-[14px] text-listen-ink leading-[1.65]">
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stated / Revealed */}
      <Card className="mt-8">
        <SectionLabel icon={<Lightbulb size={15} />} label={tr('showcaseInterviewSynthesis')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <div className="border-l-2 border-listen-inkMute/40 pl-4">
            <div className="text-[11.5px] tracking-[0.2em] uppercase text-listen-inkMute font-medium mb-3">
              {tr('showcaseStated')}
            </div>
            <ul className="space-y-2.5">
              {synthesis.statedPreferences.map((s, i) => (
                <li key={i} className="text-[14px] text-listen-ink leading-relaxed flex gap-2">
                  <span className="text-listen-inkMute">·</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-l-2 border-listen-accent pl-4">
            <div className="text-[11.5px] tracking-[0.2em] uppercase text-listen-accent font-medium mb-3">
              {tr('showcaseRevealed')}
            </div>
            <ul className="space-y-2.5">
              {synthesis.revealedPreferences.map((s, i) => (
                <li key={i} className="text-[14px] text-listen-ink leading-relaxed flex gap-2">
                  <span className="text-listen-accent">·</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Themes */}
        <div className="mt-8 pt-6 border-t border-listen-line">
          <div className="text-[11.5px] tracking-[0.2em] uppercase text-listen-inkMute font-medium mb-4">
            {tr('showcaseThemes')}
          </div>
          <div className="space-y-3">
            {synthesis.themes.map((t, i) => (
              <div key={i} className="bg-listen-paperDeep/50 border border-listen-line rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium text-[14px] text-listen-ink">{t.theme}</div>
                  <span className="text-[11px] text-listen-inkMute whitespace-nowrap">
                    {tr('showcaseFrequency')} · {t.frequency}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-listen-inkSoft leading-relaxed italic">
                  {t.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contradictions */}
        {synthesis.contradictions.length > 0 && (
          <div className="mt-8 pt-6 border-t border-listen-line">
            <div className="text-[11.5px] tracking-[0.2em] uppercase text-listen-warm font-medium mb-3 flex items-center gap-1.5">
              <AlertTriangle size={12} />
              {tr('showcaseContradictions')}
            </div>
            <ul className="space-y-2">
              {synthesis.contradictions.map((c, i) => (
                <li key={i} className="text-[14px] text-listen-ink leading-relaxed flex gap-2">
                  <span className="text-listen-warm">·</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key insights */}
        <div className="mt-8 pt-6 border-t border-listen-line">
          <div className="text-[11.5px] tracking-[0.2em] uppercase text-listen-accent font-medium mb-3">
            {tr('showcaseKeyInsights')}
          </div>
          <ul className="space-y-2.5">
            {synthesis.keyInsights.map((k, i) => (
              <li key={i} className="text-[14.5px] text-listen-ink leading-relaxed flex gap-2">
                <span className="text-listen-accent">·</span>
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};

// ====== Aggregate tab ======
const AggregateTab: React.FC = () => {
  const { tr } = useLocale();
  const agg = DEMO_AGGREGATE_SYNTHESIS;

  return (
    <div className="mt-8 space-y-8">
      {/* Bottom line first (TL;DR) */}
      <Card accent>
        <div className="text-[11.5px] tracking-[0.2em] uppercase text-listen-accent font-medium mb-3">
          {tr('showcaseBottomLine')}
        </div>
        <p className="font-serif text-[19px] text-listen-ink leading-[1.55]">
          {agg.bottomLine}
        </p>
      </Card>

      {/* Common themes */}
      <Card>
        <SectionLabel icon={<TrendingUp size={15} />} label={tr('showcaseCommonThemes')} />
        <div className="mt-4 space-y-5">
          {agg.commonThemes.map((t, i) => (
            <div key={i}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-medium text-[15px] text-listen-ink">{t.theme}</div>
                <span className="text-[11px] text-listen-inkMute whitespace-nowrap">
                  {tr('showcaseFrequency')} · {t.frequency}/{agg.interviewCount}
                </span>
              </div>
              <ul className="space-y-1.5 mt-2 pl-3 border-l-2 border-listen-line">
                {t.representativeQuotes.map((q, j) => (
                  <li key={j} className="text-[13.5px] text-listen-inkSoft leading-relaxed italic">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Divergent views */}
      {agg.divergentViews.length > 0 && (
        <Card>
          <SectionLabel icon={<AlertTriangle size={15} />} label={tr('showcaseDivergent')} />
          <div className="mt-4 space-y-4">
            {agg.divergentViews.map((d, i) => (
              <div
                key={i}
                className="bg-listen-paperDeep/50 border border-listen-line rounded-lg p-4"
              >
                <div className="text-[13px] font-medium text-listen-ink mb-3">{d.topic}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border-l-2 border-listen-inkMute/40 pl-3">
                    <div className="text-[10.5px] uppercase tracking-wide text-listen-inkMute mb-1">
                      A
                    </div>
                    <p className="text-[13px] text-listen-ink leading-relaxed">{d.viewA}</p>
                  </div>
                  <div className="border-l-2 border-listen-accent pl-3">
                    <div className="text-[10.5px] uppercase tracking-wide text-listen-accent mb-1">
                      B
                    </div>
                    <p className="text-[13px] text-listen-ink leading-relaxed">{d.viewB}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Key findings */}
      <Card>
        <SectionLabel icon={<Lightbulb size={15} />} label={tr('showcaseFindings')} />
        <ul className="mt-3 space-y-3">
          {agg.keyFindings.map((f, i) => (
            <li key={i} className="text-[14.5px] text-listen-ink leading-relaxed flex gap-3">
              <span className="text-listen-accent font-serif text-[14px] pt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1">{f}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Implications */}
      <Card>
        <SectionLabel icon={<Target size={15} />} label={tr('showcaseImplications')} />
        <ul className="mt-3 space-y-2.5">
          {agg.researchImplications.map((r, i) => (
            <li key={i} className="text-[14px] text-listen-inkSoft leading-relaxed flex gap-2">
              <span className="text-listen-accent">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

// ====== Helpers ======
const Card: React.FC<{ children: React.ReactNode; accent?: boolean; className?: string }> = ({
  children,
  accent,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`rounded-2xl border p-6 sm:p-8 ${
      accent
        ? 'bg-listen-paperDeep border-listen-accent/40 shadow-accent'
        : 'bg-white/60 border-listen-line shadow-paper'
    } ${className}`}
  >
    {children}
  </motion.div>
);

const SectionLabel: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-listen-accent">
    {icon}
    <span className="text-[11.5px] tracking-[0.2em] uppercase font-medium">{label}</span>
  </div>
);

// 从 rawContext 文本头抽出名字(以「,」为分隔)
function extractName(raw: string): string {
  const firstChunk = raw.split(/[,，]/)[0];
  return firstChunk.trim();
}

export default Showcase;
