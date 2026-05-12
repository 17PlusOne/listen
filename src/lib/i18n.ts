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

  // 页脚
  footerCopyright: {
    zh: '© 2026 听见 Listen · 一个让你听见 500 个创作者的工作台',
    en: '© 2026 Listen · A workspace to hear 500 creators',
  },
  footerNote: {
    zh: '所有访谈数据加密保存于研究员服务器。AI 提供商不持久化保留对话内容。',
    en: 'All interview data is encrypted on the researcher\'s server. AI providers do not retain conversations.',
  },
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
