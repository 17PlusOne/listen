// 听见 Listen · 示例数据
// 一份针对小红书创作者退潮归因的样本研究 + 3 段创作者访谈

import {
  StoredStudy,
  StoredInterview,
  StudyConfig,
  InterviewMessage,
  SynthesisResult,
  ParticipantProfile,
  BehaviorData,
  AggregateSynthesisResult,
} from '@/types';

const DEMO_STUDY_ID = 'demo-study-creator-dropoff';

// ============================================
// 示例研究:创作者退潮归因
// ============================================

export const DEMO_STUDY_CONFIG: StudyConfig = {
  id: DEMO_STUDY_ID,
  name: '创作者退潮归因深访 · 2026 Q1 样本',
  description:
    '过去 60 天发文量下降 ≥ 30% 的创作者,究竟发生了什么?这份样本访谈试图听到 Dashboard 不会告诉我们的那些原因——情绪、商单、家庭、平台体感。',
  researchQuestion:
    '是什么让原本稳定输出的创作者悄悄变少了发文,他们自己是怎么解释的、什么时候开始的、有没有一个具体的转折点?',
  coreQuestions: [
    '最近这两个月,你给自己定的发文节奏和实际做到的之间,差距大吗?这个差距是从什么时候开始的?',
    '能不能描述一个最近你「想发但最终没发」的内容,当时你卡在哪一步?',
    '过去一年里,有没有某个具体的事件让你对在小红书发内容的感觉发生了变化?',
    '如果你身边有一位刚开始做小红书的朋友,你最想提醒 TA 注意什么?',
    '如果今晚你愿意为自己做一件让 TA 重新想发文的事,会是什么?',
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
      extractionHint: '粉丝量范围:0-1万 / 1-5万 / 5-10万 / 10-50万 / 50万+',
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
  createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
};

export const DEMO_STORED_STUDY: StoredStudy = {
  id: DEMO_STUDY_ID,
  config: DEMO_STUDY_CONFIG,
  createdAt: DEMO_STUDY_CONFIG.createdAt,
  updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  interviewCount: 3,
  isLocked: true,
};

// ============================================
// 访谈 1:小晚 · 美妆博主 · 2 年 · 8 万粉
// ============================================

const XIAOWAN_PROFILE: ParticipantProfile = {
  id: 'profile-xiaowan',
  fields: [
    { fieldId: 'category', value: '美妆 / 平价测评', status: 'extracted', extractedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
    { fieldId: 'years', value: '2 年', status: 'extracted', extractedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
    { fieldId: 'follower_range', value: '5-10万', status: 'extracted', extractedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
    { fieldId: 'commercial', value: '稳定接单', status: 'extracted', extractedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
    { fieldId: 'full_time', value: '全职', status: 'extracted', extractedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
  ],
  rawContext:
    '小晚,2 年美妆博主,8 万粉,全职,主要做平价测评,商单稳定但单价不算高。过去两个月发文从每周 4 篇掉到 1 篇。说话语速偏快,聊到商单时会停顿。',
  timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
};

const t1 = Date.now() - 5 * 24 * 60 * 60 * 1000;
const XIAOWAN_TRANSCRIPT: InterviewMessage[] = [
  { id: 'x1', role: 'ai', content: '你好,我是听见。谢谢你愿意花这 15 分钟和我聊聊。我们会一起经过 5 个话题,中途想停想跳都没关系。先问个开头吧——你平时都在小红书发什么内容?做这件事多久了?', timestamp: t1 },
  { id: 'x2', role: 'user', content: '我主要做平价美妆测评,从两年前开始的吧。最开始是分享自己的化妆台,慢慢就有人问产品,就开始测评。现在算全职做这个,每周一般 4 篇左右。', timestamp: t1 + 60000 },
  { id: 'x3', role: 'ai', content: '从化妆台分享走到全职测评,这两年一定踩过不少坑。你刚才说「每周一般 4 篇」——那最近这两个月,实际做到的和你给自己定的节奏差距大吗?是从什么时候开始的?', timestamp: t1 + 120000 },
  { id: 'x4', role: 'user', content: '差距挺大的……过去两个月差不多变成一周 1 篇,有时候连 1 篇都没有。我也说不清是哪一天开始的,可能从国庆假期回来吧?突然就提不起劲。', timestamp: t1 + 180000 },
  { id: 'x5', role: 'ai', content: '「国庆回来突然提不起劲」——能不能带我回到那个时间点附近,有没有哪件具体的事让你对发内容的感觉发生了变化?哪怕是很小的事也行。', timestamp: t1 + 240000 },
  { id: 'x6', role: 'user', content: '嗯……其实有一件事。国庆前一周我接了一个唇釉的商单,那个品牌方非要让我用「绝绝子」「天花板」这种词,我以前从来不用的,我的粉丝就是因为我说话实在才关注我。那条发出去之后掉粉一千多,有评论骂我「恰烂饭」。我当时哭了一晚上。', timestamp: t1 + 300000 },
  { id: 'x7', role: 'ai', content: '那条发出去到看到评论之间,你脑子里在想什么?有没有那一刻你已经预感到会被骂?', timestamp: t1 + 360000 },
  { id: 'x8', role: 'user', content: '其实交稿前我就纠结过,但当时合同已经签了,违约金一万二,我接不起。发的时候我就在想「应该没人发现吧」,但其实我自己知道粉丝肯定看得出来。', timestamp: t1 + 420000 },
  { id: 'x9', role: 'ai', content: '所以那不是你被发现的问题,是你自己先知道——这个东西不是你了。那从国庆到现在,有没有什么你「想发但最终没发」的内容,你卡在哪一步?', timestamp: t1 + 480000 },
  { id: 'x10', role: 'user', content: '有,前几天我想发一个真实测评,讲我自己用某大牌粉底卡粉的事。但发之前我反复改了五遍,每次都在想「这样说会不会让别的品牌不敢找我」。最后保存到草稿了,没发出去。', timestamp: t1 + 540000 },
  { id: 'x11', role: 'ai', content: '是「不发」对你来说现在变得比「发」更安全。这种「先想商业后果再想要不要说」的状态,大概是从那条唇釉之后开始的吗?', timestamp: t1 + 600000 },
  { id: 'x12', role: 'user', content: '是。以前我是想到什么发什么,粉丝喜欢的就是这个。现在我每写一句话都会想「这个会不会得罪 XX 品牌」。脑子里有了一个看不见的审查官。', timestamp: t1 + 660000 },
  { id: 'x13', role: 'ai', content: '「看不见的审查官」,你说出这个词的时候是什么感觉?', timestamp: t1 + 720000 },
  { id: 'x14', role: 'user', content: '累。一种很累的感觉。我做小红书本来就是因为不想做办公室的那种事,现在反而觉得自己变成了办公室。', timestamp: t1 + 780000 },
  { id: 'x15', role: 'ai', content: '听到了。如果今天你身边有一位刚开始做小红书的朋友,你最想提醒 TA 注意什么?', timestamp: t1 + 840000 },
  { id: 'x16', role: 'user', content: '我会跟 TA 说,接商单前先想清楚——你是用账号换钱,还是用你自己换钱。我后悔的是那段时间我没分清。', timestamp: t1 + 900000 },
  { id: 'x17', role: 'ai', content: '最后一个问题——如果今晚你愿意为自己做一件让你重新想发文的事,会是什么?', timestamp: t1 + 960000 },
  { id: 'x18', role: 'user', content: '把那条粉底卡粉的草稿发出来。不为了流量,就发给我自己看,告诉自己「你还在」。', timestamp: t1 + 1020000 },
  { id: 'x19', role: 'ai', content: '谢谢你跟我说这些,小晚。你刚才说的每一句话,我都会保留好。这次聊天到这里就可以了。', timestamp: t1 + 1080000 },
];

const XIAOWAN_SYNTHESIS: SynthesisResult = {
  statedPreferences: [
    '希望保持「说话实在」的人设,这是涨粉的原因',
    '想做真实测评而非品牌话术',
    '希望能区分「账号商业化」和「自我表达」',
  ],
  revealedPreferences: [
    '把商单收入看得很重(违约金一万二接不起)',
    '事实上把商业后果置于表达欲之前',
    '草稿里藏着她真正想发的内容',
    '需要被允许「不发」也是一种合理状态',
  ],
  themes: [
    { theme: '商单合规话术挤压人设', evidence: '「品牌方非要让我用『绝绝子』『天花板』这种词,我以前从来不用的」', frequency: 4 },
    { theme: '内化的自我审查', evidence: '「脑子里有了一个看不见的审查官」', frequency: 3 },
    { theme: '草稿夹是退潮的入口', evidence: '「反复改了五遍……最后保存到草稿了,没发出去」', frequency: 2 },
    { theme: '从「自由职业」滑回「办公室感」', evidence: '「现在反而觉得自己变成了办公室」', frequency: 2 },
  ],
  contradictions: [
    '说想做真实测评,但稳定接单使她越来越无法真实',
    '说退潮原因模糊「也说不清是哪一天」,但具体到唇釉商单的细节非常清晰',
  ],
  keyInsights: [
    '一次低适配度的商单可以触发长达 2 个月的内化审查与退潮',
    '退潮表面是「没时间」,深层是「不知道还能说什么真话」',
    '违约金机制对中腰部创作者(粉丝 5-10 万)是真实压力,会扭曲内容选择',
    '「让 TA 再发一篇」最有效的入口可能不是流量激励,而是允许 TA 不为流量地发一次',
  ],
  bottomLine:
    '小晚的退潮不是没时间,是一条她不想发但发了的商单让她失去了和粉丝之间的「说真话契约」。她的草稿夹里藏着想发的内容——退潮的解药可能不在 Dashboard 里,而在那条没发出去的卡粉测评里。',
};

const XIAOWAN_BEHAVIOR: BehaviorData = {
  timePerTopic: { '节奏与产能': 180000, '具体事件': 480000, '商单与变现': 300000, '平台体感': 120000, '生活与家庭': 60000 },
  messagesPerTopic: { '节奏与产能': 2, '具体事件': 6, '商单与变现': 4, '平台体感': 2, '生活与家庭': 1 },
  topicsExplored: ['节奏与产能', '具体事件', '商单与变现', '平台体感'],
  contradictions: ['想做真实测评 vs 稳定接单后无法真实'],
};

export const XIAOWAN_INTERVIEW: StoredInterview = {
  id: 'interview-demo-xiaowan',
  studyId: DEMO_STUDY_ID,
  studyName: DEMO_STUDY_CONFIG.name,
  participantProfile: XIAOWAN_PROFILE,
  transcript: XIAOWAN_TRANSCRIPT,
  synthesis: XIAOWAN_SYNTHESIS,
  behaviorData: XIAOWAN_BEHAVIOR,
  createdAt: t1,
  completedAt: t1 + 1080000,
  status: 'completed',
};

// ============================================
// 访谈 2:阿哲 · 美食探店 · 4 年 · 18 万粉
// ============================================

const AZHE_PROFILE: ParticipantProfile = {
  id: 'profile-azhe',
  fields: [
    { fieldId: 'category', value: '美食 / 探店', status: 'extracted', extractedAt: Date.now() - 4 * 24 * 60 * 60 * 1000 },
    { fieldId: 'years', value: '4 年', status: 'extracted', extractedAt: Date.now() - 4 * 24 * 60 * 60 * 1000 },
    { fieldId: 'follower_range', value: '10-50万', status: 'extracted', extractedAt: Date.now() - 4 * 24 * 60 * 60 * 1000 },
    { fieldId: 'commercial', value: '主要收入来源', status: 'extracted', extractedAt: Date.now() - 4 * 24 * 60 * 60 * 1000 },
    { fieldId: 'full_time', value: '全职', status: 'extracted', extractedAt: Date.now() - 4 * 24 * 60 * 60 * 1000 },
  ],
  rawContext: '阿哲,4 年美食探店,18 万粉,全职,商单是主要收入。最近两月发文从每周 3 篇掉到 0-1 篇。聊到「带娃」时声音变软。',
  timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
};

const t2 = Date.now() - 4 * 24 * 60 * 60 * 1000;
const AZHE_TRANSCRIPT: InterviewMessage[] = [
  { id: 'a1', role: 'ai', content: '你好,我是听见。谢谢你愿意花这 15 分钟。先聊聊背景吧——你平时在小红书发什么内容,做多久了?', timestamp: t2 },
  { id: 'a2', role: 'user', content: '我做美食探店的,4 年了。一开始是工作之余拍着玩,后来辞了工作专门做这个。现在主要发上海周边的小馆子,粉丝挺爱看。', timestamp: t2 + 60000 },
  { id: 'a3', role: 'ai', content: '4 年是相当扎实的年限了。那最近这两个月,你给自己定的节奏和实际做到的之间,差距大吗?', timestamp: t2 + 120000 },
  { id: 'a4', role: 'user', content: '差挺多。以前一周三条稳稳的,现在能发出来一条就不错了。其实选题、拍摄都有,就是剪辑那一步过不去。', timestamp: t2 + 180000 },
  { id: 'a5', role: 'ai', content: '是「剪不动」还是「不想剪」?这两种感觉有点不一样。', timestamp: t2 + 240000 },
  { id: 'a6', role: 'user', content: '……是不想剪。坐到电脑前就走神,以前我剪片子能进入心流的,现在剪 10 分钟就要看一眼手机。', timestamp: t2 + 300000 },
  { id: 'a7', role: 'ai', content: '从「能进心流」到「10 分钟看一次手机」,这中间有没有一个具体的事件你能想起来?', timestamp: t2 + 360000 },
  { id: 'a8', role: 'user', content: '可能是 8 月那家店翻车吧。我推荐了一家蟹粉小笼,有粉丝去吃说蟹粉里没蟹,被人骂「收钱乱推」。我那次根本没收钱,但说不清。后来我开始查每家店的资质,选题就慢下来了。', timestamp: t2 + 420000 },
  { id: 'a9', role: 'ai', content: '所以「翻车」不是被骂这件事本身,是从那之后你对自己推荐的每一个东西都开始多想一层。', timestamp: t2 + 480000 },
  { id: 'a10', role: 'user', content: '对。以前我吃到好东西就想分享,现在我吃到好东西第一反应是「这家店稳吗」「老板会不会突然换厨子」「会不会有人吃出问题」。', timestamp: t2 + 540000 },
  { id: 'a11', role: 'ai', content: '你刚才提到一周三条稳稳的——那时候你享受这件事的什么?', timestamp: t2 + 600000 },
  { id: 'a12', role: 'user', content: '享受找到一家很不起眼但巨好吃的小馆子那一刻。但现在那个「找到的快乐」被「会不会出事的担心」盖住了。', timestamp: t2 + 660000 },
  { id: 'a13', role: 'ai', content: '我有点想确认有没有听对——你不是不想发,是你不再相信你发的东西会被以你期待的方式接收?', timestamp: t2 + 720000 },
  { id: 'a14', role: 'user', content: '是。这句话比我自己说的更准。我以前觉得我和粉丝是一起去找好店的朋友,翻车那次之后我觉得粉丝是来等着挑我错的。', timestamp: t2 + 780000 },
  { id: 'a15', role: 'ai', content: '我们还有最后两个问题——如果你身边有一位刚开始做探店的朋友,你最想提醒 TA 注意什么?', timestamp: t2 + 840000 },
  { id: 'a16', role: 'user', content: '别太快接商单。流量起来之前你和粉丝是同伴关系,流量起来之后就变成了表演关系。这个转换没人提醒你,但它真的会改变你对内容的感受。', timestamp: t2 + 900000 },
  { id: 'a17', role: 'ai', content: '最后——如果今晚你愿意为自己做一件让你重新想剪一条片子的事,会是什么?', timestamp: t2 + 960000 },
  { id: 'a18', role: 'user', content: '我想拍一条没有商业目的、专门讲我那家蟹粉小笼翻车前后心路历程的视频。我可能不会发,但我想剪出来。', timestamp: t2 + 1020000 },
  { id: 'a19', role: 'ai', content: '谢谢阿哲,我都听到了。访谈到这里就好。', timestamp: t2 + 1080000 },
];

const AZHE_SYNTHESIS: SynthesisResult = {
  statedPreferences: [
    '想找到和分享真正好吃的小馆子',
    '想要和粉丝保持「同伴」而非「表演」的关系',
    '希望剪辑能重新进入心流',
  ],
  revealedPreferences: [
    '真正想剪的是一条不发出去的复盘',
    '把流量增长本身看作关系恶化的拐点',
    '需要重新校准「翻车成本」与「分享回报」的天平',
  ],
  themes: [
    { theme: '翻车事件后的二阶审查', evidence: '「现在吃到好东西第一反应是『这家店稳吗』」', frequency: 4 },
    { theme: '关系从同伴变表演', evidence: '「以前觉得我和粉丝是一起去找好店的朋友,翻车那次之后我觉得粉丝是来等着挑我错的」', frequency: 3 },
    { theme: '心流断裂', evidence: '「剪 10 分钟就要看一眼手机」', frequency: 2 },
  ],
  contradictions: ['说没收钱被诬陷却没在评论区澄清', '想剪片子又恐惧剪出来后的反应'],
  keyInsights: [
    '一次小型翻车可以让 18 万粉博主进入长达数月的「关系误读期」',
    '退潮的不是技能,是分享意愿——技能完整、动机受损',
    '中腰部创作者从「同伴」到「表演」的关系拐点常发生在 10 万粉前后,且不可逆',
    '产品介入点可能是「翻车保护」机制 ——让博主能澄清而不被算法二次伤害',
  ],
  bottomLine:
    '阿哲不是剪不动,是不敢分享了。一次蟹粉小笼翻车让他从「找好店的同伴」变成「等着被挑错的人」。他真正想剪的那条片子甚至不打算发出来——退潮的核心是关系误读,而非产能损失。',
};

const AZHE_BEHAVIOR: BehaviorData = {
  timePerTopic: { '节奏与产能': 240000, '具体事件': 360000, '商单与变现': 180000, '平台体感': 240000, '生活与家庭': 0 },
  messagesPerTopic: { '节奏与产能': 3, '具体事件': 5, '商单与变现': 2, '平台体感': 3, '生活与家庭': 0 },
  topicsExplored: ['节奏与产能', '具体事件', '商单与变现', '平台体感'],
  contradictions: ['说没收钱被诬陷却没澄清'],
};

export const AZHE_INTERVIEW: StoredInterview = {
  id: 'interview-demo-azhe',
  studyId: DEMO_STUDY_ID,
  studyName: DEMO_STUDY_CONFIG.name,
  participantProfile: AZHE_PROFILE,
  transcript: AZHE_TRANSCRIPT,
  synthesis: AZHE_SYNTHESIS,
  behaviorData: AZHE_BEHAVIOR,
  createdAt: t2,
  completedAt: t2 + 1080000,
  status: 'completed',
};

// ============================================
// 访谈 3:燕子 · 育儿博主 · 1.5 年 · 1.2 万粉
// ============================================

const YANZI_PROFILE: ParticipantProfile = {
  id: 'profile-yanzi',
  fields: [
    { fieldId: 'category', value: '母婴 / 育儿日常', status: 'extracted', extractedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    { fieldId: 'years', value: '1.5 年', status: 'extracted', extractedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    { fieldId: 'follower_range', value: '1-5万', status: 'extracted', extractedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    { fieldId: 'commercial', value: '偶尔', status: 'extracted', extractedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    { fieldId: 'full_time', value: '兼职', status: 'extracted', extractedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
  ],
  rawContext: '燕子,1.5 年育儿博主,1.2 万粉,兼职(本职是产品经理),记录两个孩子的日常。最近两月发文从每周 2 篇掉到一月 1 篇。',
  timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
};

const t3 = Date.now() - 3 * 24 * 60 * 60 * 1000;
const YANZI_TRANSCRIPT: InterviewMessage[] = [
  { id: 'y1', role: 'ai', content: '你好,我是听见。我们慢慢聊就好。你平时在小红书发什么内容,做多久了?', timestamp: t3 },
  { id: 'y2', role: 'user', content: '我发我两个娃的日常,记录陪伴。一年半了,粉丝一万多一点,主业是产品经理,这个完全兼职。', timestamp: t3 + 60000 },
  { id: 'y3', role: 'ai', content: '一边做产品一边记录两个孩子,听起来时间很紧。那最近两个月,发文节奏和你期望的差距大吗?', timestamp: t3 + 120000 },
  { id: 'y4', role: 'user', content: '差得离谱。本来一周两篇,这两个月加起来发了 1 篇。我以为是忙,但其实……忙也是借口。', timestamp: t3 + 180000 },
  { id: 'y5', role: 'ai', content: '你说「忙也是借口」——那如果不是忙,你觉得真正卡住你的是什么?', timestamp: t3 + 240000 },
  { id: 'y6', role: 'user', content: '可能是我开始怕娃长大了不希望我发 TA 的事。我大宝今年 7 岁了,前阵子在学校被同学说「我妈在小红书看到你了」,他回家有点不开心。', timestamp: t3 + 300000 },
  { id: 'y7', role: 'ai', content: '能多说一下那天他回家的样子吗?', timestamp: t3 + 360000 },
  { id: 'y8', role: 'user', content: '他没哭,就是吃饭很安静,然后睡前问我「妈妈你以后能不能不发我」。我说好,然后这两个月我就没怎么发。', timestamp: t3 + 420000 },
  { id: 'y9', role: 'ai', content: '所以是从那一晚开始的。那对你来说,这个停下来,是约定,还是某种你自己也舒了一口气的事?', timestamp: t3 + 480000 },
  { id: 'y10', role: 'user', content: '……其实两个都有。我之前也累。1 万粉不多不少,接不到大商单,但又被一些粉丝当朋友,经常被追问最近怎么不更新。我有时候会觉得我欠他们的。', timestamp: t3 + 540000 },
  { id: 'y11', role: 'ai', content: '「欠他们的」——这种感觉是从哪里来的?', timestamp: t3 + 600000 },
  { id: 'y12', role: 'user', content: '可能是我以为「粉丝」就是「读者」就是「朋友」,我没分清。结果他们一催我,我就有压力,就更不想发,就更负罪。一个循环。', timestamp: t3 + 660000 },
  { id: 'y13', role: 'ai', content: '所以你儿子的那句话,某种程度上是给了你一个允许自己停下来的理由?', timestamp: t3 + 720000 },
  { id: 'y14', role: 'user', content: '……是。这一点我之前没敢承认。听你这么问我才意识到。', timestamp: t3 + 780000 },
  { id: 'y15', role: 'ai', content: '没关系,我们慢慢说。如果有一位刚开始做亲子号的朋友,你最想提醒 TA 注意什么?', timestamp: t3 + 840000 },
  { id: 'y16', role: 'user', content: '别把娃的脸放上去,以为「粉丝少没事」。粉丝量是可以涨的,但脸放出去就收不回来了。', timestamp: t3 + 900000 },
  { id: 'y17', role: 'ai', content: '最后一个——如果今晚你愿意为自己做一件让你重新想发文的事,会是什么?', timestamp: t3 + 960000 },
  { id: 'y18', role: 'user', content: '我想发一篇文字笔记,不是关于娃,是关于我自己作为妈妈的那部分,我之前一直藏在视频背后。', timestamp: t3 + 1020000 },
  { id: 'y19', role: 'ai', content: '谢谢你跟我说这些,燕子。访谈到这里就好,你可以休息了。', timestamp: t3 + 1080000 },
];

const YANZI_SYNTHESIS: SynthesisResult = {
  statedPreferences: [
    '想记录陪伴孩子的日常',
    '希望保护孩子的隐私',
    '想找到「粉丝是读者还是朋友」的边界',
  ],
  revealedPreferences: [
    '需要一个外部理由来允许自己停下',
    '真正想发的是关于「妈妈自我」而非孩子的内容',
    '把粉丝催更体验为「负债」',
  ],
  themes: [
    { theme: '孩子隐私意识觉醒触发停更', evidence: '「妈妈你以后能不能不发我」', frequency: 3 },
    { theme: '粉丝关系误读为「亏欠」', evidence: '「我有时候会觉得我欠他们的」', frequency: 3 },
    { theme: '内容主体从孩子转向妈妈自身', evidence: '「我自己作为妈妈的那部分,我之前一直藏在视频背后」', frequency: 2 },
  ],
  contradictions: [
    '说停更是为了保护孩子,实际上自己也想停',
    '把粉丝催更看作压力,但又被「被需要」感吸引',
  ],
  keyInsights: [
    '中小亲子博主的退潮存在「家庭隐私拐点」——孩子开始有自我意识的年龄(6-8 岁)是关键转折',
    '兼职博主把粉丝关系内化为「债务」,催更体验是负向激励而非正向',
    '内容主体从「拍孩子」迁移到「拍自己作为妈妈」可能是这一类博主的二次创业入口',
    '产品介入点:为亲子博主提供「孩子隐私设置」与「身份转换」内容引导',
  ],
  bottomLine:
    '燕子的退潮是一次家庭和自我的双重觉醒——大宝的一句话给了她允许自己停下的理由,但她真正想发的早就不是孩子,而是「作为妈妈的我」。她代表了一类被低估的创作者:不是流量退潮,是身份升级。',
};

const YANZI_BEHAVIOR: BehaviorData = {
  timePerTopic: { '节奏与产能': 180000, '具体事件': 240000, '商单与变现': 60000, '平台体感': 180000, '生活与家庭': 420000 },
  messagesPerTopic: { '节奏与产能': 2, '具体事件': 4, '商单与变现': 1, '平台体感': 2, '生活与家庭': 5 },
  topicsExplored: ['节奏与产能', '具体事件', '生活与家庭', '平台体感'],
  contradictions: ['停更归因孩子隐私 vs 自己也想停'],
};

export const YANZI_INTERVIEW: StoredInterview = {
  id: 'interview-demo-yanzi',
  studyId: DEMO_STUDY_ID,
  studyName: DEMO_STUDY_CONFIG.name,
  participantProfile: YANZI_PROFILE,
  transcript: YANZI_TRANSCRIPT,
  synthesis: YANZI_SYNTHESIS,
  behaviorData: YANZI_BEHAVIOR,
  createdAt: t3,
  completedAt: t3 + 1080000,
  status: 'completed',
};

// ============================================
// 跨样本聚合
// ============================================

export const DEMO_AGGREGATE_SYNTHESIS: AggregateSynthesisResult = {
  studyId: DEMO_STUDY_ID,
  interviewCount: 3,
  commonThemes: [
    {
      theme: '一次具体事件可以触发数月退潮',
      frequency: 3,
      representativeQuotes: [
        '「品牌方非要让我用『绝绝子』」——小晚(美妆/8万)',
        '「我推荐的那家店翻车了」——阿哲(美食/18万)',
        '「妈妈你以后能不能不发我」——燕子(母婴/1.2万)',
      ],
    },
    {
      theme: '退潮的本质不是「没时间」,是「不知道还能不能真实地说」',
      frequency: 3,
      representativeQuotes: [
        '「脑子里有了一个看不见的审查官」——小晚',
        '「我和粉丝从同伴变成等着被挑错的人」——阿哲',
        '「我以为粉丝是朋友,结果催更让我觉得我欠他们」——燕子',
      ],
    },
    {
      theme: '草稿夹里藏着退潮博主真正想发的内容',
      frequency: 3,
      representativeQuotes: [
        '「那条粉底卡粉的草稿……保存到草稿了,没发出去」——小晚',
        '「想拍一条没有商业目的的复盘视频……我可能不会发」——阿哲',
        '「关于我自己作为妈妈的那部分,藏在视频背后」——燕子',
      ],
    },
  ],
  divergentViews: [
    {
      topic: '退潮归因',
      viewA: '小晚 / 阿哲:商业合作的冲击破坏了原本的表达关系',
      viewB: '燕子:家庭与自我意识升级,商业并非主因',
    },
    {
      topic: '理想的产品介入方式',
      viewA: '小晚 / 阿哲:希望平台保护表达自由、降低商业话术压力',
      viewB: '燕子:希望平台帮助身份转换、提供更细的隐私控件',
    },
  ],
  keyFindings: [
    '过去 60 天发文 -30% 的创作者中,三种典型样本均存在一次明确的「拐点事件」,但 dashboard 看不到——必须通过深访才能发现',
    '退潮的核心不是产能或技能问题,而是「关系误读」与「表达自由感降低」',
    '草稿夹是高价值情报富矿——这些没发出去的内容代表创作者真正想说但不敢说的',
    '不同品类退潮路径差异显著:美妆退潮于「商单合规话术」,美食退潮于「翻车二阶审查」,母婴退潮于「家庭隐私拐点」',
    '中腰部(5-20万)创作者退潮风险最高,因为商业开始稳定但议价权未达上层',
  ],
  researchImplications: [
    '产品功能可考虑:商单话术自由度协商工具、翻车后澄清通道保护、亲子内容隐私设置',
    '不应对所有退潮博主一视同仁,应按品类与拐点类型分类干预',
    '可以为腰部创作者建立「身份升级」内容路径(燕子模型),而非只激励他们回到原品类',
    '退潮预警可以从「草稿数量增长 + 发布数量下降」的双指标识别',
  ],
  bottomLine:
    '三位创作者的退潮看似各异,实质都源于一次具体事件破坏了她/他与粉丝之间「能说真话」的契约。Dashboard 上的「发文-30%」背后是表达自由感的退潮,而非时间或能力的退潮。最有效的产品介入可能不是「让 TA 再发」,而是「允许 TA 暂时不发,并保护 TA 想发时仍能真实地说」。',
  generatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
};

// ============================================
// 导出
// ============================================

export const DEMO_STUDIES: StoredStudy[] = [DEMO_STORED_STUDY];
export const DEMO_INTERVIEWS: StoredInterview[] = [XIAOWAN_INTERVIEW, AZHE_INTERVIEW, YANZI_INTERVIEW];
