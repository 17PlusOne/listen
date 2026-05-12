'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { generateParticipantLink } from '@/services/geminiService';
import { StudyConfig, ProfileField, AIBehavior, AIProviderType, LinkExpirationOption, GEMINI_MODELS, CLAUDE_MODELS, DEFAULT_GEMINI_MODEL, DEFAULT_CLAUDE_MODEL } from '@/types';
import { getTemplateById, templateToPrefill } from '@/lib/templates';
import { useLocale } from './LocaleProvider';
import BrandHeader from './BrandHeader';
import {
  FileText,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
  Lightbulb,
  User,
  ToggleLeft,
  ToggleRight,
  Link as LinkIcon,
  Copy,
  Check,
  Loader2,
  LogIn,
  Save,
  CheckCircle,
  GitBranch,
  Clock,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

// Profile field preset ids — labels/hints 走 i18n。
const PROFILE_PRESET_IDS: { id: string; required: boolean }[] = [
  { id: 'role', required: true },
  { id: 'industry', required: false },
  { id: 'experience', required: false },
  { id: 'team_size', required: false },
  { id: 'location', required: false },
];

const StudySetup: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tr } = useLocale();
  const { setStudyConfig, setStep, studyConfig, loadExampleStudy, setViewMode, setIsPreview, setParticipantToken } = useStore();

  // Follow-up study state
  const [parentStudyInfo, setParentStudyInfo] = useState<{ id: string; name: string } | null>(null);

  const [name, setName] = useState(studyConfig?.name || '');
  const [description, setDescription] = useState(studyConfig?.description || '');
  const [researchQuestion, setResearchQuestion] = useState(studyConfig?.researchQuestion || '');
  const [coreQuestions, setCoreQuestions] = useState<string[]>(
    studyConfig?.coreQuestions || ['']
  );
  const [topicAreas, setTopicAreas] = useState<string[]>(
    studyConfig?.topicAreas || ['']
  );
  const [profileSchema, setProfileSchema] = useState<ProfileField[]>(
    studyConfig?.profileSchema || []
  );
  const [aiBehavior, setAiBehavior] = useState<AIBehavior>(
    studyConfig?.aiBehavior || 'standard'
  );
  const [aiProvider, setAiProvider] = useState<AIProviderType>(
    studyConfig?.aiProvider || 'gemini'
  );
  const [aiModel, setAiModel] = useState<string>(
    studyConfig?.aiModel || (studyConfig?.aiProvider === 'claude' ? DEFAULT_CLAUDE_MODEL : DEFAULT_GEMINI_MODEL)
  );
  const [enableReasoning, setEnableReasoning] = useState<boolean | undefined>(
    studyConfig?.enableReasoning
  );
  const [linkExpiration, setLinkExpiration] = useState<LinkExpirationOption>(
    studyConfig?.linkExpiration || 'never'
  );
  const [consentText, setConsentText] = useState(
    studyConfig?.consentText || ''
  );

  // Participant link generation
  const [participantLink, setParticipantLink] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Preview state
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Study save state
  const [savedStudyId, setSavedStudyId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Config status (API keys)
  const [configStatus, setConfigStatus] = useState<{
    hasAnthropicKey: boolean;
    hasGeminiKey: boolean;
  } | null>(null);

  // Sync savedStudyId with persisted config
  // Server-assigned IDs are UUIDs, client-side IDs start with "study-"
  useEffect(() => {
    if (studyConfig?.id && !studyConfig.id.startsWith('study-')) {
      // Server UUID - this is a saved study
      setSavedStudyId(studyConfig.id);
    } else {
      // No config or client-generated ID - clear to prevent overwriting other studies
      setSavedStudyId(null);
    }
  }, [studyConfig?.id]);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth', { method: 'GET' });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch config status when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchConfigStatus = async () => {
        try {
          const res = await fetch('/api/config/status');
          if (res.ok) {
            const data = await res.json();
            setConfigStatus(data);
          }
        } catch {
          // Silently fail - warnings just won't show
        }
      };
      fetchConfigStatus();
    }
  }, [isAuthenticated]);

  // Check for follow-up / edit / template prefill on mount
  useEffect(() => {
    // 模板注入:从首页或登录跳转过来的 ?template=<id>
    const templateId = searchParams.get('template');
    if (templateId) {
      const tpl = getTemplateById(templateId);
      if (tpl) {
        const config = templateToPrefill(tpl);
        if (config.name) setName(config.name);
        if (config.description) setDescription(config.description);
        if (config.researchQuestion) setResearchQuestion(config.researchQuestion);
        if (config.coreQuestions?.length) setCoreQuestions(config.coreQuestions);
        if (config.topicAreas?.length) setTopicAreas(config.topicAreas);
        if (config.profileSchema?.length) setProfileSchema(config.profileSchema);
        if (config.aiBehavior) setAiBehavior(config.aiBehavior);
        if (config.aiProvider) setAiProvider(config.aiProvider);
        if (config.enableReasoning !== undefined) setEnableReasoning(config.enableReasoning);
        if (config.consentText) setConsentText(config.consentText);
        setIsDirty(true);
        return;
      }
    }

    const prefillType = searchParams.get('prefill');
    if (prefillType === 'followup' || prefillType === 'edit') {
      const prefillData = sessionStorage.getItem('prefillStudyConfig');
      if (prefillData) {
        try {
          const config = JSON.parse(prefillData) as Partial<StudyConfig>;
          // Populate form fields
          if (config.name) setName(config.name);
          if (config.description) setDescription(config.description);
          if (config.researchQuestion) setResearchQuestion(config.researchQuestion);
          if (config.coreQuestions?.length) setCoreQuestions(config.coreQuestions);
          if (config.topicAreas?.length) setTopicAreas(config.topicAreas);
          if (config.profileSchema?.length) setProfileSchema(config.profileSchema);
          if (config.aiBehavior) setAiBehavior(config.aiBehavior);
          if (config.aiProvider) setAiProvider(config.aiProvider);
          if (config.aiModel) setAiModel(config.aiModel);
          if (config.enableReasoning !== undefined) setEnableReasoning(config.enableReasoning);
          if (config.linkExpiration) setLinkExpiration(config.linkExpiration);
          if (config.consentText) setConsentText(config.consentText);

          // Store parent study info for display and saving (followup only)
          if (prefillType === 'followup' && config.parentStudyId && config.parentStudyName) {
            setParentStudyInfo({
              id: config.parentStudyId,
              name: config.parentStudyName
            });
          }

          // For edit mode, set the study ID so saves become updates
          if (prefillType === 'edit') {
            const studyId = searchParams.get('studyId');
            if (studyId) {
              setSavedStudyId(studyId);
              setIsDirty(false); // Not dirty initially - matches saved state
            }
          } else {
            // Mark as dirty since we loaded prefill data that needs saving
            setIsDirty(true);
          }

          // Clear sessionStorage after loading
          sessionStorage.removeItem('prefillStudyConfig');
        } catch (error) {
          console.error('Error parsing prefill config:', error);
        }
      }
    }
  }, [searchParams]);

  // Sync form with studyConfig when it changes (e.g., after loading example)
  useEffect(() => {
    if (studyConfig) {
      setName(studyConfig.name);
      setDescription(studyConfig.description);
      setResearchQuestion(studyConfig.researchQuestion);
      setCoreQuestions(studyConfig.coreQuestions.length > 0 ? studyConfig.coreQuestions : ['']);
      setTopicAreas(studyConfig.topicAreas.length > 0 ? studyConfig.topicAreas : ['']);
      setProfileSchema(studyConfig.profileSchema || []);
      setAiBehavior(studyConfig.aiBehavior);
      setAiProvider(studyConfig.aiProvider || 'gemini');
      setAiModel(studyConfig.aiModel || (studyConfig.aiProvider === 'claude' ? DEFAULT_CLAUDE_MODEL : DEFAULT_GEMINI_MODEL));
      setEnableReasoning(studyConfig.enableReasoning);
      setLinkExpiration(studyConfig.linkExpiration || 'never');
      setConsentText(studyConfig.consentText);
    }
  }, [studyConfig]);

  // Question management
  const addQuestion = () => { setCoreQuestions([...coreQuestions, '']); setIsDirty(true); };
  const removeQuestion = (index: number) => {
    if (coreQuestions.length > 1) {
      setCoreQuestions(coreQuestions.filter((_, i) => i !== index));
      setIsDirty(true);
    }
  };
  const updateQuestion = (index: number, value: string) => {
    const updated = [...coreQuestions];
    updated[index] = value;
    setCoreQuestions(updated);
    setIsDirty(true);
  };

  // Topic management
  const addTopic = () => { setTopicAreas([...topicAreas, '']); setIsDirty(true); };
  const removeTopic = (index: number) => {
    if (topicAreas.length > 1) {
      setTopicAreas(topicAreas.filter((_, i) => i !== index));
      setIsDirty(true);
    }
  };
  const updateTopic = (index: number, value: string) => {
    const updated = [...topicAreas];
    updated[index] = value;
    setTopicAreas(updated);
    setIsDirty(true);
  };

  // Profile field management
  const addProfileField = (preset?: ProfileField) => {
    if (preset) {
      if (!profileSchema.some(f => f.id === preset.id)) {
        setProfileSchema([...profileSchema, preset]);
        setIsDirty(true);
      }
    } else {
      const newField: ProfileField = {
        id: `field-${Date.now()}`,
        label: '',
        extractionHint: '',
        required: false
      };
      setProfileSchema([...profileSchema, newField]);
      setIsDirty(true);
    }
  };

  const removeProfileField = (id: string) => {
    setProfileSchema(profileSchema.filter(f => f.id !== id));
    setIsDirty(true);
  };

  const updateProfileField = (id: string, updates: Partial<ProfileField>) => {
    setProfileSchema(profileSchema.map(f =>
      f.id === id ? { ...f, ...updates } : f
    ));
    setIsDirty(true);
  };

  const toggleFieldRequired = (id: string) => {
    setProfileSchema(profileSchema.map(f =>
      f.id === id ? { ...f, required: !f.required } : f
    ));
    setIsDirty(true);
  };

  const buildConfig = (): StudyConfig => ({
    id: studyConfig?.id || `study-${Date.now()}`,
    name: name || tr('studyUntitled'),
    description,
    researchQuestion,
    coreQuestions: coreQuestions.filter(q => q.trim()),
    topicAreas: topicAreas.filter(t => t.trim()),
    profileSchema: profileSchema.filter(f => f.label.trim()),
    aiBehavior,
    aiProvider,
    aiModel,
    enableReasoning,
    linkExpiration,
    linksEnabled: true, // Always true when creating/editing (revocation is in StudyDetail)
    consentText: consentText.trim() || tr('defaultConsentText'),
    createdAt: studyConfig?.createdAt || Date.now(),
    // Include parent study info if this is a follow-up
    ...(parentStudyInfo && {
      parentStudyId: parentStudyInfo.id,
      parentStudyName: parentStudyInfo.name,
      generatedFrom: 'synthesis' as const
    })
  });

  const handleSubmit = () => {
    const config = buildConfig();
    setStudyConfig(config);
    setStep('consent');
    router.push('/consent');
  };

  const handlePreview = async () => {
    setIsPreviewLoading(true);
    const config = buildConfig();
    setStudyConfig(config);

    // Generate a temporary preview token for API authentication
    try {
      const { token } = await generateParticipantLink(config);
      setParticipantToken(token);
    } catch (error) {
      // If token generation fails (e.g., not logged in), proceed anyway
      // The admin session cookie will be used as fallback for authenticated researchers
      console.warn('Could not generate preview token, using session auth:', error);
    }

    setIsPreviewLoading(false);
    setIsPreview(true);
    setViewMode('participant');
    setStep('consent');
    router.push('/consent');
  };

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    setLinkError(null);
    try {
      const config = buildConfig();
      setStudyConfig(config);

      const response = await fetch('/api/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studyConfig: config })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLinkError('auth');
          setIsAuthenticated(false);
        } else {
          const data = await response.json();
          setLinkError(data.error || tr('errFailedGenLink'));
        }
        return;
      }

      const data = await response.json();
      setParticipantLink(data.url);
    } catch (error) {
      console.error('Error generating link:', error);
      setLinkError(tr('errNetworkRetry'));
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    if (participantLink) {
      navigator.clipboard.writeText(participantLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleSaveStudy = async () => {
    // Fix auth race condition: check for explicit false, not falsy
    if (isAuthenticated === false) {
      router.push('/login');
      return;
    }
    if (isAuthenticated === null) {
      return; // Auth check in progress - button should be disabled anyway
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const config = buildConfig();
      const isUpdate = !!savedStudyId;

      // For updates, the API may return 409 if study has interviews
      const response = await fetch(
        isUpdate ? `/api/studies/${savedStudyId}` : '/api/studies',
        {
          method: isUpdate ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config })
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          router.push('/login');
          return;
        }

        // Handle storage not configured (503)
        if (response.status === 503) {
          setSaveError(tr('errStorageNotConfigured'));
          return;
        }

        // Handle confirmation required (409) - study has interviews
        if (response.status === 409) {
          const data = await response.json();
          if (data.requiresConfirmation) {
            const confirmed = window.confirm(
              `${data.warning}\n\nDo you want to continue?`
            );
            if (confirmed) {
              // Retry with confirmed: true
              const retryResponse = await fetch(`/api/studies/${savedStudyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config, confirmed: true })
              });
              if (retryResponse.ok) {
                const retryData = await retryResponse.json();
                setSavedStudyId(retryData.study.id);
                setStudyConfig(retryData.study.config);
                setSaveSuccess(true);
                setIsDirty(false);
                // Navigate to study detail page after confirmed save
                router.push(`/studies/${retryData.study.id}`);
              }
            }
            return;
          }
        }

        // Generic error
        const data = await response.json().catch(() => ({}));
        setSaveError(data.error || tr('errFailedSaveStudy'));
        return;
      }

      const data = await response.json();
      setSavedStudyId(data.study.id);
      setSaveSuccess(true);
      setStudyConfig(data.study.config);
      setIsDirty(false);

      // Navigate to study detail page after successful save
      router.push(`/studies/${data.study.id}`);
    } catch (error) {
      console.error('Error saving study:', error);
      setSaveError(tr('errNetworkRetry'));
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = name.trim() && researchQuestion.trim();

  const behaviorOptions: { id: AIBehavior; label: string; desc: string }[] = [
    { id: 'structured', label: tr('styleStructuredLabel'), desc: tr('styleStructuredDesc') },
    { id: 'standard', label: tr('styleStandardLabel'), desc: tr('styleStandardDesc') },
    { id: 'exploratory', label: tr('styleExploratoryLabel'), desc: tr('styleExploratoryDesc') },
  ];

  const providerOptions: { id: AIProviderType; label: string; desc: string }[] = [
    { id: 'gemini', label: tr('providerGemini'), desc: tr('providerGeminiDesc') },
    { id: 'claude', label: tr('providerClaude'), desc: tr('providerClaudeDesc') },
  ];

  // 基于当前 locale 动态生成预设字段
  const profilePresets = useMemo<ProfileField[]>(() => {
    const map: Record<string, { labelKey: 'presetRoleLabel' | 'presetIndustryLabel' | 'presetExperienceLabel' | 'presetTeamSizeLabel' | 'presetLocationLabel'; hintKey: 'presetRoleHint' | 'presetIndustryHint' | 'presetExperienceHint' | 'presetTeamSizeHint' | 'presetLocationHint' }> = {
      role: { labelKey: 'presetRoleLabel', hintKey: 'presetRoleHint' },
      industry: { labelKey: 'presetIndustryLabel', hintKey: 'presetIndustryHint' },
      experience: { labelKey: 'presetExperienceLabel', hintKey: 'presetExperienceHint' },
      team_size: { labelKey: 'presetTeamSizeLabel', hintKey: 'presetTeamSizeHint' },
      location: { labelKey: 'presetLocationLabel', hintKey: 'presetLocationHint' },
    };
    return PROFILE_PRESET_IDS.map((p) => ({
      id: p.id,
      label: tr(map[p.id].labelKey),
      extractionHint: tr(map[p.id].hintKey),
      required: p.required,
    }));
  }, [tr]);

  const availablePresets = profilePresets.filter(
    (preset) => !profileSchema.some((f) => f.id === preset.id)
  );

  return (
    <main className="min-h-screen bg-listen-paper">
      <BrandHeader minimal />
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => router.push('/studies')}
              className="p-2 text-listen-inkMute hover:text-listen-ink rounded-lg hover:bg-white transition-colors"
              title={tr('backToStudies')}
              aria-label={tr('backToStudies')}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-listen-paperDeep border border-listen-line/60 flex items-center justify-center">
              <FileText className="text-listen-inkSoft" size={20} />
            </div>
            <h1 className="font-serif text-3xl text-listen-ink tracking-tight">{tr('studySetupTitle')}</h1>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={loadExampleStudy}
                className="px-4 py-2 text-sm bg-white border border-listen-line hover:bg-listen-paperDeep text-listen-inkSoft rounded-full transition-colors flex items-center gap-2"
              >
                <Lightbulb size={16} className="text-listen-gold" />
                {tr('loadExample')}
              </button>
              {isValid && (
                <>
                  <button
                    onClick={handleSaveStudy}
                    disabled={!isAuthenticated || isSaving || (!!savedStudyId && !isDirty)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors flex items-center gap-2 disabled:cursor-not-allowed ${
                      savedStudyId && !isDirty
                        ? 'bg-listen-mint/15 text-listen-mint border border-listen-mint/30'
                        : saveSuccess
                        ? 'bg-listen-mint text-white'
                        : 'bg-listen-accent hover:bg-listen-accentDeep text-white shadow-accent'
                    } ${isSaving || isAuthenticated === null ? 'opacity-50' : ''}`}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : savedStudyId && !isDirty ? (
                      <CheckCircle size={16} />
                    ) : saveSuccess ? (
                      <Check size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    {isSaving ? tr('saving') : savedStudyId && isDirty ? tr('updateStudy') : savedStudyId ? tr('saved') : saveSuccess ? tr('savedBang') : tr('saveStudy')}
                  </button>
                  <button
                    onClick={handlePreview}
                    disabled={isPreviewLoading}
                    className="px-4 py-2 text-sm bg-white border border-listen-line hover:bg-listen-paperDeep text-listen-inkSoft rounded-full transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPreviewLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Eye size={16} className="text-listen-accent" />
                    )}
                    {isPreviewLoading ? tr('loading') : tr('preview')}
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="text-listen-inkMute ml-[52px] text-[15px]">
            {tr('studySetupSubtitle')}
          </p>
        </motion.div>

        {/* Save Error Banner */}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-listen-accentSoft border border-listen-accentDeep/30 rounded-2xl p-4 flex items-start gap-3 mb-4"
          >
            <AlertTriangle size={20} className="text-listen-accentDeep flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-listen-accentDeep mb-1">{tr('saveFailed')}</h4>
              <p className="text-sm text-listen-inkSoft">{saveError}</p>
            </div>
            <button
              onClick={() => setSaveError(null)}
              className="text-listen-accentDeep hover:text-listen-ink flex-shrink-0"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-listen-line/60 shadow-paper p-6 sm:p-8 space-y-10"
        >
          {/* Follow-up Study Banner */}
          {parentStudyInfo && (
            <div className="bg-listen-paperDeep border border-listen-line/60 rounded-xl p-4 flex items-start gap-3">
              <GitBranch size={20} className="text-listen-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-listen-ink">{tr('followUpStudy')}</h4>
                <p className="text-sm text-listen-inkSoft">
                  {tr('basedOnFindingsFrom')}{' '}
                  <button
                    onClick={() => router.push(`/studies/${parentStudyInfo.id}`)}
                    className="text-listen-accent hover:text-listen-accentDeep underline underline-offset-2"
                  >
                    {parentStudyInfo.name}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-listen-ink flex items-center gap-2">
              <Sparkles size={18} className="text-listen-gold" />
              {tr('studyDetails')}
            </h2>

            <div>
              <label className="block text-sm font-medium text-listen-inkSoft mb-1.5">
                {tr('studyNameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setIsDirty(true); }}
                placeholder={tr('studyNamePlaceholder')}
                className="w-full px-4 py-3 rounded-xl bg-white border border-listen-line text-listen-ink placeholder-listen-inkGhost focus:outline-none focus:ring-2 focus:ring-listen-accent focus:border-listen-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-listen-inkSoft mb-1.5">
                {tr('researchQuestionLabel')}
              </label>
              <textarea
                value={researchQuestion}
                onChange={(e) => { setResearchQuestion(e.target.value); setIsDirty(true); }}
                placeholder={tr('researchQuestionPlaceholder')}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white border border-listen-line text-listen-ink placeholder-listen-inkGhost focus:outline-none focus:ring-2 focus:ring-listen-accent focus:border-listen-accent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-listen-inkSoft mb-1.5">
                {tr('descriptionLabel')}
              </label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                placeholder={tr('descriptionPlaceholder')}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white border border-listen-line text-listen-ink placeholder-listen-inkGhost focus:outline-none focus:ring-2 focus:ring-listen-accent focus:border-listen-accent resize-none"
              />
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-listen-ink flex items-center gap-2">
                <User size={18} className="text-listen-accent" />
                {tr('profileFields')}
              </h2>
              <button
                onClick={() => addProfileField()}
                className="text-sm text-listen-inkMute hover:text-listen-ink flex items-center gap-1"
              >
                <Plus size={16} /> {tr('addCustom')}
              </button>
            </div>
            <p className="text-sm text-listen-inkMute">
              {tr('profileFieldsDesc')}
            </p>

            {availablePresets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-listen-inkMute">{tr('quickAdd')}</span>
                {availablePresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => addProfileField(preset)}
                    className="px-3 py-1 text-xs bg-white border border-listen-line hover:border-listen-accent hover:text-listen-accent text-listen-inkSoft rounded-full transition-colors"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {profileSchema.map((field) => (
                <div
                  key={field.id}
                  className="bg-listen-paper rounded-xl p-4 border border-listen-line/60"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateProfileField(field.id, { label: e.target.value })}
                        placeholder={tr('fieldLabelPlaceholder')}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-listen-line text-listen-ink placeholder-listen-inkGhost focus:outline-none focus:ring-1 focus:ring-listen-accent text-sm"
                      />
                      <input
                        type="text"
                        value={field.extractionHint}
                        onChange={(e) => updateProfileField(field.id, { extractionHint: e.target.value })}
                        placeholder={tr('fieldHintPlaceholder')}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-listen-line text-listen-ink placeholder-listen-inkGhost focus:outline-none focus:ring-1 focus:ring-listen-accent text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFieldRequired(field.id)}
                        className={`px-2.5 py-1 text-xs rounded-full flex items-center gap-1 transition-colors ${
                          field.required
                            ? 'bg-listen-accentSoft text-listen-accentDeep border border-listen-accentDeep/30'
                            : 'bg-white text-listen-inkMute border border-listen-line'
                        }`}
                        title={field.required ? tr('fieldRequired') : tr('fieldOptional')}
                      >
                        {field.required ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {field.required ? tr('reqBadge') : tr('optBadge')}
                      </button>
                      <button
                        onClick={() => removeProfileField(field.id)}
                        className="p-1.5 text-listen-inkMute hover:text-listen-accentDeep"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {profileSchema.length === 0 && (
                <div className="text-center py-6 text-listen-inkMute text-sm bg-listen-paper rounded-xl border border-dashed border-listen-line">
                  {tr('noProfileFieldsYet')}
                </div>
              )}
            </div>
          </div>

          {/* Core Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-listen-ink">
                {tr('coreQuestions')}
              </h2>
              <button
                onClick={addQuestion}
                className="text-sm text-listen-inkMute hover:text-listen-ink flex items-center gap-1"
              >
                <Plus size={16} /> {tr('addQuestion')}
              </button>
            </div>
            <p className="text-sm text-listen-inkMute">
              {tr('coreQuestionsDesc')}
            </p>
            <div className="space-y-2">
              {coreQuestions.map((q, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-listen-inkMute text-sm pt-3 w-6 text-right font-mono">{i + 1}.</span>
                  <textarea
                    value={q}
                    onChange={(e) => updateQuestion(i, e.target.value)}
                    placeholder={`${tr('questionPlaceholder')} ${i + 1}...`}
                    rows={2}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-listen-line text-listen-ink placeholder-listen-inkGhost focus:outline-none focus:ring-2 focus:ring-listen-accent focus:border-listen-accent resize-none"
                  />
                  {coreQuestions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(i)}
                      className="p-2.5 text-listen-inkMute hover:text-listen-accentDeep mt-1"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Topic Areas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-listen-ink">
                {tr('topicAreas')}
              </h2>
              <button
                onClick={addTopic}
                className="text-sm text-listen-inkMute hover:text-listen-ink flex items-center gap-1"
              >
                <Plus size={16} /> {tr('addTopic')}
              </button>
            </div>
            <p className="text-sm text-listen-inkMute">
              {tr('topicAreasDesc')}
            </p>
            <div className="space-y-2">
              {topicAreas.map((t, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-listen-inkMute text-sm pt-3 w-6 text-right font-mono">{i + 1}.</span>
                  <textarea
                    value={t}
                    onChange={(e) => updateTopic(i, e.target.value)}
                    placeholder={`${tr('topicPlaceholder')} ${i + 1}...`}
                    rows={2}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-listen-line text-listen-ink placeholder-listen-inkGhost focus:outline-none focus:ring-2 focus:ring-listen-accent focus:border-listen-accent resize-none"
                  />
                  {topicAreas.length > 1 && (
                    <button
                      onClick={() => removeTopic(i)}
                      className="p-2.5 text-listen-inkMute hover:text-listen-accentDeep mt-1"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Provider */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-listen-ink">{tr('aiProvider')}</h2>
            <p className="text-sm text-listen-inkMute">
              {tr('aiProviderDesc')}
            </p>
            <div className="space-y-2">
              {providerOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    aiProvider === option.id
                      ? 'border-listen-accent bg-listen-accentSoft/40 shadow-paper'
                      : 'border-listen-line bg-white hover:border-listen-accent/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="aiProvider"
                    checked={aiProvider === option.id}
                    onChange={() => {
                      setAiProvider(option.id);
                      // Reset model to provider's default when switching providers
                      setAiModel(option.id === 'claude' ? DEFAULT_CLAUDE_MODEL : DEFAULT_GEMINI_MODEL);
                      setIsDirty(true);
                    }}
                    className="mt-1 accent-listen-accent"
                  />
                  <div>
                    <div className="font-medium text-listen-ink">{option.label}</div>
                    <div className="text-xs text-listen-inkMute mt-0.5">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Model Selection */}
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-listen-inkSoft">
                {tr('modelLabel')}
              </label>
              <select
                value={aiModel}
                onChange={(e) => { setAiModel(e.target.value); setIsDirty(true); }}
                className="w-full px-4 py-3 rounded-xl bg-white border border-listen-line text-listen-ink focus:outline-none focus:ring-2 focus:ring-listen-accent focus:border-listen-accent"
              >
                {(aiProvider === 'gemini' ? GEMINI_MODELS : CLAUDE_MODELS).map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-listen-inkMute">
                {(aiProvider === 'gemini' ? GEMINI_MODELS : CLAUDE_MODELS).find(m => m.id === aiModel)?.desc || ''}
              </p>
            </div>

            {/* AI Reasoning Mode */}
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-listen-inkSoft">
                {tr('reasoningModeLabel')}
              </label>
              <select
                value={enableReasoning === undefined ? 'auto' : enableReasoning ? 'on' : 'off'}
                onChange={(e) => {
                  const v = e.target.value;
                  setEnableReasoning(v === 'auto' ? undefined : v === 'on');
                  setIsDirty(true);
                }}
                className="w-full px-4 py-3 rounded-xl bg-white border border-listen-line text-listen-ink focus:outline-none focus:ring-2 focus:ring-listen-accent focus:border-listen-accent"
              >
                <option value="auto">{tr('reasoningAuto')}</option>
                <option value="on">{tr('reasoningOn')}</option>
                <option value="off">{tr('reasoningOff')}</option>
              </select>
              <p className="text-xs text-listen-inkMute">
                {tr('reasoningDesc')}
              </p>
            </div>

            {/* Warning: Claude selected but no API key */}
            {aiProvider === 'claude' && configStatus && !configStatus.hasAnthropicKey && (
              <div className="bg-listen-warm/10 border border-listen-warm/40 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-listen-warm flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-listen-inkSoft text-sm">{tr('anthropicKeyMissingTitle')}</h4>
                  <p className="text-xs text-listen-inkMute mt-1">
                    {tr('anthropicKeyMissingDesc')}
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/settings')}
                    className="inline-flex items-center gap-1 text-xs text-listen-accent hover:text-listen-accentDeep mt-2 underline underline-offset-2"
                  >
                    {tr('viewSetupGuide')} <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Behavior */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-listen-ink">{tr('aiInterviewStyle')}</h2>
            <div className="space-y-2">
              {behaviorOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    aiBehavior === option.id
                      ? 'border-listen-accent bg-listen-accentSoft/40 shadow-paper'
                      : 'border-listen-line bg-white hover:border-listen-accent/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="aiBehavior"
                    checked={aiBehavior === option.id}
                    onChange={() => { setAiBehavior(option.id); setIsDirty(true); }}
                    className="mt-1 accent-listen-accent"
                  />
                  <div>
                    <div className="font-medium text-listen-ink">{option.label}</div>
                    <div className="text-xs text-listen-inkMute mt-0.5">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Link Settings */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-listen-ink flex items-center gap-2">
              <Clock size={18} className="text-listen-inkMute" />
              {tr('linkSettings')}
            </h2>
            <p className="text-sm text-listen-inkMute">
              {tr('linkSettingsDesc')}
            </p>

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-listen-inkSoft">{tr('linkExpirationLabel')}</span>
                <select
                  value={linkExpiration}
                  onChange={(e) => { setLinkExpiration(e.target.value as LinkExpirationOption); setIsDirty(true); }}
                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-white border border-listen-line text-listen-ink focus:outline-none focus:ring-2 focus:ring-listen-accent focus:border-listen-accent"
                >
                  <option value="never">{tr('expireNever')}</option>
                  <option value="7days">{tr('expire7days')}</option>
                  <option value="30days">{tr('expire30days')}</option>
                  <option value="90days">{tr('expire90days')}</option>
                </select>
              </label>
              <p className="text-xs text-listen-inkMute">
                {tr('linkExpirationFootnote')}
              </p>
            </div>
          </div>

          {/* Consent Text */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-listen-ink">{tr('consentTextSection')}</h2>
            <textarea
              value={consentText}
              onChange={(e) => { setConsentText(e.target.value); setIsDirty(true); }}
              placeholder={tr('defaultConsentText')}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white border border-listen-line text-listen-ink placeholder-listen-inkGhost focus:outline-none focus:ring-2 focus:ring-listen-accent focus:border-listen-accent resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Generate Participant Link */}
          {isValid && (
            <div className="space-y-4 pt-6 border-t border-listen-line/60">
              <h2 className="font-serif text-xl text-listen-ink flex items-center gap-2">
                <LinkIcon size={18} className="text-listen-accent" />
                {tr('participantLinkSection')}
              </h2>

              {participantLink ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={participantLink}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-xl bg-listen-paperDeep border border-listen-line text-listen-inkSoft text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-4 py-3 bg-listen-accent hover:bg-listen-accentDeep text-white rounded-xl shadow-accent transition-colors flex items-center gap-2"
                    >
                      {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                      {linkCopied ? tr('copied') : tr('copy')}
                    </button>
                  </div>
                  <p className="text-xs text-listen-inkMute">
                    {tr('shareLinkNote')}
                  </p>
                </div>
              ) : isAuthenticated === false || linkError === 'auth' ? (
                <div className="space-y-3">
                  <div className="bg-listen-paper border border-listen-line/60 rounded-xl p-4 text-sm text-listen-inkSoft">
                    <p className="mb-3">{tr('loginRequiredForLink')}</p>
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="px-4 py-2 bg-listen-accent hover:bg-listen-accentDeep text-white rounded-full shadow-accent transition-colors flex items-center gap-2"
                    >
                      <LogIn size={16} />
                      {tr('loginAsResearcher')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGenerateLink}
                    disabled={isGeneratingLink}
                    className="w-full py-3 bg-white border border-listen-line hover:border-listen-accent hover:text-listen-accent text-listen-inkSoft font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LinkIcon size={18} />
                    {isGeneratingLink ? tr('generatingLink') : tr('generateLink')}
                  </button>
                  {linkError && linkError !== 'auth' && (
                    <p className="text-sm text-listen-accentDeep">{linkError}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-6 border-t border-listen-line/60">
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full py-4 bg-listen-accent hover:bg-listen-accentDeep disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-full shadow-accent transition-all flex items-center justify-center gap-2"
            >
              {tr('startInterview')} <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default StudySetup;
