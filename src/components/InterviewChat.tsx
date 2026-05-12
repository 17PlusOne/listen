'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import {
  generateInterviewResponse,
  getInterviewGreeting,
} from '@/services/geminiService';
import { InterviewMessage, InterviewPhase } from '@/types';
import ReactMarkdown from 'react-markdown';
import { useLocale } from './LocaleProvider';
import {
  Send,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Quote,
} from 'lucide-react';

const InterviewChat: React.FC = () => {
  const router = useRouter();
  const { tr } = useLocale();
  const {
    studyConfig,
    participantProfile,
    questionProgress,
    interviewHistory,
    addMessage,
    setStep,
    isAiThinking,
    setAiThinking,
    contextEntries,
    appendContext,
    setInterviewPhase,
    markQuestionAsked,
    completeInterview,
    updateProfileField,
    setProfileRawContext,
    participantToken,
  } = useStore();

  const [input, setInput] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [showFinishOption, setShowFinishOption] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interviewHistory, isAiThinking]);

  useEffect(() => {
    if (questionProgress.currentPhase !== 'background') {
      setShowFinishOption(true);
    }
  }, [questionProgress.currentPhase]);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      if (!studyConfig || initialized || interviewHistory.length > 0) return;
      setInitialized(true);
      setAiThinking(true);
      try {
        const greeting = await getInterviewGreeting(studyConfig, participantToken);
        if (!mounted) return;
        addMessage({
          id: `msg-${Date.now()}`,
          role: 'ai',
          content: greeting,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Error initializing interview:', error);
      } finally {
        if (mounted) setAiThinking(false);
      }
    };
    initialize();
    return () => {
      mounted = false;
    };
  }, [studyConfig, initialized, interviewHistory.length]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() || !studyConfig) return;

    const userMsg: InterviewMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setInput('');
    appendContext(text, 'text');
    setAiThinking(true);

    try {
      const currentContext = contextEntries.map((e) => e.text).join('\n');
      const updatedHistory = [...interviewHistory, userMsg];
      const response = await generateInterviewResponse(
        updatedHistory,
        studyConfig,
        participantProfile,
        questionProgress,
        currentContext,
        participantToken
      );

      if (response.profileUpdates && response.profileUpdates.length > 0) {
        response.profileUpdates.forEach((update) => {
          updateProfileField(update.fieldId, update.value, update.status);
        });
        if (questionProgress.currentPhase === 'background') {
          const existingContext = participantProfile?.rawContext || '';
          const newContext = existingContext + (existingContext ? '\n' : '') + text;
          setProfileRawContext(newContext);
        }
      }

      if (response.phaseTransition) setInterviewPhase(response.phaseTransition);
      if (response.questionAddressed !== null && response.questionAddressed !== undefined) {
        markQuestionAsked(response.questionAddressed);
      }

      addMessage({
        id: `msg-${Date.now()}`,
        role: 'ai',
        content: response.message,
        timestamp: Date.now(),
      });

      if (response.shouldConclude) completeInterview();
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage({
        id: `msg-${Date.now()}`,
        role: 'ai',
        content: tr('chatFallbackError'),
        timestamp: Date.now(),
      });
    } finally {
      setAiThinking(false);
    }
  };

  const handleFinishEarly = () => completeInterview();
  const handleViewAnalysis = () => {
    setStep('synthesis');
    router.push('/synthesis');
  };

  if (!studyConfig) {
    return (
      <div className="min-h-screen bg-listen-paper flex items-center justify-center">
        <p className="text-listen-inkMute font-serif">{tr('consentMissingStudy')}</p>
      </div>
    );
  }

  const totalQuestions = studyConfig.coreQuestions.length;
  const questionsCompleted = questionProgress.questionsAsked.length;
  const isComplete = questionProgress.isComplete;

  const phaseLabel = (phase: InterviewPhase): string => {
    switch (phase) {
      case 'background':
        return tr('chatPhaseBackground');
      case 'core-questions':
        return tr('chatQuestionCounter')
          .replace('{n}', String(Math.min(questionsCompleted + 1, totalQuestions)))
          .replace('{total}', String(totalQuestions));
      case 'exploration':
        return tr('chatPhaseExploration');
      case 'feedback':
        return tr('chatPhaseFeedback');
      case 'wrap-up':
        return tr('chatPhaseWrap');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-listen-paper">
      {/* Top bar */}
      <div className="h-16 flex items-center justify-between px-6 sm:px-10 border-b border-listen-line/60 bg-listen-paper/90 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-listen-accent/10 border border-listen-accent/30 flex items-center justify-center flex-shrink-0">
            <Quote size={15} className="text-listen-accent" />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-[17px] text-listen-ink truncate">{studyConfig.name}</h1>
            <p className="text-[11px] text-listen-inkMute">{phaseLabel(questionProgress.currentPhase)}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-1.5" aria-label={tr('chatProgressLabel')}>
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  questionProgress.questionsAsked.includes(i)
                    ? 'bg-listen-accent w-4'
                    : 'bg-listen-line'
                }`}
              />
            ))}
          </div>

          {showFinishOption && !isComplete && (
            <button
              onClick={handleFinishEarly}
              className="text-[12px] text-listen-inkMute hover:text-listen-ink transition-colors"
            >
              {tr('chatFinishEarly')}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 paper-texture">
        <div className="max-w-2xl mx-auto space-y-6">
          <AnimatePresence>
            {interviewHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] ${
                    msg.role === 'user'
                      ? 'bg-listen-accent text-white rounded-3xl rounded-br-md px-5 py-3.5 shadow-[0_4px_14px_rgba(217,74,74,0.18)]'
                      : 'bg-white border border-listen-lineSoft text-listen-ink rounded-3xl rounded-bl-md px-5 py-4 shadow-[0_1px_0_rgba(26,24,20,0.02),0_2px_10px_rgba(26,24,20,0.03)]'
                  }`}
                >
                  {msg.role === 'ai' && (
                    <div className="text-[10px] tracking-[0.22em] uppercase text-listen-accent/80 font-medium mb-1.5">
                      {tr('chatInterviewer')}
                    </div>
                  )}
                  <div
                    className={`prose prose-sm max-w-none ${
                      msg.role === 'user' ? 'text-white' : 'text-listen-ink'
                    }`}
                    style={{
                      fontSize: '15.5px',
                      lineHeight: '1.75',
                    }}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className={msg.role === 'user' ? 'text-white !my-1' : 'text-listen-ink !my-1.5'}>
                            {children}
                          </p>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isAiThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-listen-lineSoft rounded-3xl rounded-bl-md px-5 py-3.5">
                <div className="flex items-center gap-2 text-listen-inkMute text-[13px]">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-listen-accent/60 animate-pulse" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-listen-accent/60 animate-pulse"
                      style={{ animationDelay: '120ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-listen-accent/60 animate-pulse"
                      style={{ animationDelay: '240ms' }}
                    />
                  </span>
                  <span>{tr('chatThinking2')}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer: input or done */}
      {isComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8 px-6 bg-white border-t border-listen-line/60"
        >
          <div className="max-w-md mx-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 size={26} className="text-emerald-700" />
            </div>
            <div>
              <h3 className="font-serif text-[24px] text-listen-ink">{tr('chatCompletedTitle')}</h3>
              <p className="text-[14px] text-listen-inkMute mt-1.5 leading-relaxed">
                {tr('chatCompletedBody')}
              </p>
            </div>
            <button
              onClick={handleViewAnalysis}
              className="btn-primary inline-flex items-center gap-2 mx-auto"
            >
              {tr('chatViewSynthesis')}
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="px-4 sm:px-6 py-4 bg-white/70 backdrop-blur-sm border-t border-listen-line/60">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isAiThinking && handleSend()}
                placeholder={tr('chatPlaceholder2')}
                disabled={isAiThinking}
                className="input-paper flex-1 py-3"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isAiThinking}
                className="w-12 h-12 rounded-full bg-listen-accent hover:bg-listen-accentDeep text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_6px_18px_rgba(217,74,74,0.22)] flex items-center justify-center flex-shrink-0"
                aria-label={tr('chatSubmit')}
              >
                {isAiThinking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewChat;
