// 听见 Listen · 研究模板
// 三大开箱即用的创作者经济访谈模板。
// 每个模板都对齐了访谈员「听见」的第三层追问铁律,并预设了 profileSchema/topicAreas/consent。
// 选用时:在 StudySetup 页通过 ?template=<id> 进入,即可自动填充全部字段。

import type { StudyConfig } from '@/types';

export type StudyTemplate = Omit<StudyConfig, 'id' | 'createdAt'> & {
  templateId: string;
  category: 'commercial' | 'retention' | 'onboarding';
  tagline: { zh: string; en: string };
};

// ============================================
// 模板 1:商单决策深访
// 目标:把模糊的「看情况」追问到具体的判断逻辑
// ============================================
export const TEMPLATE_BRAND_DEAL: StudyTemplate = {
  templateId: 'brand-deal-decision',
  category: 'commercial',
  tagline: {
    zh: '为什么接 / 拒绝这一单 —— 把模糊的「看情况」追到第三层',
    en: 'Why accept or reject this deal — push “it depends” down to the third layer',
  },
  name: '商单决策深访 · 创作者接单逻辑',
  description:
    '同样的预算、相似的品牌,有人接、有人拒。这份访谈试图听到 brief 之外的判断:粉丝信任、过往翻车、人设边界、报价底线 —— 创作者真正在权衡的东西。',
  researchQuestion:
    '当一份商单递到创作者面前,他们脑内会经过怎样一连串的判断?哪些是显性的(报价/品类),哪些是隐性的(信任成本/人设损耗/翻车记忆)?最近接过和拒过的具体案例分别揭示了什么?',
  coreQuestions: [
    '最近一次让你比较纠结的商单,从看到 brief 到最终决定,中间经过了哪些环节?具体卡在了哪一步?',
    '上一次你直接拒掉的商单是什么样的?如果对方把报价翻倍,你会接吗?为什么?',
    '在你心里有没有一条「这种品我无论如何不接」的隐形线?这条线是怎么形成的?有没有一个具体事件让它出现的?',
    '当一条恰饭内容发出去之后的 24 小时内,你最担心评论区出现什么?具体说说你印象最深的一次?',
    '如果让你给同品类还没接过商单的新创作者一句话提醒,你会说什么?',
  ],
  topicAreas: [
    '决策流程',
    '隐形红线',
    '报价与信任权衡',
    '翻车记忆',
    '人设损耗体感',
    '复盘机制',
  ],
  profileSchema: [
    {
      id: 'category',
      label: '创作品类',
      extractionHint: '主要内容方向(美妆、美食、母婴、穿搭、家居、宠物、数码等)',
      required: true,
    },
    {
      id: 'follower_range',
      label: '粉丝量级',
      extractionHint: '粉丝量大致区间',
      required: true,
      options: ['0-1万', '1-5万', '5-10万', '10-50万', '50万+'],
    },
    {
      id: 'deal_frequency',
      label: '商单频次',
      extractionHint: '过去 6 个月平均每月接单数量',
      required: true,
      options: ['几乎没有', '1-2 单', '3-5 单', '6-10 单', '10+'],
    },
    {
      id: 'income_share',
      label: '商单收入占比',
      extractionHint: '商单在总收入中的占比',
      required: false,
      options: ['<30%', '30-60%', '60-90%', '>90%'],
    },
    {
      id: 'has_agency',
      label: '是否有 MCN / 经纪人',
      extractionHint: '是否有第三方代为对接商单',
      required: false,
      options: ['完全自己接', '部分代接', '全部由 MCN 对接'],
    },
  ],
  aiBehavior: 'exploratory',
  aiProvider: 'gemini',
  enableReasoning: true,
  consentText:
    '这次聊天是为了帮研究员理解创作者在商单决策上的真实考量,你说的话会加密保存,不会公开、不会被关联到你的账号、不会用于平台算法判断。聊天时长大约 15-20 分钟,任何具体品牌名或金额你都可以选择跳过或用代号。',
};

// ============================================
// 模板 2:创作者退潮归因
// 目标:听 Dashboard 不会告诉我们的那些原因 —— 情绪、商单、家庭、平台体感
// 本模板与 DEMO_STUDY_CONFIG 共享结构,作为研究员的开箱样本
// ============================================
export const TEMPLATE_DROPOFF: StudyTemplate = {
  templateId: 'creator-dropoff',
  category: 'retention',
  tagline: {
    zh: '过去 60 天发文量下降的人,究竟发生了什么',
    en: 'What actually happened to the creators who posted less in the past 60 days',
  },
  name: '创作者退潮归因深访',
  description:
    '发文量下降 ≥ 30% 的创作者,他们的 Dashboard 数据是冷的,但故事是热的。这份访谈试图听到:从某个具体时刻开始,他们对发内容这件事的感觉发生了什么变化。',
  researchQuestion:
    '是什么让原本稳定输出的创作者悄悄变少了发文?他们自己是怎么解释的?什么时候开始的?有没有一个具体的转折点(翻车、家庭变化、商单冲突、平台改版)?',
  coreQuestions: [
    '最近这两个月,你给自己定的发文节奏和实际做到的之间,差距大吗?这个差距是从什么时候开始的?',
    '能不能描述一个最近你「想发但最终没发」的内容,当时你卡在哪一步?是题选不出来、还是拍完不想剪、还是剪完不敢发?',
    '过去一年里,有没有某个具体的事件让你对在小红书发内容的感觉发生了变化?那一刻之前和之后,你看待这件事的方式有什么不同?',
    '如果你身边有一位刚开始做小红书的朋友,你最想提醒 TA 注意什么?',
    '如果今晚你愿意为自己做一件让自己重新想发文的事,会是什么?',
  ],
  topicAreas: ['节奏与产能', '具体事件', '商单与变现', '平台体感', '生活与家庭'],
  profileSchema: [
    {
      id: 'category',
      label: '创作品类',
      extractionHint: '主要内容方向(美妆、美食、母婴、穿搭、宠物等)',
      required: true,
    },
    {
      id: 'years',
      label: '创作年限',
      extractionHint: '在小红书发布内容的时长',
      required: true,
    },
    {
      id: 'follower_range',
      label: '粉丝量级',
      extractionHint: '粉丝量范围',
      required: true,
      options: ['0-1万', '1-5万', '5-10万', '10-50万', '50万+'],
    },
    {
      id: 'commercial',
      label: '是否接过商单',
      extractionHint: '是否在小红书接过品牌合作或商业内容',
      required: false,
      options: ['从没接过', '偶尔', '稳定接单', '主要收入来源'],
    },
    {
      id: 'full_time',
      label: '是否全职做小红书',
      extractionHint: '是否把小红书作为主要职业',
      required: false,
      options: ['全职', '兼职', '业余'],
    },
  ],
  aiBehavior: 'exploratory',
  aiProvider: 'gemini',
  enableReasoning: true,
  consentText:
    '这次聊天是为了帮平台研究员理解创作者真实的体感,你说的话会加密保存,不会公开、不会被关联到你的账号、不会用于平台算法判断。聊天时长大约 15 分钟,任何你不想回答的问题都可以跳过。',
};

// ============================================
// 模板 3:新人扶持期望
// 目标:入驻 90 天内最影响留存的一次对话 / 一次推荐 / 一次失望
// ============================================
export const TEMPLATE_ONBOARDING: StudyTemplate = {
  templateId: 'new-creator-onboarding',
  category: 'onboarding',
  tagline: {
    zh: '入驻 90 天内最影响留存的那一次对话',
    en: 'The single interaction in the first 90 days that decided whether they stayed',
  },
  name: '新人扶持期望深访 · 入驻 90 天',
  description:
    '注册到第三个月,新创作者会经历一段非常脆弱的窗口期 —— 第一篇笔记的反馈、第一次被陌生人评论、第一次破百赞、第一次被推流、第一次掉粉。这份访谈试图捕捉那些「差一点就退场」的瞬间。',
  researchQuestion:
    '新创作者在入驻 90 天内,最影响他们留下来还是离开的,究竟是哪一类具体经历?平台、社区、算法、家人朋友这四个来源中,谁的反馈权重最高?他们最希望平台在哪个具体节点提供帮助?',
  coreQuestions: [
    '回忆一下你发出第一篇笔记之后的 24 小时,具体感受是什么?有没有点开后台超过五次?最希望看到什么?',
    '在最初的三个月里,有没有一个瞬间你认真考虑过「算了不发了」?那一刻具体发生了什么?最后是什么让你又发了下一篇?',
    '到目前为止,平台给过你最有帮助的一次提示或推送是什么?最让你失望或困惑的又是什么?',
    '如果让你给「正在注册小红书第一天的自己」录一段 30 秒的语音,你会说什么?',
    '如果平台明天可以为新创作者上线一个新功能,只能上线一个,你最希望是什么?',
  ],
  topicAreas: [
    '首篇笔记体感',
    '关键转折瞬间',
    '反馈来源权重',
    '平台帮助 vs 失望',
    '功能期望',
  ],
  profileSchema: [
    {
      id: 'days_since_join',
      label: '注册天数',
      extractionHint: '从注册到现在多少天',
      required: true,
      options: ['0-30 天', '30-60 天', '60-90 天', '90 天以上'],
    },
    {
      id: 'category',
      label: '创作品类',
      extractionHint: '想做的内容方向(美妆、美食、母婴、穿搭、宠物等)',
      required: true,
    },
    {
      id: 'note_count',
      label: '已发布笔记数',
      extractionHint: '迄今为止累计发布的笔记数量',
      required: true,
      options: ['0 篇(只注册没发)', '1-3 篇', '4-10 篇', '11-30 篇', '30+'],
    },
    {
      id: 'prior_platform',
      label: '是否有其他平台经验',
      extractionHint: '在小红书之前是否有抖音/B站/微博等内容平台的发布经验',
      required: false,
      options: ['完全新手', '其他平台少量发布', '其他平台资深创作者'],
    },
    {
      id: 'motivation',
      label: '入驻动机',
      extractionHint: '为什么选择来小红书发内容',
      required: false,
    },
  ],
  aiBehavior: 'exploratory',
  aiProvider: 'gemini',
  enableReasoning: true,
  consentText:
    '这次聊天是为了帮平台研究员理解新创作者入驻最初 90 天的真实体感,你说的话会加密保存,不会公开、不会被关联到你的账号、不会用于平台算法判断。聊天时长大约 15 分钟,任何你不想回答的问题都可以跳过。',
};

// ============================================
// 导出与查找
// ============================================
export const STUDY_TEMPLATES: StudyTemplate[] = [
  TEMPLATE_BRAND_DEAL,
  TEMPLATE_DROPOFF,
  TEMPLATE_ONBOARDING,
];

export function getTemplateById(id: string): StudyTemplate | undefined {
  return STUDY_TEMPLATES.find((t) => t.templateId === id);
}

/**
 * 将模板转换成 Partial<StudyConfig>,供 StudySetup 通过 sessionStorage 的
 * `prefillStudyConfig` 机制注入表单。
 */
export function templateToPrefill(template: StudyTemplate): Partial<StudyConfig> {
  // 剥离模板专属字段,只保留 StudyConfig 字段
  const { templateId: _t, category: _c, tagline: _tag, ...config } = template;
  return config;
}
