'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronRight, Sparkles, Users, Mic, FileText, Quote, ShieldCheck } from 'lucide-react';
import BrandHeader from './BrandHeader';
import { useLocale } from './LocaleProvider';

const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const stagger = (i: number) => ({
  ...FADE_UP,
  transition: { ...FADE_UP.transition, delay: 0.08 * i },
});

const HomeLanding: React.FC = () => {
  const router = useRouter();
  const { tr, locale } = useLocale();

  return (
    <main className="min-h-screen bg-listen-paper text-listen-ink paper-texture">
      <BrandHeader
        actions={
          <button
            onClick={() => router.push('/login')}
            className="hidden sm:inline-flex items-center text-[13px] text-listen-inkSoft hover:text-listen-ink transition-colors"
          >
            {tr('navLogin')} <ChevronRight size={14} className="ml-0.5" />
          </button>
        }
      />

      {/* ============== Hero ============== */}
      <section className="relative pt-28 pb-32 sm:pt-40 sm:pb-44 overflow-hidden">
        {/* 装饰性大字背景 */}
        <div className="absolute -top-10 -left-20 select-none pointer-events-none opacity-[0.05] text-[420px] font-serif text-listen-ink whitespace-nowrap leading-none hidden xl:block">
          Listen.
        </div>

        <div className="max-w-5xl mx-auto px-6 sm:px-10 relative z-10">
          <motion.div {...FADE_UP} className="mb-6">
            <span className="eyebrow">{tr('heroEyebrow')}</span>
          </motion.div>

          <motion.h1
            {...stagger(1)}
            className="font-serif text-[44px] sm:text-[64px] lg:text-[80px] leading-[1.05] font-semibold text-listen-ink tracking-cn-tight max-w-4xl"
          >
            {locale === 'zh' ? (
              <>
                让一个研究员，<br />
                <span className="listen-underline">听见五百个</span>创作者。
              </>
            ) : (
              <>
                One researcher,<br />
                <span className="listen-underline">five hundred</span> conversations.
              </>
            )}
          </motion.h1>

          <motion.p
            {...stagger(2)}
            className="mt-8 text-[17px] sm:text-[19px] leading-cn-relaxed text-listen-inkSoft max-w-2xl"
          >
            {tr('heroSubtitle')}
          </motion.p>

          <motion.div {...stagger(3)} className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="btn-primary text-[15px]"
            >
              {tr('heroCtaPrimary')}
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => router.push('/login?redirect=%2Fstudies')}
              className="btn-secondary text-[15px]"
            >
              {tr('heroCtaSecondary')}
            </button>
          </motion.div>

          {/* 防御性定位横条 */}
          <motion.div
            {...stagger(4)}
            className="mt-16 flex items-start gap-3 max-w-2xl border-l-2 border-listen-accent pl-5 py-1"
          >
            <ShieldCheck size={18} className="text-listen-accent mt-1 flex-shrink-0" />
            <p className="text-[14px] leading-relaxed text-listen-inkSoft">
              {tr('defensiveStatement')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== 价值主张三段 ============== */}
      <section className="border-t border-listen-line/60 bg-white/40">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <span className="eyebrow">{tr('valueEyebrow')}</span>
            <h2 className="font-serif text-[34px] sm:text-[44px] leading-tight font-semibold text-listen-ink mt-4 max-w-3xl">
              {locale === 'zh'
                ? '过去做不到的事情，现在做得到。'
                : 'Three things that used to be impossible.'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {[
              { numeral: '01', icon: Users, titleKey: 'value1Title', bodyKey: 'value1Body' },
              { numeral: '02', icon: Mic, titleKey: 'value2Title', bodyKey: 'value2Body' },
              { numeral: '03', icon: FileText, titleKey: 'value3Title', bodyKey: 'value3Body' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.numeral}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="serif-numeral text-[56px] leading-none mb-4">{item.numeral}</div>
                  <Icon size={22} className="text-listen-accent mb-4" strokeWidth={1.5} />
                  <h3 className="font-serif text-[22px] font-semibold text-listen-ink mb-3 tracking-tight">
                    {tr(item.titleKey as any)}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-listen-inkSoft">
                    {tr(item.bodyKey as any)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== 三大模板 ============== */}
      <section className="border-t border-listen-line/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-14 max-w-2xl"
          >
            <span className="eyebrow">{tr('templatesEyebrow')}</span>
            <h2 className="font-serif text-[34px] sm:text-[44px] leading-tight font-semibold text-listen-ink mt-4">
              {tr('templatesTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { templateId: 'brand-deal-decision', titleKey: 'template1Title', descKey: 'template1Desc', tag: locale === 'zh' ? '商业化' : 'Monetization' },
              { templateId: 'creator-dropoff', titleKey: 'template2Title', descKey: 'template2Desc', tag: locale === 'zh' ? '留存' : 'Retention' },
              { templateId: 'new-creator-onboarding', titleKey: 'template3Title', descKey: 'template3Desc', tag: locale === 'zh' ? '新人' : 'Onboarding' },
            ].map((t, i) => (
              <motion.button
                key={i}
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(`/setup?template=${t.templateId}`)}`)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                className="paper-card rounded-2xl p-7 text-left group flex flex-col"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles size={14} className="text-listen-accent" />
                  <span className="text-[11px] tracking-[0.18em] uppercase text-listen-inkMute">
                    {t.tag}
                  </span>
                </div>
                <h3 className="font-serif text-[22px] font-semibold text-listen-ink mb-3 leading-tight tracking-tight">
                  {tr(t.titleKey as any)}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-listen-inkSoft flex-1">
                  {tr(t.descKey as any)}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-[13px] text-listen-accent font-medium group-hover:gap-2.5 transition-all">
                  {tr('templateCta')}
                  <ArrowRight size={14} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ============== 引文 / 一句话 ============== */}
      <section className="bg-listen-paperDeep border-t border-listen-line/60">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-24 sm:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
          >
            <Quote size={28} className="mx-auto text-listen-accent mb-8" strokeWidth={1.2} />
            <p className="pull-quote text-[24px] sm:text-[34px] leading-[1.5]">
              {locale === 'zh'
                ? 'Dashboard 让我们高效，但也让我们听不见个体。听见，就是为了把那些被数据掩盖的真实声音，重新找回来。'
                : 'Dashboards make us efficient — and deaf to the individual. Listen exists to bring back the voices the data buried.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== 信效度声明 ============== */}
      <section className="border-t border-listen-line/60 bg-white/60">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <span className="eyebrow">{tr('rigorEyebrow')}</span>
            <h2 className="font-serif text-[32px] sm:text-[42px] leading-tight font-semibold text-listen-ink mt-4">
              {tr('rigorTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl border-2 border-listen-mint/40 bg-listen-mint/[0.06] p-8"
            >
              <div className="flex items-center gap-2 mb-4 text-listen-mint">
                <ShieldCheck size={18} strokeWidth={2} />
                <span className="text-[12px] tracking-[0.2em] uppercase font-medium">
                  {tr('rigorDo')}
                </span>
              </div>
              <p className="text-[16px] leading-relaxed text-listen-ink">
                {tr('rigorDoBody')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-2xl border-2 border-listen-line bg-listen-paperDeep/60 p-8"
            >
              <div className="flex items-center gap-2 mb-4 text-listen-inkMute">
                <span className="text-[12px] tracking-[0.2em] uppercase font-medium">
                  {tr('rigorDont')}
                </span>
              </div>
              <p className="text-[16px] leading-relaxed text-listen-inkSoft">
                {tr('rigorDontBody')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== 最终 CTA ============== */}
      <section className="border-t border-listen-line/60 bg-listen-ink text-listen-paper">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-24 sm:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-[36px] sm:text-[52px] leading-tight font-semibold mb-6 tracking-cn-tight">
              {locale === 'zh' ? '现在就开始一份研究。' : 'Start your first study now.'}
            </h2>
            <p className="text-[16px] text-listen-paper/70 mb-10 max-w-xl mx-auto leading-relaxed">
              {locale === 'zh'
                ? '5 分钟配置一份研究，48 小时拿到 100 份深度访谈，所有数据加密保存在你自己的服务器。'
                : 'Configure a study in 5 minutes. Collect 100 deep interviews in 48 hours. All data encrypted on your own server.'}
            </p>
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-listen-paper text-listen-ink rounded-full font-medium hover:bg-white transition-all hover:shadow-[0_10px_30px_rgba(250,247,242,0.2)] hover:-translate-y-0.5"
            >
              {tr('heroCtaPrimary')}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ============== Footer ============== */}
      <footer className="border-t border-listen-ink/20 bg-listen-ink text-listen-paper/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-[13px]">
          <span>{tr('footerCopyright')}</span>
          <span className="opacity-80 max-w-md">{tr('footerNote')}</span>
        </div>
      </footer>
    </main>
  );
};

export default HomeLanding;
