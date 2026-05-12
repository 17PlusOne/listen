'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import OAuthLogin from './OAuthLogin';
import { useLocale } from './LocaleProvider';
import LocaleToggle from './LocaleToggle';

const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tr, locale } = useLocale();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'standalone' | 'hosted' | null>(null);

  useEffect(() => {
    fetch('/api/config/mode')
      .then(res => res.json())
      .then(data => setMode(data.mode))
      .catch(() => setMode('standalone'));
  }, []);

  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      const errorMessages: Record<string, string> = {
        oauth_init_failed: locale === 'zh' ? '登录启动失败，请重试' : 'Failed to start sign-in. Please try again.',
        oauth_failed: locale === 'zh' ? '登录失败，请重试' : 'Sign-in failed. Please try again.',
        missing_params: locale === 'zh' ? '回调参数无效，请重试' : 'Invalid callback. Please try again.',
        invalid_state: locale === 'zh' ? '会话已过期，请重试' : 'Session expired. Please try again.',
        user_fetch_failed: locale === 'zh' ? '无法获取你的资料' : 'Failed to get your profile.',
        no_email: locale === 'zh' ? '无法获取邮箱，请确认邮箱已在 GitHub 验证' : 'Could not get your email.',
      };
      setError(errorMessages[oauthError] || (locale === 'zh' ? '登录失败' : 'Sign-in failed.'));
    }
  }, [searchParams, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (locale === 'zh' ? '密码错误' : 'Authentication failed'));
        return;
      }

      const rawRedirect = searchParams.get('redirect') || '/studies';
      const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
        ? rawRedirect
        : '/studies';
      router.push(redirect);
    } catch {
      setError(locale === 'zh' ? '网络错误，请重试' : 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === null) {
    return (
      <div className="min-h-screen bg-listen-paper flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-listen-inkMute" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-listen-paper paper-texture relative overflow-hidden">
      {/* 顶部极简栏 */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 h-16 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="btn-ghost text-[13px]"
        >
          <ArrowLeft size={14} />
          {tr('loginBack')}
        </button>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-[18px] font-semibold text-listen-ink">{tr('brand')}</span>
          <span className="text-[10px] tracking-[0.22em] uppercase text-listen-inkMute">Listen</span>
        </div>
        <LocaleToggle />
      </div>

      {/* 装饰性大字 */}
      <div className="absolute -bottom-20 -right-20 select-none pointer-events-none opacity-[0.04] text-[320px] font-serif text-listen-ink leading-none hidden lg:block">
        Listen.
      </div>

      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {/* 标题区 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="eyebrow mb-4">{locale === 'zh' ? '研究员入口' : 'Researcher entrance'}</div>
            <h1 className="font-serif text-[40px] sm:text-[48px] leading-tight font-semibold text-listen-ink mb-4 tracking-tight">
              {tr('loginTitle')}
            </h1>
            <p className="text-[15px] text-listen-inkSoft leading-relaxed max-w-sm mx-auto">
              {tr('loginSubtitle')}
            </p>
          </motion.div>

          {/* 卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="paper-card rounded-2xl p-8 sm:p-10"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 p-3.5 mb-5 bg-listen-accentSoft border border-listen-accent/20 rounded-xl text-listen-accentDeep text-[13.5px]"
              >
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {mode === 'hosted' ? (
              <OAuthLogin loading={loading} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block text-[13px] font-medium text-listen-inkSoft mb-2 tracking-wide">
                    {tr('loginPasswordLabel')}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tr('loginPasswordPlaceholder')}
                    className="input-paper"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={!password.trim() || loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {tr('loginLoading')}
                    </>
                  ) : (
                    <>
                      {tr('loginButton')}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* 底部辅助文案 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-[12px] text-listen-inkMute mt-8 leading-relaxed"
          >
            {locale === 'zh'
              ? '密码在你的服务器上验证 · 数据加密保存 · API Key 永不下发'
              : 'Password verified on your server · data encrypted · API keys never leave the backend'}
          </motion.p>
        </div>
      </div>
    </main>
  );
};

export default Login;
