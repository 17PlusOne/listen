'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Database, Key, CheckCircle, XCircle, Loader2,
  AlertCircle, ExternalLink, ArrowLeft, Save, ChevronDown, ChevronUp, Shield
} from 'lucide-react';
import BrandHeader from './BrandHeader';
import { useLocale } from './LocaleProvider';

interface ResearcherProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
  hasRedisConfigured: boolean;
  hasGeminiKey: boolean;
  hasAnthropicKey: boolean;
}

interface ValidationState {
  loading: boolean;
  valid: boolean | null;
  error: string | null;
}

const Settings: React.FC = () => {
  const router = useRouter();
  const { tr } = useLocale();
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [geminiKey, setGeminiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [redisUrl, setRedisUrl] = useState('');
  const [redisToken, setRedisToken] = useState('');

  // Validation state
  const [geminiValidation, setGeminiValidation] = useState<ValidationState>({ loading: false, valid: null, error: null });
  const [anthropicValidation, setAnthropicValidation] = useState<ValidationState>({ loading: false, valid: null, error: null });
  const [redisValidation, setRedisValidation] = useState<ValidationState>({ loading: false, valid: null, error: null });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Expandable guide state
  const [geminiGuideOpen, setGeminiGuideOpen] = useState(false);
  const [claudeGuideOpen, setClaudeGuideOpen] = useState(false);
  const [redisGuideOpen, setRedisGuideOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.profile) setProfile(data.profile);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const validateAiKey = async (provider: 'gemini' | 'claude', apiKey: string) => {
    const setValidation = provider === 'gemini' ? setGeminiValidation : setAnthropicValidation;
    setValidation({ loading: true, valid: null, error: null });

    try {
      const res = await fetch('/api/onboarding/validate-ai-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey }),
      });
      const data = await res.json();
      setValidation({ loading: false, valid: data.valid, error: data.error || null });
    } catch {
      setValidation({ loading: false, valid: false, error: 'Validation failed' });
    }
  };

  const validateRedis = async () => {
    setRedisValidation({ loading: true, valid: null, error: null });
    try {
      const res = await fetch('/api/onboarding/validate-redis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redisUrl, redisToken }),
      });
      const data = await res.json();
      setRedisValidation({ loading: false, valid: data.valid, error: data.error || null });
    } catch {
      setRedisValidation({ loading: false, valid: false, error: 'Validation failed' });
    }
  };

  const hasChanges = !!(geminiKey || anthropicKey || (redisUrl && redisToken));

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const body: Record<string, string | undefined> = {};
      if (geminiKey) body.geminiApiKey = geminiKey;
      if (anthropicKey) body.anthropicApiKey = anthropicKey;
      if (redisUrl && redisToken) {
        body.redisUrl = redisUrl;
        body.redisToken = redisToken;
      }

      if (Object.keys(body).length === 0) {
        setSaving(false);
        return;
      }

      const res = await fetch('/api/onboarding/save-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaveSuccess(true);
        // Refresh profile
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (meData.profile) setProfile(meData.profile);
        // Clear form fields
        setGeminiKey('');
        setAnthropicKey('');
        setRedisUrl('');
        setRedisToken('');
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || 'Failed to save changes. Please try again.');
      }
    } catch {
      setSaveError('Connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Status badge component
  const StatusBadge: React.FC<{ configured: boolean }> = ({ configured }) =>
    configured ? (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-listen-mint/15 text-listen-mint border border-listen-mint/30">
        <CheckCircle size={11} />
        {tr('settingsConfigured')}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-listen-accentSoft text-listen-accentDeep border border-listen-accentDeep/30">
        <XCircle size={11} />
        {tr('settingsNotConfigured')}
      </span>
    );

  const ValidationBadge: React.FC<{ state: ValidationState }> = ({ state }) => {
    if (state.loading) return <Loader2 size={15} className="animate-spin text-listen-inkMute" />;
    if (state.valid === true) return <CheckCircle size={15} className="text-listen-mint" />;
    if (state.valid === false) return <AlertCircle size={15} className="text-listen-accentDeep" />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-listen-paper flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-listen-inkMute" />
      </div>
    );
  }

  return (
    <>
      <BrandHeader minimal />
      <main className="min-h-screen bg-listen-paper pt-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="max-w-2xl mx-auto px-4 sm:px-6"
        >
          {/* Page header */}
          <div className="flex items-start gap-3 mb-8">
            <button
              onClick={() => router.push('/studies')}
              aria-label={tr('settingsBackToStudies')}
              className="mt-1 p-1.5 rounded-lg text-listen-inkMute hover:text-listen-ink hover:bg-listen-paperDeep transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-serif text-3xl text-listen-ink mb-1">{tr('settingsTitle')}</h1>
              <p className="text-listen-inkMute text-sm">
                {profile ? profile.email : tr('settingsSubtitle')}
              </p>
            </div>
          </div>

          <div className="space-y-6">

            {/* Current Status */}
            {profile && (
              <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8">
                <h2 className="font-serif text-lg text-listen-ink mb-4">{tr('settingsCurrentStatus')}</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-listen-inkMute text-xs">Gemini</span>
                    <StatusBadge configured={profile.hasGeminiKey} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-listen-inkMute text-xs">Claude</span>
                    <StatusBadge configured={profile.hasAnthropicKey} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-listen-inkMute text-xs">Redis</span>
                    <StatusBadge configured={profile.hasRedisConfigured} />
                  </div>
                </div>
              </div>
            )}

            {/* AI API Keys */}
            <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Key size={17} className="text-listen-accent" />
                <h2 className="font-serif text-lg text-listen-ink">{tr('settingsApiKeysSection')}</h2>
              </div>
              <p className="text-listen-inkMute text-sm mb-6">{tr('settingsApiKeysDesc')}</p>

              <div className="space-y-6">

                {/* Gemini */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-listen-inkSoft">{tr('settingsGeminiKey')}</label>
                    <ValidationBadge state={geminiValidation} />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => { setGeminiKey(e.target.value); setGeminiValidation({ loading: false, valid: null, error: null }); }}
                      placeholder={profile?.hasGeminiKey ? tr('settingsGeminiPlaceholder') : 'AIza...'}
                      className="flex-1 bg-white border border-listen-line focus:border-listen-accent rounded-xl px-3 py-2.5 text-listen-ink placeholder:text-listen-inkGhost text-sm focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => validateAiKey('gemini', geminiKey)}
                      disabled={!geminiKey || geminiValidation.loading}
                      className="bg-white border border-listen-line text-listen-inkSoft hover:bg-listen-paperDeep rounded-full px-4 py-2 text-sm disabled:opacity-40 transition-colors"
                    >
                      {geminiValidation.loading ? tr('settingsValidating') : tr('settingsValidate')}
                    </button>
                  </div>
                  {geminiValidation.valid === true && (
                    <p className="text-listen-mint text-xs mt-1.5 flex items-center gap-1">
                      <CheckCircle size={12} /> {tr('settingsValidated')}
                    </p>
                  )}
                  {geminiValidation.error && (
                    <p className="text-listen-accentDeep text-xs mt-1.5">{geminiValidation.error}</p>
                  )}

                  {/* Gemini setup guide */}
                  <div className="mt-3">
                    <button
                      onClick={() => setGeminiGuideOpen(!geminiGuideOpen)}
                      className="text-xs text-listen-inkMute hover:text-listen-inkSoft inline-flex items-center gap-1 transition-colors"
                    >
                      {geminiGuideOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {tr('settingsSetupGuide')}
                    </button>
                    {geminiGuideOpen && (
                      <div className="mt-2 p-4 bg-listen-paperDeep border border-listen-line/60 rounded-xl text-xs space-y-2">
                        <ol className="list-decimal list-inside space-y-1 text-listen-inkSoft">
                          <li>
                            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-listen-accent hover:text-listen-accentDeep underline underline-offset-2 inline-flex items-center gap-0.5">
                              aistudio.google.com/apikey <ExternalLink size={10} />
                            </a>
                            {' — '}{tr('settingsGeminiGuide1')}
                          </li>
                          <li>{tr('settingsGeminiGuide2')}</li>
                          <li>{tr('settingsGeminiGuide3')}</li>
                        </ol>
                        <p className="text-listen-inkMute">{tr('settingsGeminiFree')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Claude */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-listen-inkSoft">{tr('settingsAnthropicKey')}</label>
                    <ValidationBadge state={anthropicValidation} />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={anthropicKey}
                      onChange={(e) => { setAnthropicKey(e.target.value); setAnthropicValidation({ loading: false, valid: null, error: null }); }}
                      placeholder={profile?.hasAnthropicKey ? tr('settingsAnthropicPlaceholder') : 'sk-ant-...'}
                      className="flex-1 bg-white border border-listen-line focus:border-listen-accent rounded-xl px-3 py-2.5 text-listen-ink placeholder:text-listen-inkGhost text-sm focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => validateAiKey('claude', anthropicKey)}
                      disabled={!anthropicKey || anthropicValidation.loading}
                      className="bg-white border border-listen-line text-listen-inkSoft hover:bg-listen-paperDeep rounded-full px-4 py-2 text-sm disabled:opacity-40 transition-colors"
                    >
                      {anthropicValidation.loading ? tr('settingsValidating') : tr('settingsValidate')}
                    </button>
                  </div>
                  {anthropicValidation.valid === true && (
                    <p className="text-listen-mint text-xs mt-1.5 flex items-center gap-1">
                      <CheckCircle size={12} /> {tr('settingsValidated')}
                    </p>
                  )}
                  {anthropicValidation.error && (
                    <p className="text-listen-accentDeep text-xs mt-1.5">{anthropicValidation.error}</p>
                  )}

                  {/* Claude setup guide */}
                  <div className="mt-3">
                    <button
                      onClick={() => setClaudeGuideOpen(!claudeGuideOpen)}
                      className="text-xs text-listen-inkMute hover:text-listen-inkSoft inline-flex items-center gap-1 transition-colors"
                    >
                      {claudeGuideOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {tr('settingsSetupGuide')}
                    </button>
                    {claudeGuideOpen && (
                      <div className="mt-2 p-4 bg-listen-paperDeep border border-listen-line/60 rounded-xl text-xs space-y-2">
                        <ol className="list-decimal list-inside space-y-1 text-listen-inkSoft">
                          <li>
                            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-listen-accent hover:text-listen-accentDeep underline underline-offset-2 inline-flex items-center gap-0.5">
                              console.anthropic.com <ExternalLink size={10} />
                            </a>
                          </li>
                          <li>{tr('settingsClaudeGuide2')}</li>
                          <li>{tr('settingsClaudeGuide3')}</li>
                        </ol>
                        <p className="text-listen-inkMute">{tr('settingsClaudeFree')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Redis Storage */}
            <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Database size={17} className="text-listen-mint" />
                <h2 className="font-serif text-lg text-listen-ink">{tr('settingsStorageSection')}</h2>
              </div>
              <p className="text-listen-inkMute text-sm mb-1">{tr('settingsStorageDesc')}</p>
              <p className="text-listen-warm text-xs mb-6">{tr('settingsStorageWarning')}</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-listen-inkSoft mb-1.5 block">{tr('settingsStorageUrl')}</label>
                  <input
                    type="text"
                    value={redisUrl}
                    onChange={(e) => { setRedisUrl(e.target.value); setRedisValidation({ loading: false, valid: null, error: null }); }}
                    placeholder={profile?.hasRedisConfigured ? tr('settingsStorageUrlPlaceholder') : 'https://your-db.upstash.io'}
                    className="w-full bg-white border border-listen-line focus:border-listen-accent rounded-xl px-3 py-2.5 text-listen-ink placeholder:text-listen-inkGhost text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-listen-inkSoft mb-1.5 block">{tr('settingsStorageToken')}</label>
                  <input
                    type="password"
                    value={redisToken}
                    onChange={(e) => { setRedisToken(e.target.value); setRedisValidation({ loading: false, valid: null, error: null }); }}
                    placeholder={profile?.hasRedisConfigured ? tr('settingsStorageTokenPlaceholder') : 'AXxx...'}
                    className="w-full bg-white border border-listen-line focus:border-listen-accent rounded-xl px-3 py-2.5 text-listen-ink placeholder:text-listen-inkGhost text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ValidationBadge state={redisValidation} />
                    {redisValidation.valid && (
                      <span className="text-listen-mint text-sm">{tr('settingsConnected')}</span>
                    )}
                    {redisValidation.error && (
                      <span className="text-listen-accentDeep text-sm">{redisValidation.error}</span>
                    )}
                  </div>
                  <button
                    onClick={validateRedis}
                    disabled={!redisUrl || !redisToken || redisValidation.loading}
                    className="bg-white border border-listen-line text-listen-inkSoft hover:bg-listen-paperDeep rounded-full px-4 py-2 text-sm disabled:opacity-40 transition-colors"
                  >
                    {redisValidation.loading ? tr('settingsTestingConnection') : tr('settingsTestConnection')}
                  </button>
                </div>

                {/* Redis setup guide */}
                <div>
                  <button
                    onClick={() => setRedisGuideOpen(!redisGuideOpen)}
                    className="text-xs text-listen-inkMute hover:text-listen-inkSoft inline-flex items-center gap-1 transition-colors"
                  >
                    {redisGuideOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {tr('settingsSetupGuide')}
                  </button>
                  {redisGuideOpen && (
                    <div className="mt-2 p-4 bg-listen-paperDeep border border-listen-line/60 rounded-xl text-xs space-y-2">
                      <ol className="list-decimal list-inside space-y-1 text-listen-inkSoft">
                        <li>
                          <a href="https://console.upstash.com" target="_blank" rel="noopener noreferrer" className="text-listen-accent hover:text-listen-accentDeep underline underline-offset-2 inline-flex items-center gap-0.5">
                            console.upstash.com <ExternalLink size={10} />
                          </a>
                          {' — '}{tr('settingsRedisGuide1')}
                        </li>
                        <li>{tr('settingsRedisGuide2')}</li>
                        <li>{tr('settingsRedisGuide3')}</li>
                        <li>{tr('settingsRedisGuide4')}</li>
                      </ol>
                      <p className="text-listen-warm">{tr('settingsRedisNote')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="bg-white border border-listen-line/60 rounded-2xl shadow-paper p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={17} className="text-listen-inkMute" />
                <h2 className="font-serif text-lg text-listen-ink">{tr('settingsSecuritySection')}</h2>
              </div>
              <p className="text-listen-inkMute text-sm leading-relaxed">{tr('settingsSecurityBody')}</p>
            </div>

            {/* Partial Redis warning */}
            {((redisUrl && !redisToken) || (!redisUrl && redisToken)) && (
              <div className="flex items-center gap-2 p-4 bg-listen-accentSoft border border-listen-accentDeep/30 rounded-xl text-listen-accentDeep text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                {tr('settingsPartialRedis')}
              </div>
            )}

            {/* Save footer */}
            <div className="flex items-center justify-between pt-2">
              <div>
                {saveSuccess && (
                  <span className="text-listen-mint text-sm flex items-center gap-1.5">
                    <CheckCircle size={14} /> {tr('settingsSaveSuccess')}
                  </span>
                )}
                {saveError && (
                  <span className="text-listen-accentDeep text-sm flex items-center gap-1.5">
                    <AlertCircle size={14} /> {saveError}
                  </span>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="bg-listen-accent hover:bg-listen-accentDeep text-white rounded-full px-5 py-2.5 shadow-accent text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {tr('settingsSaving')}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {tr('settingsSaveChanges')}
                  </>
                )}
              </button>
            </div>

          </div>
        </motion.div>
      </main>
    </>
  );
};

export default Settings;
