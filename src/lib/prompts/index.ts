/**
 * Listen 听见 — AI Prompts
 *
 * 访谈员「听见」的全部提示词。所有 prompt 都支持 locale 参数（zh/en），
 * 以保证创作者经济场景下的中文追问深度。
 *
 * FILES:
 * - interview.ts: 主访谈员人格与行为铁律（第三层追问、不复述、不评价）
 * - greeting.ts: 开场白生成（按场景定制）
 * - synthesis.ts: 单访谈+跨访谈聚合分析（区分 stated vs revealed）
 */

// Interview system prompt and helpers
export {
  buildInterviewSystemPrompt,
  getAIBehaviorInstruction,
  formatProfileFields
} from './interview';

// Greeting generation
export {
  buildGreetingPrompt,
  getDefaultGreeting
} from './greeting';

// Interview synthesis/analysis
export {
  buildSynthesisPrompt,
  synthesisOutputDescription,
  buildAggregateSynthesisPrompt,
  aggregateSynthesisOutputDescription
} from './synthesis';
