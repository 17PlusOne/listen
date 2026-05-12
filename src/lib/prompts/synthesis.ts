/**
 * 听见 Listen · 综合分析提示词
 *
 * 单访谈综合 + 多访谈聚合。
 * 双语支持。强调:
 *   - 区分 stated vs revealed
 *   - 指出第三层动机
 *   - 找到沉默处和矛盾点
 */

import {
  StudyConfig,
  ParticipantProfile,
  InterviewMessage,
  BehaviorData,
  SynthesisResult,
} from '@/types';

export type PromptLocale = 'zh' | 'en';

/**
 * 单次访谈综合 prompt
 */
export const buildSynthesisPrompt = (
  history: InterviewMessage[],
  studyConfig: StudyConfig,
  behaviorData: BehaviorData,
  participantProfile: ParticipantProfile | null,
  locale: PromptLocale = 'zh'
): string => {
  const interviewText = history
    .map((m) => {
      if (locale === 'zh') {
        return `${m.role === 'user' ? '受访者' : '听见'}: ${m.content}`;
      }
      return `${m.role === 'user' ? 'PARTICIPANT' : 'INTERVIEWER'}: ${m.content}`;
    })
    .join('\n\n');

  const profileSummary =
    participantProfile?.fields
      .filter((f) => f.status === 'extracted' && f.value)
      .map((f) => {
        const field = studyConfig.profileSchema.find((s) => s.id === f.fieldId);
        return `${field?.label || f.fieldId}: ${f.value}`;
      })
      .join('\n') ||
    (locale === 'zh' ? '无结构化背景数据' : 'No structured profile data');

  if (locale === 'zh') {
    return `你是「听见」的分析师助理。请把下面这一段访谈,综合成研究员真正能用的洞察。

【研究信息】
- 研究主题:${studyConfig.name}
- 研究问题:${studyConfig.researchQuestion}
- 探索话题:${studyConfig.topicAreas.join('、')}

【受访者背景】
${profileSummary}
${participantProfile?.rawContext ? `\n受访者自述:${participantProfile.rawContext}` : ''}

【访谈记录】
${interviewText}

【行为数据】
- 每个话题的消息数:${JSON.stringify(behaviorData.messagesPerTopic)}

【分析要点】(创作者经济研究的特殊关注点)
1. statedPreferences:TA 明确说了在乎/想要什么(用 TA 的原话或贴近的表达)
2. revealedPreferences:TA 的强调、停顿、情绪、举例,真正暴露出 TA 在乎的是什么(可能与 1 不同)
3. themes:核心主题 + 证据(用 TA 原话作为引文,不要总结)
4. contradictions:说的和透露的之间的差距、前后矛盾的地方
5. keyInsights:研究员可以马上拿去开会的洞察(避免空话,要具体)
6. bottomLine:一句话,如果只能告诉团队一件事,你会告诉他们什么

要求:
- 引文一定原文引用,加上引号
- 不要替受访者下结论
- 留意「沉默的地方」——TA 跳过没说的、被问到时绕开的
- 优先指出研究员可能没预料到的东西`;
  }

  return `You are the analyst assistant for Listen. Synthesize this interview into insights a researcher can actually use.

STUDY
- Topic: ${studyConfig.name}
- Research Question: ${studyConfig.researchQuestion}
- Areas: ${studyConfig.topicAreas.join(', ')}

PARTICIPANT
${profileSummary}
${participantProfile?.rawContext ? `\nSelf-described: ${participantProfile.rawContext}` : ''}

TRANSCRIPT
${interviewText}

BEHAVIOR
- Messages per topic: ${JSON.stringify(behaviorData.messagesPerTopic)}

ANALYZE (with creator-economy lens)
1. statedPreferences: what they explicitly said they value/want (their words)
2. revealedPreferences: what their emphasis, pauses, emotion, examples reveal (often ≠ stated)
3. themes: core themes + evidence (quote verbatim, do not paraphrase)
4. contradictions: gaps between stated vs revealed, internal inconsistencies
5. keyInsights: insights a researcher can bring to a meeting tomorrow — specific, not platitudes
6. bottomLine: if you could tell the team only one thing, what would it be?

Rules:
- Quote verbatim, in quotation marks
- Don't conclude on the participant's behalf
- Watch the silences — what they skipped, what they walked around
- Prioritize what the researcher likely didn't expect`;
};

/**
 * 单次综合输出结构 — 提供给模型的 JSON schema 描述
 */
export const synthesisOutputDescription = `
Expected output structure:
{
  "statedPreferences": ["What participant said they value/want"],
  "revealedPreferences": ["What their behavior/emphasis revealed"],
  "themes": [
    { "theme": "Theme name", "evidence": "Verbatim quote", "frequency": 3 }
  ],
  "contradictions": ["Any gaps between stated and revealed"],
  "keyInsights": ["Actionable insights for the researcher"],
  "bottomLine": "One-sentence summary insight"
}
`;

/**
 * 多访谈聚合 prompt
 */
export const buildAggregateSynthesisPrompt = (
  studyConfig: StudyConfig,
  syntheses: SynthesisResult[],
  interviewCount: number,
  locale: PromptLocale = 'zh'
): string => {
  const synthesesText = syntheses
    .map((s, i) => {
      if (locale === 'zh') {
        return `--- 访谈 ${i + 1} ---
核心主题:${s.themes.map((t) => t.theme).join('、')}
明说偏好:${s.statedPreferences.join('; ')}
透露偏好:${s.revealedPreferences.join('; ')}
矛盾点:${s.contradictions.join('; ') || '无'}
关键洞察:${s.keyInsights.join('; ')}
一句话:${s.bottomLine}`;
      }
      return `--- Interview ${i + 1} ---
Themes: ${s.themes.map((t) => t.theme).join(', ')}
Stated: ${s.statedPreferences.join('; ')}
Revealed: ${s.revealedPreferences.join('; ')}
Contradictions: ${s.contradictions.join('; ') || 'None'}
Insights: ${s.keyInsights.join('; ')}
Bottom Line: ${s.bottomLine}`;
    })
    .join('\n\n');

  if (locale === 'zh') {
    return `请从 ${interviewCount} 位创作者的访谈中,提炼跨访谈的群体模式。

【研究信息】
- 研究主题:${studyConfig.name}
- 研究问题:${studyConfig.researchQuestion}
- 探索话题:${studyConfig.topicAreas.join('、')}

【各访谈单点综合】
${synthesesText}

请你识别:
1. commonThemes(共同主题):多位创作者重复出现的话题,标注频次和具有代表性的原文引用
2. divergentViews(分歧观点):同一议题上明显不同的两种视角
3. keyFindings(关键发现):跨样本最重要的洞察,直接回答研究问题
4. researchImplications(研究启示):这些发现对决策意味着什么
5. bottomLine(一段话总结):如果给团队 60 秒汇报,你会怎么说

特别关注:
- 「沉默的群体」——哪些类型的创作者声音偏少
- 反复出现但没被深问的支线
- 少数派观点是否其实指向产品改进点
- 谁说什么 vs 谁强调什么的差距`;
  }

  return `Synthesize cross-interview patterns from ${interviewCount} creator interviews.

STUDY
- Topic: ${studyConfig.name}
- Research Question: ${studyConfig.researchQuestion}
- Areas: ${studyConfig.topicAreas.join(', ')}

INDIVIDUAL SYNTHESES
${synthesesText}

Identify:
1. commonThemes — themes recurring across multiple creators (frequency + representative verbatim quotes)
2. divergentViews — same issue, two distinct perspectives
3. keyFindings — most important cross-sample insights answering the research question
4. researchImplications — what these findings mean for decisions
5. bottomLine — a paragraph you'd brief the team with in 60 seconds

Watch for:
- "The silent segment" — which creator types speak the least
- Recurring side-threads that no one probed
- Whether the minority view is actually the product-improvement signal
- What gets said vs what gets emphasized`;
};

/**
 * 聚合综合输出结构
 */
export const aggregateSynthesisOutputDescription = `
Expected output structure:
{
  "commonThemes": [
    {
      "theme": "Theme name",
      "frequency": 3,
      "representativeQuotes": ["Verbatim quote A", "Verbatim quote B"]
    }
  ],
  "divergentViews": [
    {
      "topic": "Area of disagreement",
      "viewA": "One perspective",
      "viewB": "Contrasting perspective"
    }
  ],
  "keyFindings": ["Major findings answering the research question"],
  "researchImplications": ["What these findings mean for decisions"],
  "bottomLine": "One paragraph summarizing the key takeaways from all interviews"
}
`;
