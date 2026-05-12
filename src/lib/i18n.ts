/**
 * 听见 Listen · 双语字典
 * Bilingual dictionary - 中文 / English
 *
 * 评审 / 用户语言通过 localStorage 'listen-locale' 持久化
 * AI prompt 中将注入 locale 字段
 */

export type Locale = 'zh' | 'en';

export const DEFAULT_LOCALE: Locale = 'zh';

export const t = {
  // 品牌
  brand: { zh: '听见', en: 'Listen' },
  brandTagline: {
    zh: '听见每一个创作者的真实声音',
    en: 'Hear every creator, truly',
  },
  brandSubtitle: {
    zh: 'AI 深度访谈工作台',
    en: 'AI-powered deep interview workspace',
  },

  // 通用
  loading: { zh: '加载中…', en: 'Loading…' },
  back: { zh: '返回', en: 'Back' },
  next: { zh: '继续', en: 'Continue' },
  cancel: { zh: '取消', en: 'Cancel' },
  save: { zh: '保存', en: 'Save' },
  delete: { zh: '删除', en: 'Delete' },
  edit: { zh: '编辑', en: 'Edit' },
  yes: { zh: '是', en: 'Yes' },
  no: { zh: '否', en: 'No' },

  // 导航
  navStudies: { zh: '我的研究', en: 'My Studies' },
  navInterviews: { zh: '所有访谈', en: 'All Interviews' },
  navLoadDemo: { zh: '加载示例', en: 'Load Demo' },
  navClearDemo: { zh: '清除示例', en: 'Clear Demo' },
  navLogout: { zh: '退出登录', en: 'Logout' },
  navLogin: { zh: '研究员登录', en: 'Researcher Login' },
  navCreateStudy: { zh: '新建研究', en: 'Create Study' },
  navSettings: { zh: '设置', en: 'Settings' },

  // 首页
  heroEyebrow: {
    zh: '为创作者经济而造',
    en: 'Built for the creator economy',
  },
  heroTitle: {
    zh: '让一个研究员，听见五百个创作者',
    en: 'One researcher, five hundred conversations',
  },
  heroSubtitle: {
    zh:
      '听见是一个 AI 深度访谈工作台。AI 替你和真实创作者一对一深聊 15 分钟，规模化拿到第二层、第三层的真实想法，再把所有对话自动综合成你打得开会的报告。',
    en:
      'Listen is an AI-powered deep interview workspace. The AI conducts one-on-one 15-minute conversations with real creators—at scale—then synthesizes hundreds of voices into insights you can actually present in a meeting.',
  },
  heroCtaPrimary: { zh: '开始一份研究', en: 'Start a study' },
  heroCtaSecondary: { zh: '查看示例洞察', en: 'See sample insights' },

  // 一句话定位（防御性）
  defensiveStatement: {
    zh: 'AI 在这里是访谈员和分析师 — 受访者永远是真实的人。',
    en: 'Here, AI plays the interviewer and the analyst — respondents are always real people.',
  },

  // 三大模板
  templatesEyebrow: { zh: '研究模板', en: 'Research templates' },
  templatesTitle: {
    zh: '为最难的三种创作者研究，预设了起点',
    en: 'Three preset starting points for the hardest creator studies',
  },
  template1Title: { zh: '商单决策深访', en: 'Brand-deal decision interview' },
  template1Desc: {
    zh: '为什么接，为什么拒绝。把模糊的「看情况」追到具体的第三层。',
    en: 'Why they say yes, why they walk away. Push past "it depends" to the third layer.',
  },
  template2Title: { zh: '创作者退潮归因', en: 'Creator drop-off attribution' },
  template2Desc: {
    zh: '发文减少 30% 的人到底发生了什么。Dashboard 不会告诉你的事。',
    en: 'What really happened to creators who posted 30% less. The thing dashboards won\'t tell you.',
  },
  template3Title: { zh: '新人扶持期望', en: 'New-creator support expectations' },
  template3Desc: {
    zh: '入驻 90 天内最影响留存的对话。每一个新人都值得被认真问一次。',
    en: 'The conversations that move retention in the first 90 days. Every new creator deserves a real question.',
  },
  templateCta: { zh: '使用此模板', en: 'Use this template' },

  // 价值主张三段
  valueEyebrow: { zh: '产品价值', en: 'Why this matters' },
  value1Title: { zh: '规模 × 深度', en: 'Scale × Depth' },
  value1Body: {
    zh: '过去做 100 份深访需要一个团队两周。现在一个研究员 48 小时即可，每一份都比真人焦点小组追得更深。',
    en: '100 deep interviews used to take a team two weeks. Now a single researcher does it in 48 hours—each conversation pushes deeper than a traditional focus group.',
  },
  value2Title: { zh: '零评判 · 真表达', en: 'Zero judgment · real talk' },
  value2Body: {
    zh: '创作者在 AI 面前更愿意说真话——「比我以为的更敞开，因为对方不会评判」。这是真人研究员物理上做不到的对话关系。',
    en: 'Creators open up more to AI—"more honest than I expected, because no one is judging me." A relationship no human interviewer can structurally offer.',
  },
  value3Title: { zh: '即问即报', en: 'From signal to report, instantly' },
  value3Body: {
    zh: '每一份访谈结束即刻生成综合报告，跨样本聚合自动识别群体模式与少数派观点。直接可以贴进周报。',
    en: 'A synthesis report drops the moment each interview ends. Cross-sample aggregation surfaces group patterns and minority views—ready to paste into a weekly review.',
  },

  // 信效度
  rigorEyebrow: { zh: '严肃性声明', en: 'A note on rigor' },
  rigorTitle: {
    zh: '我们做什么，我们不做什么',
    en: 'What we do — and what we don\'t',
  },
  rigorDo: { zh: '我们做的', en: 'What Listen does' },
  rigorDont: { zh: '我们不做的', en: 'What Listen does not do' },
  rigorDoBody: {
    zh: 'AI 替代研究员去做访谈与综合。每一句受访者的话，都来自真实的创作者本人。',
    en: 'AI replaces the researcher in conducting interviews and synthesizing findings. Every respondent quote comes from a real human creator.',
  },
  rigorDontBody: {
    zh: '我们不让 AI 扮演创作者。我们不做合成用户研究（synthetic users）。任何决策都建立在真实对话之上。',
    en: 'We do not let AI play the role of a creator. We do not produce synthetic-user research. Every decision rests on real conversation.',
  },

  // 登录
  loginTitle: { zh: '研究员登录', en: 'Researcher login' },
  loginSubtitle: {
    zh: '请输入访问密码以进入研究员工作台',
    en: 'Enter your admin password to enter the workspace',
  },
  loginPasswordLabel: { zh: '访问密码', en: 'Password' },
  loginPasswordPlaceholder: { zh: '请输入访问密码', en: 'Enter admin password' },
  loginButton: { zh: '进入', en: 'Enter' },
  loginLoading: { zh: '正在进入…', en: 'Entering…' },
  loginBack: { zh: '返回首页', en: 'Back to home' },

  // 研究员后台
  studiesTitle: { zh: '我的研究', en: 'My Studies' },
  studiesEmptyTitle: { zh: '还没有研究', en: 'No studies yet' },
  studiesEmptyDesc: {
    zh: '创建第一份研究，或加载示例数据先看看工作流程。',
    en: 'Create your first study, or load sample data to explore the workflow.',
  },
  studiesCountLabel: { zh: '份研究', en: 'studies' },
  studiesInterviewsLabel: { zh: '次访谈', en: 'interviews' },
  studiesInterviewLabel: { zh: '次访谈', en: 'interview' },
  studiesQuestionsLabel: { zh: '个问题', en: 'questions' },
  studyStatusLocked: { zh: '已发布', en: 'Live' },
  studyStatusDraft: { zh: '草稿中', en: 'Draft' },
  menuViewDetails: { zh: '查看详情', en: 'View details' },
  menuEditAndGenerate: { zh: '编辑 / 生成访谈链接', en: 'Edit & generate link' },
  menuDelete: { zh: '删除研究', en: 'Delete study' },
  confirmDeleteStudy: {
    zh: '确认删除这份研究吗？此操作不可撤销。',
    en: 'Delete this study? This cannot be undone.',
  },
  deleteFailed: { zh: '删除失败', en: 'Failed to delete study' },
  demoLoadingFailed: { zh: '加载示例失败', en: 'Failed to load demo data' },
  demoLoadedSuccess: {
    zh: '示例数据已加载',
    en: 'Demo data loaded',
  },
  demoLoadedLocal: {
    zh: '示例数据已以临时模式加载（未连接存储，刷新后会重置）',
    en: 'Demo loaded in preview mode (storage not configured, will reset on refresh)',
  },
  previewModeLabel: {
    zh: '预览模式 · 你正以受访者视角查看，回答不会被记录',
    en: 'Preview mode · You are viewing as a participant; answers will not be saved',
  },
  previewExitLabel: { zh: '退出预览', en: 'Exit preview' },
  demoClearedSuccess: { zh: '示例数据已清除', en: 'Demo data cleared' },
  demoConfirmClear: {
    zh: '确认清除全部示例数据吗？',
    en: 'Clear all demo data?',
  },
  demoIncludesNote: {
    zh: '示例包含一份样本研究 + 3 段已完成访谈与 AI 综合分析。',
    en: 'Demo includes one sample study with 3 completed interviews and AI analysis.',
  },

  // Dashboard
  dashboardTitle: { zh: '访谈仪表台', en: 'Interview dashboard' },
  dashboardCollected: { zh: '已收集', en: 'collected' },
  dashboardExportAll: { zh: '导出全部', en: 'Export all' },
  dashboardFilterAll: { zh: '全部研究', en: 'All studies' },
  dashboardClearFilter: { zh: '清除筛选', en: 'Clear filter' },
  dashboardEmptyTitle: { zh: '还没有访谈', en: 'No interviews yet' },
  dashboardEmptyDesc: {
    zh: '访谈完成后会显示在这里。分享访谈链接给创作者开始收集。',
    en: 'Completed interviews will appear here. Share the participant link to start collecting.',
  },
  dashboardCreateLink: { zh: '生成访谈链接', en: 'Create study link' },
  durationUnit: { zh: '分钟', en: 'min' },
  messagesLabel: { zh: '条消息', en: 'messages' },
  statusCompleted: { zh: '已完成', en: 'completed' },
  statusInProgress: { zh: '进行中', en: 'in progress' },
  backToSetup: { zh: '返回新建', en: 'Back to setup' },

  // Consent 同意页
  consentEyebrow: { zh: '在开始之前', en: 'Before we begin' },
  consentTitle: { zh: '一场平等的对话', en: 'A conversation between equals' },
  consentIntroOne: {
    zh: '接下来的 15 分钟，你会和一位 AI 访谈员一对一对话。这不是问卷，是一次真正的聊天。',
    en: 'For the next 15 minutes, you\'ll have a one-on-one chat with an AI interviewer. This is not a survey — it\'s a real conversation.',
  },
  consentIntroTwo: {
    zh: '你可以慢慢说、可以改主意、可以跳过任何让你不舒服的问题。不会有人评判你。',
    en: 'Take your time, change your mind, skip anything you don\'t want to answer. No one is judging you.',
  },
  consentStructureTitle: { zh: '访谈结构', en: 'How this will go' },
  consentStep1Title: { zh: '先聊聊背景', en: 'A bit about you first' },
  consentStep1Desc: {
    zh: '让我先了解你创作的都是什么、多久了',
    en: 'A quick read on what you create and how long you\'ve been at it',
  },
  consentStep2Title: { zh: '{count} 个核心问题', en: '{count} core questions' },
  consentStep2Desc: {
    zh: '这些是这次访谈真正想听你说的',
    en: 'These are the ones I genuinely want to hear you on',
  },
  consentStep3Title: { zh: '我会追问你', en: 'I might follow up' },
  consentStep3Desc: {
    zh: '如果你说了一个有意思的句子，我会请你多说一点。',
    en: 'When you say something interesting, I\'ll ask you to go deeper.',
  },
  consentStep4Title: { zh: '最后听你的反馈', en: 'Your feedback at the end' },
  consentStep4Desc: {
    zh: '这次聊天有什么是你期待但我没问到的',
    en: 'Anything you hoped I\'d ask but didn\'t',
  },
  consentEstimate: { zh: '预计 10–15 分钟', en: 'About 10–15 minutes' },
  consentPrivacyTitle: { zh: '隐私保护', en: 'On your privacy' },
  consentPrivacyBody: {
    zh: '你说的话只会加密保存在研究员的工作台里，不会公开、不会被关联到你的账号、不会用于平台算法判断。',
    en: 'Your words are encrypted and visible only to the researcher. Nothing here is published, linked to your account, or fed into platform algorithms.',
  },
  consentBeginCta: { zh: '我准备好了，开始吧', en: 'I\'m ready — let\'s start' },
  consentMissingStudy: {
    zh: '还没有配置研究，请先创建一份研究。',
    en: 'No study configured yet. Please set one up first.',
  },

  // Interview Chat
  chatYouAreTalkingWith: { zh: '你正在和', en: 'You\'re talking to' },
  chatAiNameDefault: { zh: '听见', en: 'Listen' },
  chatProgressLabel: { zh: '访谈进度', en: 'Interview progress' },
  chatEndingTitle: { zh: '谢谢你愿意说', en: 'Thank you for sharing' },
  chatEndingBody: {
    zh: '你刚才说的每一句话，都会被认真读到。我们不会泄露，也不会评判。',
    en: 'Every word you shared will be read carefully. We won\'t share it, and we won\'t judge.',
  },
  chatGenerating: { zh: '正在为你生成总结…', en: 'Generating your summary…' },
  chatSubmit: { zh: '发送', en: 'Send' },
  chatFinish: { zh: '结束访谈', en: 'Finish interview' },
  chatFinishEarly: { zh: '提前结束', en: 'Finish early' },
  chatPlaceholder2: { zh: '给听见说点什么…', en: 'Tell Listen anything…' },
  chatInterviewer: { zh: '听见', en: 'Listen' },
  chatYou: { zh: '你', en: 'You' },
  chatThinking2: { zh: '正在听你说…', en: 'Listening…' },
  chatPhaseBackground: { zh: '先聊聊你创作的背景', en: 'A quick read on your background' },
  chatPhaseCore: { zh: '核心话题', en: 'Core questions' },
  chatPhaseExploration: { zh: '准备追一下', en: 'Going deeper' },
  chatPhaseFeedback: { zh: '你的反馈', en: 'Your feedback' },
  chatPhaseWrap: { zh: '快要结束了', en: 'Wrapping up' },
  chatQuestionCounter: { zh: '第 {n}/{total} 个', en: 'Question {n} of {total}' },
  chatCompletedTitle: { zh: '访谈完成', en: 'Interview complete' },
  chatCompletedBody: {
    zh: '你的回答已保存。谢谢你愿意花这些时间。',
    en: 'Your responses have been saved. Thank you for your time.',
  },
  chatViewSynthesis: { zh: '查看总结', en: 'View synthesis' },

  // Synthesis 综合分析页
  synthesisPageTitle: { zh: '访谈综合分析', en: 'Interview Analysis' },
  synthesisPageSubtitle: { zh: '从这段对话里，听见了什么', en: 'Patterns and insights from the conversation' },
  synthesisAnalyzing: { zh: 'AI 综合分析中…', en: 'Analyzing Interview…' },
  synthesisAnalyzingDesc: { zh: '正在识别模式、主题与洞察', en: 'Looking for patterns, themes, and insights' },
  synthesisComplete: { zh: '分析完成', en: 'Analysis complete' },
  synthesisFailed: { zh: '分析失败', en: 'Analysis failed' },
  synthesisFailedDesc: {
    zh: '综合分析时出现错误，可以重新尝试。',
    en: 'There was an error analyzing the interview. Please try again.',
  },
  synthesisNoData: {
    zh: '还没有可分析的访谈数据。',
    en: 'No interview data to analyze yet.',
  },
  synthesisKeyInsight: { zh: '核心洞察', en: 'Key Insight' },
  synthesisThemes: { zh: '核心主题', en: 'Key Themes' },
  synthesisPatternsTitle: { zh: '表达 vs 行为', en: 'Stated vs Revealed' },
  synthesisPatternsStated: { zh: '他说了什么', en: 'What they said' },
  synthesisPatternsRevealed: { zh: '行为透露了什么', en: 'What their behavior revealed' },
  synthesisTensions: { zh: '潜在张力', en: 'Potential Contradictions' },
  synthesisHighlights: { zh: '补充亮点', en: 'Additional Insights' },
  synthesisSaved: {
    zh: '访谈已保存，可在研究员后台查看。',
    en: 'Interview saved successfully. View it in the researcher dashboard.',
  },
  synthesisSaveFailed: {
    zh: '访谈保存失败，你仍可在下方导出本地备份。',
    en: 'Could not save interview. You can still export locally below.',
  },
  synthesisSaving: { zh: '正在保存访谈…', en: 'Saving interview…' },
  synthesisRetrySave: { zh: '重新保存', en: 'Retry Save' },
  synthesisRetryAnalysis: { zh: '重新分析', en: 'Retry Analysis' },
  synthesisGoToExport: { zh: '继续到导出', en: 'Continue to Export' },
  synthesisBackToInterview: { zh: '返回访谈', en: 'Back to Interview' },
  synthesisGoToInterviewBtn: { zh: '前往访谈', en: 'Go to Interview' },
  chatFallbackError: {
    zh: '很高兴你愿意说这个，能多聊一点吗？',
    en: 'Thanks for sharing that. Could you tell me more?',
  },

  // 存储警告
  storageWarning: { zh: '尚未配置持久化存储', en: 'Storage not configured' },
  storageWarningDesc: {
    zh: '当前部署未连接 Vercel KV / Upstash Redis，访谈数据不会持久化。生产部署请按 README 配置。',
    en: 'No Vercel KV / Upstash Redis is connected. Interviews will not persist. See README for setup.',
  },

  // 参与者端
  participantWelcome: { zh: '我在这里听你说', en: 'I\'m here to listen' },
  participantConsentTitle: {
    zh: '在我们开始之前',
    en: 'Before we begin',
  },
  participantConsentIntro: {
    zh:
      '接下来的 15 分钟，你会和一位 AI 访谈员一对一对话。这不是问卷，是一次真正的聊天——你可以慢慢说、可以反复想、可以不回答任何让你不舒服的问题。',
    en:
      'Over the next 15 minutes, you\'ll have a one-on-one conversation with an AI interviewer. This isn\'t a survey—it\'s a real chat. Take your time, change your mind, skip anything you don\'t want to answer.',
  },
  participantConsentSafety: {
    zh:
      '你说的话只会被加密保存在研究员的工作台里，不会公开、不会被关联到你的账号、不会用于平台算法判断。',
    en:
      'Your words are encrypted and visible only to the researcher. Nothing here is published, linked to your account, or fed into platform algorithms.',
  },
  participantBeginCta: { zh: '我准备好了，开始', en: 'I\'m ready, let\'s start' },

  // 访谈中
  chatPlaceholder: { zh: '随便说，我都在听…', en: 'Say anything, I\'m listening…' },
  chatThinking: { zh: '正在认真听…', en: 'Listening carefully…' },
  chatTyping: { zh: '正在回复…', en: 'Replying…' },

  // 结束
  thanksTitle: { zh: '谢谢你愿意说', en: 'Thank you for sharing' },
  thanksBody: {
    zh: '你刚才说的每一句话，都会被认真读到。我们不会泄露，也不会评判。',
    en: 'Every word you just shared will be read carefully. We won\'t share it, and we won\'t judge.',
  },

  // Export 导出页
  exportTitle: { zh: '访谈已完成', en: 'Interview complete' },
  exportSubtitle: { zh: '已完成访谈 · 可导出研究包', en: 'Interview done · ready to export your research package' },
  exportStatsMessages: { zh: '条消息', en: 'Messages' },
  exportStatsQuestions: { zh: '核心问题', en: 'Questions' },
  exportStatsProfile: { zh: '档案字段', en: 'Profile' },
  exportStatsThemes: { zh: '主题', en: 'Themes' },
  exportActionsTitle: { zh: '导出数据', en: 'Export data' },
  exportJsonTitle: { zh: 'JSON 完整数据包', en: 'JSON full data package' },
  exportJsonDesc: { zh: '包含档案、转录记录与综合分析的结构化数据', en: 'Structured data with profile, transcript, and synthesis' },
  exportJsonDownload: { zh: '下载 JSON', en: 'Download JSON' },
  exportJsonCopy: { zh: '复制内容到剪贴板', en: 'Copy to clipboard' },
  exportJsonCopied: { zh: '已复制', en: 'Copied' },
  exportJsonDownloaded: { zh: '已下载', en: 'Downloaded' },
  exportMdTitle: { zh: 'Markdown 访谈记录', en: 'Markdown transcript' },
  exportMdDesc: { zh: '含档案摘要的可读访谈文本', en: 'Readable transcript with profile summary' },
  exportMdDownload: { zh: '下载 Markdown', en: 'Download Markdown' },
  exportMdCopy: { zh: '复制内容到剪贴板', en: 'Copy to clipboard' },
  exportMdCopied: { zh: '已复制', en: 'Copied' },
  exportMdDownloaded: { zh: '已下载', en: 'Downloaded' },
  exportProfileTitle: { zh: '受访者档案摘要', en: 'Participant profile' },
  exportProfileDeclined: { zh: '已拒绝', en: 'Declined' },
  exportProfileUnclear: { zh: '不明确', en: 'Unclear' },
  exportSynthesisTitle: { zh: '综合分析回顾', en: 'Analysis review' },
  exportSynthesisKeyInsight: { zh: '核心洞察', en: 'Key insight' },
  exportSynthesisThemes: { zh: '主题', en: 'Themes' },
  exportSynthesisHighlights: { zh: '关键亮点', en: 'Key highlights' },
  exportSynthesisPatterns: { zh: '模式', en: 'Patterns' },
  exportSynthesisTensions: { zh: '张力', en: 'Tensions' },
  exportResetTitle: { zh: '重置与继续', en: 'Reset & continue' },
  exportResetDesc: { zh: '开始新一轮访谈，或重置全部数据重新配置研究。', en: 'Start a new interview session, or reset everything to reconfigure your study.' },
  exportNewParticipant: { zh: '新受访者（保留本研究）', en: 'New participant (keep study)' },
  exportNewStudy: { zh: '新建研究', en: 'New study' },
  exportConfirmNewParticipant: { zh: '确认开始新一位受访者？当前访谈数据将被清除。', en: 'Start a new participant? Current interview data will be cleared.' },
  exportConfirmNewStudy: { zh: '确认重置全部数据？研究配置也会被清除，此操作不可撤销。', en: 'Reset everything? Study configuration will also be cleared. This cannot be undone.' },

  // Settings 页面
  settingsTitle: { zh: '账号与配置', en: 'Account & Settings' },
  settingsSubtitle: { zh: '管理你的 API Key 与存储配置', en: 'Manage your API keys and storage' },
  settingsBackToStudies: { zh: '返回我的研究', en: 'Back to studies' },
  settingsCurrentStatus: { zh: '当前状态', en: 'Current status' },
  settingsConfigured: { zh: '已配置', en: 'Configured' },
  settingsNotConfigured: { zh: '未配置', en: 'Not configured' },
  settingsConnected: { zh: '已连接', en: 'Connected' },

  // 个人资料
  settingsProfileSection: { zh: '研究员资料', en: 'Researcher profile' },
  settingsProfileName: { zh: '名称', en: 'Name' },
  settingsProfileEmail: { zh: '邮箱', en: 'Email' },
  settingsProfileAvatarUrl: { zh: '头像 URL', en: 'Avatar URL' },

  // AI API Key
  settingsApiKeysSection: { zh: 'AI API Key', en: 'AI API Keys' },
  settingsApiKeysDesc: { zh: '更新你的 API Key；留空则保留现有 Key。', en: 'Update your API keys. Leave blank to keep the current key.' },
  settingsGeminiKey: { zh: 'Gemini API Key', en: 'Gemini API Key' },
  settingsAnthropicKey: { zh: 'Claude API Key', en: 'Claude API Key' },
  settingsGeminiPlaceholder: { zh: '（已配置）', en: '(currently set)' },
  settingsAnthropicPlaceholder: { zh: '（已配置）', en: '(currently set)' },
  settingsValidate: { zh: '校验', en: 'Validate' },
  settingsValidating: { zh: '校验中…', en: 'Validating…' },
  settingsValidated: { zh: '校验通过', en: 'Validated' },
  settingsSetupGuide: { zh: '配置说明', en: 'Setup guide' },

  // Gemini 说明
  settingsGeminiGuide1: { zh: '访问 aistudio.google.com/apikey', en: 'Go to aistudio.google.com/apikey' },
  settingsGeminiGuide2: { zh: '登录并点击「Create API key」', en: 'Sign in and click "Create API key"' },
  settingsGeminiGuide3: { zh: '复制以 AIza 开头的 Key', en: 'Copy the key (starts with AIza)' },
  settingsGeminiFree: { zh: '免费版：10 次/分钟，250 次/天', en: 'Free: 10 req/min, 250 req/day' },

  // Claude 说明
  settingsClaudeGuide1: { zh: '访问 console.anthropic.com', en: 'Go to console.anthropic.com' },
  settingsClaudeGuide2: { zh: '注册并领取 $5 免费额度（需美国手机验证）', en: 'Sign up and claim $5 free credits (US phone required)' },
  settingsClaudeGuide3: { zh: '进入 API Keys → Create API Key → 复制（以 sk-ant- 开头）', en: 'Go to API Keys → Create API Key → copy it (starts with sk-ant-)' },
  settingsClaudeFree: { zh: '$5 免费额度 ≈ 15–100 次访谈', en: '$5 free ≈ 15–100 interviews' },

  // 存储配置
  settingsStorageSection: { zh: 'Upstash Redis 存储', en: 'Upstash Redis Storage' },
  settingsStorageDesc: { zh: '更新 Redis 连接信息；留空则保留现有连接。', en: 'Update your Redis credentials. Leave blank to keep the current connection.' },
  settingsStorageWarning: { zh: '注意：更改 Redis URL 会断开与现有数据的连接。', en: 'Warning: changing your Redis URL will disconnect from your current data.' },
  settingsStorageUrl: { zh: 'REST API URL', en: 'REST API URL' },
  settingsStorageToken: { zh: 'REST API Token', en: 'REST API Token' },
  settingsStorageUrlPlaceholder: { zh: '（已配置）', en: '(currently set)' },
  settingsStorageTokenPlaceholder: { zh: '（已配置）', en: '(currently set)' },
  settingsTestConnection: { zh: '测试连接', en: 'Test connection' },
  settingsTestingConnection: { zh: '测试中…', en: 'Testing…' },

  // Redis 说明
  settingsRedisGuide1: { zh: '访问 console.upstash.com 并登录', en: 'Go to console.upstash.com and sign in' },
  settingsRedisGuide2: { zh: '点击「+ Create Database」→ 选择 Regional 与免费套餐', en: 'Click "+ Create Database" → choose Regional and Free plan' },
  settingsRedisGuide3: { zh: '进入数据库详情 → REST API 区域', en: 'After creation, go to database details → REST API section' },
  settingsRedisGuide4: { zh: '复制 REST URL（https://*.upstash.io）和 REST Token', en: 'Copy REST URL (https://*.upstash.io) and REST Token' },
  settingsRedisNote: { zh: '使用 REST URL（https://），而非 redis:// 协议', en: 'Use REST URL (https://), not regular URL (redis://)' },

  // 操作反馈
  settingsPartialRedis: { zh: 'Redis URL 和 Token 必须同时填写才能更新存储配置。', en: 'Both Redis URL and token are required to update storage credentials.' },
  settingsSaveChanges: { zh: '保存更改', en: 'Save changes' },
  settingsSaving: { zh: '保存中…', en: 'Saving…' },
  settingsSaveSuccess: { zh: '保存成功', en: 'Saved successfully' },

  // 安全提示
  settingsSecuritySection: { zh: '安全说明', en: 'Security note' },
  settingsSecurityBody: { zh: 'API Key 经加密后存储于你自己的数据库，听见不会在任何地方明文记录你的凭证。如需撤销权限，直接在对应平台的控制台中删除该 Key 即可。', en: 'Your API keys are encrypted and stored in your own database. Listen never logs your credentials in plaintext. To revoke access, delete the key directly in the respective platform console.' },

  // 页脚
  footerCopyright: {
    zh: '© 2026 听见 Listen · 一个让你听见 500 个创作者的工作台',
    en: '© 2026 Listen · A workspace to hear 500 creators',
  },
  footerNote: {
    zh: '所有访谈数据加密保存于研究员服务器。AI 提供商不持久化保留对话内容。',
    en: 'All interview data is encrypted on the researcher\'s server. AI providers do not retain conversations.',
  },

  // ===== StudySetup =====
  studySetupTitle: { zh: '配置研究', en: 'Study Setup' },
  studySetupSubtitle: {
    zh: '设计你的访谈研究 · 5 分钟内生成可分享链接',
    en: 'Design your interview study · Generate a shareable link in 5 minutes',
  },
  backToStudies: { zh: '返回研究列表', en: 'Back to All Studies' },
  loadExample: { zh: '加载示例', en: 'Load Example' },
  saveStudy: { zh: '保存研究', en: 'Save Study' },
  saving: { zh: '保存中...', en: 'Saving...' },
  updateStudy: { zh: '更新研究', en: 'Update Study' },
  saved: { zh: '已保存', en: 'Saved' },
  savedBang: { zh: '已保存', en: 'Saved!' },
  saveFailed: { zh: '保存失败', en: 'Save Failed' },
  preview: { zh: '预览', en: 'Preview' },
  followUpStudy: { zh: '追踪性研究', en: 'Follow-up Study' },
  basedOnFindingsFrom: { zh: '基于以下研究的发现：', en: 'Based on findings from' },
  studyDetails: { zh: '研究基本信息', en: 'Study Details' },
  studyNameLabel: { zh: '研究名称 *', en: 'Study Name *' },
  studyNamePlaceholder: {
    zh: '例：创作者退潮归因深访',
    en: 'e.g., Creator burnout deep interviews',
  },
  researchQuestionLabel: { zh: '研究问题 *', en: 'Research Question *' },
  researchQuestionPlaceholder: {
    zh: '你想弄明白什么？',
    en: 'What are you trying to understand?',
  },
  descriptionLabel: { zh: '研究说明（可选）', en: 'Description (optional)' },
  descriptionPlaceholder: {
    zh: '简要写下研究背景与场景...',
    en: 'Brief context about the study...',
  },
  profileFields: { zh: '受访者画像字段', en: 'Profile Fields' },
  profileFieldsDesc: {
    zh: '访谈过程中需要从受访者那里收集的基础信息',
    en: 'Information to gather about participants during the interview',
  },
  quickAdd: { zh: '快速添加：', en: 'Quick add:' },
  addCustom: { zh: '自定义', en: 'Add Custom' },
  fieldLabelPlaceholder: {
    zh: '字段名称（如：账号类型）',
    en: 'Field label (e.g., Account type)',
  },
  fieldHintPlaceholder: {
    zh: '给 AI 的提取提示（如：他们的账号定位与赛道）',
    en: 'Hint for AI (e.g., Their account type and vertical)',
  },
  fieldRequired: { zh: '必填', en: 'Required field' },
  fieldOptional: { zh: '选填', en: 'Optional field' },
  reqBadge: { zh: '必填', en: 'REQ' },
  optBadge: { zh: '选填', en: 'OPT' },
  noProfileFieldsYet: {
    zh: '还未添加任何画像字段。从上方添加以便收集受访者信息。',
    en: 'No profile fields yet. Add some above to gather participant information.',
  },
  coreQuestions: { zh: '核心问题', en: 'Core Questions' },
  coreQuestionsDesc: {
    zh: '访谈中必须问到的问题清单',
    en: 'Must-ask questions for your interview',
  },
  addQuestion: { zh: '加问题', en: 'Add Question' },
  questionPlaceholder: { zh: '问题', en: 'Question' },
  topicAreas: { zh: '领域主题', en: 'Topic Areas' },
  topicAreasDesc: {
    zh: 'AI 需要主动取证的主题（例如：担忧、动机、权衡）',
    en: 'Themes the AI should probe on (e.g., fears, motivations, trade-offs)',
  },
  addTopic: { zh: '加主题', en: 'Add Topic' },
  topicPlaceholder: { zh: '主题', en: 'Topic area' },
  aiProvider: { zh: 'AI 提供商', en: 'AI Provider' },
  aiProviderDesc: {
    zh: '选择驱动访谈的 AI 模型',
    en: 'Choose which AI model powers your interviews',
  },
  providerGemini: { zh: 'Google Gemini', en: 'Google Gemini' },
  providerGeminiDesc: {
    zh: '响应快、性价比高。适合大样本量研究。',
    en: 'Fast, cost-effective. Best for high-volume studies.',
  },
  providerClaude: { zh: 'Anthropic Claude', en: 'Anthropic Claude' },
  providerClaudeDesc: {
    zh: '细腻推理。适合复杂、探索型访谈。',
    en: 'Nuanced reasoning. Best for complex, exploratory interviews.',
  },
  modelLabel: { zh: '模型', en: 'Model' },
  reasoningModeLabel: { zh: 'AI 推理模式', en: 'AI Reasoning Mode' },
  reasoningAuto: { zh: '自动（推荐）', en: 'Automatic (recommended)' },
  reasoningOn: { zh: '始终启用', en: 'Always enabled' },
  reasoningOff: { zh: '始终关闭', en: 'Always disabled' },
  reasoningDesc: {
    zh: '自动：访谈期间关闭（响应更快），总结阶段启用（使用高阶模型进行深度分析，可能增加 API 成本）',
    en: 'Automatic: off during interviews for faster replies, on during synthesis for deeper analysis using premium models (may increase API costs)',
  },
  anthropicKeyMissingTitle: { zh: '未配置 Anthropic API Key', en: 'Anthropic API Key Missing' },
  anthropicKeyMissingDesc: {
    zh: '使用 Claude 进行访谈需要设置 ANTHROPIC_API_KEY 环境变量。请在 Vercel 项目设置 → 环境变量 中配置。',
    en: 'Claude interviews require the ANTHROPIC_API_KEY environment variable. Set it in Vercel Project Settings → Environment Variables.',
  },
  viewSetupGuide: { zh: '查看配置指南', en: 'View setup guide' },
  aiInterviewStyle: { zh: 'AI 访谈风格', en: 'AI Interview Style' },
  styleStructuredLabel: {
    zh: '优先覆盖全部问题（结构型）',
    en: 'Focus on covering all questions (Structured)',
  },
  styleStructuredDesc: {
    zh: '以完成为先。减少追问，遇到偏题会拉回。',
    en: 'Prioritize completion. Minimal follow-ups, redirect tangents.',
  },
  styleStandardLabel: {
    zh: '平衡广度与深度（标准型）',
    en: 'Balance coverage and depth (Standard)',
  },
  styleStandardDesc: {
    zh: '默认模式。在关键洞察处追问，之后推进。',
    en: 'Default mode. Follow up on key insights, then move on.',
  },
  styleExploratoryLabel: {
    zh: '优先挖掘新洞察（探索型）',
    en: 'Focus on uncovering new insights (Exploratory)',
  },
  styleExploratoryDesc: {
    zh: '以深度为先。追查有趣的线索，调动情绪与错误。',
    en: 'Prioritize depth. Chase interesting threads, probe emotions.',
  },
  linkSettings: { zh: '链接设置', en: 'Link Settings' },
  linkSettingsDesc: {
    zh: '设置受访者链接的过期时间，也可以随时在研究详情页撤销链接。',
    en: 'Configure when participant links expire. You can also revoke links from the study detail page.',
  },
  linkExpirationLabel: { zh: '过期时间', en: 'Link Expiration' },
  expireNever: { zh: '永不过期', en: 'Never expire' },
  expire7days: { zh: '7 天后过期', en: 'Expire after 7 days' },
  expire30days: { zh: '30 天后过期', en: 'Expire after 30 days' },
  expire90days: { zh: '90 天后过期', en: 'Expire after 90 days' },
  linkExpirationFootnote: {
    zh: '过期后受访者访问链接会看到提示。',
    en: 'Expired links will show an error message when participants try to access them.',
  },
  consentTextSection: { zh: '知情同意书', en: 'Consent Text' },
  participantLinkSection: { zh: '受访者链接', en: 'Participant Link' },
  copied: { zh: '已复制', en: 'Copied!' },
  copy: { zh: '复制', en: 'Copy' },
  shareLinkNote: {
    zh: '将链接发送给受访者。研究配置以 token 形式安全嵌入 URL。',
    en: 'Share this link with participants. The study configuration is embedded in the URL as a secure token.',
  },
  loginRequiredForLink: {
    zh: '生成受访者链接需要先登录。',
    en: 'Login required to generate participant links.',
  },
  loginAsResearcher: { zh: '登录为研究员', en: 'Login as Researcher' },
  generateLink: { zh: '生成受访者链接', en: 'Generate Participant Link' },
  generatingLink: { zh: '生成中...', en: 'Generating...' },
  startInterview: { zh: '开始访谈', en: 'Start Interview' },
  studyUntitled: { zh: '未命名研究', en: 'Untitled Study' },
  // Default profile preset labels
  presetRoleLabel: { zh: '创作赛道', en: 'Current Role' },
  presetRoleHint: { zh: '他们的主赛道与人设', en: 'Their job title or position' },
  presetIndustryLabel: { zh: '所在领域', en: 'Industry' },
  presetIndustryHint: { zh: '他们的市场与行业', en: 'The industry they work in' },
  presetExperienceLabel: { zh: '创作年份', en: 'Years of Experience' },
  presetExperienceHint: { zh: '他们在创作赛道的年限', en: 'How many years in their field' },
  presetTeamSizeLabel: { zh: '团队规模', en: 'Team Size' },
  presetTeamSizeHint: { zh: '他们的团队 / MCN 规模', en: 'Size of team they work with' },
  presetLocationLabel: { zh: '所在城市', en: 'Location' },
  presetLocationHint: { zh: '他们所在的城市与区域', en: 'Where they are based (city/region)' },
  defaultConsentText: {
    zh: '感谢你参与本次研究。你的回答会被用于理解《研究主题》。你可以随时退出。你是否同意参与？',
    en: 'Thank you for participating in this research. Your responses will be used to understand [research topic]. You may stop at any time. Do you consent to participate?',
  },
  errFailedSaveStudy: { zh: '保存研究失败，请重试。', en: 'Failed to save study. Please try again.' },
  errStorageNotConfigured: {
    zh: '存储未配置。请在部署设置中连接 Vercel KV（Upstash Redis）。',
    en: 'Storage not configured. Please connect Vercel KV (Upstash Redis) in your deployment settings.',
  },
  errNetworkRetry: {
    zh: '网络错误，请检查连接后重试。',
    en: 'Network error. Please check your connection and try again.',
  },
  errFailedGenLink: {
    zh: '生成链接失败',
    en: 'Failed to generate link',
  },

  // ============================================
  // Showcase 页(免登录示例洞察)
  // ============================================
  showcaseTitle: {
    zh: '示例研究 · 创作者退潮归因深访',
    en: 'Sample Study · Why Creators Quietly Stop Posting',
  },
  showcaseSubtitle: {
    zh: '下面是「听见」在一份创作者退潮课题上跑出来的完整交付：研究设计、三段访谈原文、跨样本聚合报告。无需登录，三个 Tab 看完即是一次评审。',
    en: 'Below is what Listen actually delivered on one creator-dropoff study—study design, three full interviews, and the cross-sample synthesis. No login needed; the three tabs are the review itself.',
  },
  showcaseTabStudy: { zh: '研究背景', en: 'Study brief' },
  showcaseTabInterviews: { zh: '三段访谈', en: 'Three interviews' },
  showcaseTabAggregate: { zh: '跨样本聚合', en: 'Aggregate insights' },
  showcaseStudyQuestionLabel: { zh: '研究问题', en: 'Research question' },
  showcaseStudyTopicsLabel: { zh: '话题领域', en: 'Topic areas' },
  showcaseStudyCoreQLabel: { zh: '核心问题', en: 'Core questions' },
  showcaseStudyProfileLabel: { zh: '受访者画像字段', en: 'Participant profile fields' },
  showcaseInterviewProfile: { zh: '受访者画像', en: 'Participant profile' },
  showcaseInterviewTranscript: { zh: '访谈对话', en: 'Transcript' },
  showcaseInterviewSynthesis: { zh: '访谈洞察', en: 'Interview insights' },
  showcaseStated: { zh: 'Stated · 受访者明确表达', en: 'Stated · explicitly said' },
  showcaseRevealed: { zh: 'Revealed · AI 从对话推断', en: 'Revealed · inferred by AI' },
  showcaseThemes: { zh: '主题', en: 'Themes' },
  showcaseContradictions: { zh: '内部矛盾点', en: 'Internal contradictions' },
  showcaseKeyInsights: { zh: '关键洞察', en: 'Key insights' },
  showcaseCommonThemes: { zh: '跨样本共同主题', en: 'Common themes across samples' },
  showcaseDivergent: { zh: '分歧观点', en: 'Divergent views' },
  showcaseFindings: { zh: '关键发现', en: 'Key findings' },
  showcaseImplications: { zh: '产品/研究含义', en: 'Product & research implications' },
  showcaseBottomLine: { zh: '一句话结论', en: 'Bottom line' },
  showcaseAiTurn: { zh: '听见', en: 'Listen' },
  showcaseUserTurn: { zh: '受访者', en: 'Participant' },
  showcaseFrequency: { zh: '出现次数', en: 'frequency' },
  showcaseQuotes: { zh: '代表性引用', en: 'Representative quotes' },
  showcaseBackHome: { zh: '返回首页', en: 'Back to home' },
  showcaseEnterAdmin: { zh: '进入研究员后台', en: 'Enter researcher console' },
  showcaseEvidence: { zh: '关键证据', en: 'Key evidence' },

  // 首页 hero 下方评审指引卡片
  reviewerGuideLabel: { zh: '评审专用', en: 'For reviewers' },
  reviewerGuideTitle: {
    zh: '推荐先开「查看示例洞察」看完产品交付',
    en: 'Start with “View Sample Insights” for the full product output',
  },
  reviewerGuideBody: {
    zh: '示例洞察页免登录,三个 Tab 看完即是一次完整评审。若需跳测完整后台体验(创建研究 / 生成参与者链接),请使用以下临时密码:',
    en: 'The Sample Insights page needs no login—the three tabs are the full review. To explore the researcher console (create studies, generate participant links), use the temporary password below:',
  },
  reviewerGuidePasswordLabel: { zh: '临时评审密码', en: 'Temporary review password' },
  reviewerGuideCopy: { zh: '复制', en: 'Copy' },
  reviewerGuideCopied: { zh: '已复制', en: 'Copied' },

  // 品牌 header 右侧源码入口
  sourceRepoLabel: { zh: 'GitHub 仓库', en: 'GitHub' },
} as const;

export type TranslationKey = keyof typeof t;

/**
 * 翻译函数
 * 默认 locale 为 'zh'。在 server 环境也可用。
 */
export function tr(key: TranslationKey, locale: Locale = DEFAULT_LOCALE): string {
  const entry = t[key];
  if (!entry) return key;
  return entry[locale] ?? entry.zh ?? key;
}

/** 切换 locale */
export function toggleLocale(current: Locale): Locale {
  return current === 'zh' ? 'en' : 'zh';
}
