import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Brain, Sparkles, AlertTriangle, Check, Camera, Award, Shuffle } from 'lucide-react';
import { getRandomQuestions } from '../../constants/quizQuestions';
import type { QuizOption, QuizQuestion } from '../../constants/quizQuestions';
import { soundEffects } from '../../services/audioService';

interface QuizAssessmentProps {
  onComplete: (answers: Record<number, QuizOption>, wantsBiometricCheck: boolean, averageLatencyMs?: number) => void;
  onCancel: () => void;
}

export const QuizAssessment: React.FC<QuizAssessmentProps> = ({
  onComplete,
  onCancel,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => getRandomQuestions(6));
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, QuizOption>>({});
  
  // Latency & timing tracking
  const questionStartTimeRef = useRef<number>(performance.now());
  const latenciesRef = useRef<number[]>([]);

  // Reflex mini-challenge timer
  const [challengeTimer, setChallengeTimer] = useState<number>(3);
  const [buttonSpamCount, setButtonSpamCount] = useState<number>(0);
  const challengeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questions[currentStep] || questions[0];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  // Track question mount time
  useEffect(() => {
    questionStartTimeRef.current = performance.now();
  }, [currentStep]);

  // Handle Challenge Question countdown
  useEffect(() => {
    if (currentQuestion?.isReflexChallenge) {
      setChallengeTimer(3);
      setButtonSpamCount(0);
      challengeIntervalRef.current = setInterval(() => {
        setChallengeTimer((prev) => {
          if (prev <= 1) {
            if (challengeIntervalRef.current) clearInterval(challengeIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (challengeIntervalRef.current) clearInterval(challengeIntervalRef.current);
    }

    return () => {
      if (challengeIntervalRef.current) clearInterval(challengeIntervalRef.current);
    };
  }, [currentQuestion]);

  const handleReroll = () => {
    soundEffects.playClick(1600);
    setQuestions(getRandomQuestions(6));
    setCurrentStep(0);
    setSelectedAnswers({});
    latenciesRef.current = [];
    questionStartTimeRef.current = performance.now();
  };

  const getAvgLatency = (): number | undefined => {
    if (latenciesRef.current.length === 0) return undefined;
    const sum = latenciesRef.current.reduce((a, b) => a + b, 0);
    return Math.round(sum / latenciesRef.current.length);
  };

  const handleSelectOption = (option: QuizOption) => {
    const elapsed = performance.now() - questionStartTimeRef.current;
    latenciesRef.current.push(elapsed);

    soundEffects.playClick(1400);
    const updated = { ...selectedAnswers, [currentQuestion.id]: option };
    setSelectedAnswers(updated);

    if (currentStep < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 300);
    }
  };

  const handleSpamReflexButton = () => {
    soundEffects.playClick(1800);
    const nextCount = buttonSpamCount + 1;
    setButtonSpamCount(nextCount);

    if (nextCount >= 3) {
      // Pick rogue protagonist option with 0 score contribution
      const rogueOption = currentQuestion.options.find((o) => o.scoreContribution === 0) || currentQuestion.options[2];
      handleSelectOption(rogueOption);
    }
  };

  const isCurrentAnswered = !!selectedAnswers[currentQuestion.id];
  const isFinalStep = currentStep === totalQuestions - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-mono-tech">
      {/* Quiz Header & Progress */}
      <div className="bg-cyber-panel border border-cyber-border rounded-xl p-5 box-glow-green hud-corner-box">
        <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyber-green animate-pulse" />
            <span className="font-display font-bold text-xs sm:text-sm text-white tracking-wider">
              PSYCHOLOGICAL SCENARIO ASSESSMENT
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReroll}
              title="Shuffle and load a new set of random questions"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-purple/20 border border-cyber-purple/40 text-cyber-purple hover:bg-cyber-purple/30 text-xs font-bold transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>REROLL QUESTIONS</span>
            </button>
            <span className="text-xs text-cyber-green font-bold">
              QUESTION {currentStep + 1} OF {totalQuestions}
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-cyber-green/30">
          <div
            className="h-full bg-cyber-green shadow-[0_0_10px_#00ff66] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-cyber-panel border-2 border-cyber-green rounded-2xl p-6 sm:p-8 box-glow-green hud-corner-box shadow-2xl relative overflow-hidden">
        {/* Category Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cyber-purple/20 border border-cyber-purple/40 text-cyber-purple text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          {currentQuestion.category}
        </div>

        {/* Scenario Narrative */}
        <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
          {currentQuestion.scenario}
        </h2>
        <p className="text-xs sm:text-sm text-cyber-green font-semibold mb-6">
          › {currentQuestion.prompt}
        </p>

        {/* Interactive Reflex Challenge */}
        {currentQuestion.isReflexChallenge && (
          <div className="bg-black/60 border border-cyber-crimson/50 rounded-xl p-5 text-center my-4 box-glow-green space-y-4">
            <div className="flex items-center justify-center gap-2 text-cyber-crimson font-bold text-xs animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>LIVE SYSTEM COMPLIANCE TEST // TIME REMAINING: {challengeTimer}s</span>
            </div>

            <button
              onClick={handleSpamReflexButton}
              className="px-8 py-4 rounded-xl bg-cyber-crimson text-white font-display font-black text-sm tracking-wider hover:bg-red-500 shadow-lg shadow-red-500/40 transform active:scale-95 transition-all"
            >
              ⚠️ DO NOT CLICK ME (SPAMMED: {buttonSpamCount})
            </button>
            <p className="text-[11px] text-slate-400">
              (Or select an explicit behavioral option below)
            </p>
          </div>
        )}

        {/* Multiple Choice Options Grid */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestion.id]?.id === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-cyber-green/20 border-cyber-green box-glow-green text-white font-bold'
                    : 'bg-cyber-surface/60 border-slate-800 hover:border-slate-600 text-slate-300 hover:bg-cyber-surfaceLight'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 border text-xs font-mono font-bold ${
                    isSelected
                      ? 'bg-cyber-green text-black border-cyber-green'
                      : 'bg-black/50 border-slate-700 text-slate-400'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : String.fromCharCode(65 + idx)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-slate-100 mb-0.5">
                    {option.text}
                  </div>
                  <div className="text-[11px] text-cyber-hudMuted font-mono">
                    › {option.subtext}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation / Completion Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-cyber-borderSubtle">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => {
                  soundEffects.playClick(1100);
                  setCurrentStep((prev) => Math.max(0, prev - 1));
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyber-surface border border-slate-700 hover:border-slate-500 text-slate-300 text-xs transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                PREVIOUS
              </button>
            )}

            <button
              onClick={onCancel}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-300"
            >
              CANCEL
            </button>
          </div>

          {isFinalStep && isCurrentAnswered ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onComplete(selectedAnswers, true, getAvgLatency())}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-cyan text-black font-display font-bold text-xs tracking-wider hover:bg-cyan-300 box-glow-cyan transition-all"
              >
                <Camera className="w-4 h-4" />
                OPTIONAL CAMERA CHECK (5s)
              </button>

              <button
                onClick={() => onComplete(selectedAnswers, false, getAvgLatency())}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyber-green text-black font-display font-bold text-xs tracking-wider hover:bg-cyber-greenGlow box-glow-green transition-all transform hover:scale-[1.02]"
              >
                <Award className="w-4 h-4" />
                GET RESULTS NOW
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            currentStep < totalQuestions - 1 && isCurrentAnswered && (
              <button
                onClick={() => {
                  soundEffects.playClick(1400);
                  setCurrentStep((prev) => prev + 1);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-green text-black font-display font-bold text-xs tracking-wider hover:bg-cyber-greenGlow box-glow-green transition-all"
              >
                NEXT QUESTION
                <ArrowRight className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

