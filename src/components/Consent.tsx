'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { useLocale } from './LocaleProvider';
import BrandHeader from './BrandHeader';
import { ArrowRight, ArrowLeft, Clock, ShieldCheck, MessageCircle } from 'lucide-react';

const Consent: React.FC = () => {
  const router = useRouter();
  const { tr } = useLocale();
  const { studyConfig, giveConsent, setStep, viewMode, initializeProfile } = useStore();

  const handleConsent = () => {
    giveConsent();
    if (studyConfig?.profileSchema) {
      initializeProfile(studyConfig.profileSchema);
    }
    setStep('interview');
    router.push('/interview');
  };

  const handleBack = () => {
    setStep('setup');
    router.push('/setup');
  };

  if (!studyConfig) {
    return (
      <div className="min-h-screen bg-listen-paper flex items-center justify-center">
        <p className="text-listen-inkMute font-serif text-lg">{tr('consentMissingStudy')}</p>
      </div>
    );
  }

  const steps = [
    { title: tr('consentStep1Title'), desc: tr('consentStep1Desc') },
    {
      title: tr('consentStep2Title').replace('{count}', String(studyConfig.coreQuestions.length)),
      desc: tr('consentStep2Desc'),
    },
    { title: tr('consentStep3Title'), desc: tr('consentStep3Desc') },
    { title: tr('consentStep4Title'), desc: tr('consentStep4Desc') },
  ];

  return (
    <div className="min-h-screen bg-listen-paper">
      <BrandHeader minimal />

      <main className="max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow mb-4">{tr('consentEyebrow')}</div>
          <h1 className="font-serif text-[42px] sm:text-[56px] leading-[1.05] tracking-tight text-listen-ink mb-2">
            {tr('consentTitle')}
          </h1>
          <p className="text-[15px] text-listen-inkMute mb-10">
            {studyConfig.name}
          </p>

          {/* Intro */}
          <div className="space-y-5 text-[17px] leading-[1.8] text-listen-inkSoft mb-12">
            <p>{tr('consentIntroOne')}</p>
            <p>{tr('consentIntroTwo')}</p>
          </div>

          {/* 研究员自定义同意文案 (如有) */}
          {studyConfig.consentText && studyConfig.consentText.trim().length > 0 && (
            <div className="paper-card p-6 mb-10">
              <div className="text-[12px] tracking-[0.18em] uppercase text-listen-inkMute mb-3">
                {tr('consentPrivacyTitle')}
              </div>
              <p className="text-[15px] text-listen-inkSoft leading-[1.85] whitespace-pre-wrap">
                {studyConfig.consentText}
              </p>
            </div>
          )}

          {/* Structure */}
          <div className="paper-card p-7 sm:p-9 mb-10">
            <div className="flex items-center gap-3 mb-7">
              <MessageCircle size={20} className="text-listen-accent" />
              <h3 className="font-serif text-[22px] text-listen-ink">{tr('consentStructureTitle')}</h3>
            </div>

            <ol className="space-y-6">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-5">
                  <div className="font-serif text-[28px] leading-none italic font-light text-listen-accent/70 w-9 flex-shrink-0 mt-1">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="font-serif text-[18px] text-listen-ink mb-1">{s.title}</div>
                    <div className="text-[14px] text-listen-inkMute leading-relaxed">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex items-center gap-2 mt-8 pt-6 border-t border-listen-lineSoft text-[13px] text-listen-inkMute">
              <Clock size={14} />
              <span>{tr('consentEstimate')}</span>
            </div>
          </div>

          {/* Privacy */}
          <div className="flex items-start gap-4 mb-12 p-5 rounded-2xl bg-listen-paperDeep/60 border border-listen-lineSoft">
            <ShieldCheck size={20} className="text-listen-mint flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-listen-ink mb-1">{tr('consentPrivacyTitle')}</div>
              <p className="text-[14px] text-listen-inkSoft leading-relaxed">{tr('consentPrivacyBody')}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {viewMode !== 'participant' && (
              <button
                onClick={handleBack}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                {tr('back')}
              </button>
            )}
            <button onClick={handleConsent} className="btn-primary flex-1 inline-flex items-center justify-center gap-2 text-[16px] py-4">
              {tr('consentBeginCta')}
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Consent;
