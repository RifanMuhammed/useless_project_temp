import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw, Trophy, Award, Sparkles, Check, ShieldCheck, X } from 'lucide-react';
import type { ScanResult } from '../../types/npc';
import { ProfileCard } from './ProfileCard';
import { soundEffects } from '../../services/audioService';
import { NPC_LEVELS } from '../../constants/classifications';

interface ResultModalProps {
  result: ScanResult | null;
  onClose: () => void;
  onAddToLeaderboard: (result: ScanResult, customName: string) => void;
  onScanAgain: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onClose,
  onAddToLeaderboard,
  onScanAgain,
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);
  const [showProfileCard, setShowProfileCard] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [isSavedToHallOfFame, setIsSavedToHallOfFame] = useState<boolean>(false);

  useEffect(() => {
    if (!result) return;

    soundEffects.playResultReveal();

    // Trigger celebratory confetti for extreme scores
    if (result.npcScore >= 95 || result.npcScore <= 20) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00ff66', '#00f0ff', '#8b5cf6'],
        });
      } catch {
        // Fallback
      }
    }

    // Animate Score Counter 0 -> Final Score
    let current = 0;
    const target = result.npcScore;
    const duration = 1200;
    const stepTime = 25;
    const totalSteps = duration / stepTime;
    const stepIncrement = target / totalSteps;

    const timer = setInterval(() => {
      current += stepIncrement;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result]);

  if (!result) return null;

  const levelMeta = NPC_LEVELS.find((l) => l.level === result.npcLevel) || NPC_LEVELS[3];

  const handleSaveToLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSave = customName.trim() || `Specimen ${result.subjectCode}`;
    onAddToLeaderboard(result, nameToSave);
    setIsSavedToHallOfFame(true);
    soundEffects.playClick(1700);
  };

  // SVG Circular Gauge calculation
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-cyber-panel border-2 border-cyber-green rounded-xl p-6 sm:p-8 box-glow-green hud-corner-box my-8 shadow-2xl">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-green animate-ping" />
            <span className="font-display font-bold text-sm tracking-widest text-cyber-green">
              ANALYSIS COMPLETE // SPECIMEN CLASSIFIED
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-tech text-slate-400">
              ID: {result.subjectCode}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close Result"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showProfileCard ? (
          /* Sub-View: Cyber ID Card Profile */
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-lg text-white">
                SPECIMEN ID BADGE
              </h3>
              <button
                onClick={() => setShowProfileCard(false)}
                className="text-xs font-mono-tech text-cyber-green hover:underline flex items-center gap-1"
              >
                ← BACK TO FULL BREAKDOWN
              </button>
            </div>
            <ProfileCard result={result} />
          </div>
        ) : (
          /* Main Breakdown View */
          <div className="space-y-6">
            {/* Top Row: Circular Score Meter + Classification Reveal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-cyber-surface/60 p-6 rounded-xl border border-cyber-borderSubtle">
              {/* Circular Radial Gauge */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r={circleRadius}
                      className="text-slate-800"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r={circleRadius}
                      className="text-cyber-green transition-all duration-300"
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 102, 0.6))' }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-widest">
                      NPC SCORE
                    </span>
                    <span className="font-display text-4xl sm:text-5xl font-black text-white glow-green">
                      {animatedScore}%
                    </span>
                    <span className="text-[10px] font-mono-tech text-cyber-cyan mt-0.5">
                      {result.metrics.loopDetected ? 'LOOP DETECTED' : 'EVALUATED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Classification Badges */}
              <div className="md:col-span-7 space-y-3">
                <div className="text-xs font-mono-tech text-slate-400 uppercase tracking-widest">
                  OFFICIAL FICTIONAL CLASSIFICATION
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-md font-display font-extrabold text-sm sm:text-base border ${levelMeta.badgeColor}`}>
                    {result.npcLevel}
                  </span>
                  <span className="px-2.5 py-1 rounded-md font-mono-tech font-bold text-xs bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40">
                    TYPE: {result.npcType}
                  </span>
                </div>

                <p className="text-xs font-mono-tech text-slate-300 leading-relaxed italic">
                  {levelMeta.flavorQuote}
                </p>

                {/* Main Character Potential Bar */}
                <div className="pt-2 border-t border-cyber-borderSubtle">
                  <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
                    <span className="text-cyber-amber font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> MAIN CHARACTER POTENTIAL
                    </span>
                    <span className="font-bold text-cyber-amber text-sm">{result.mainCharacterPotential}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-cyber-amber/30">
                    <div
                      className="h-full bg-cyber-amber shadow-[0_0_8px_#f59e0b] transition-all duration-700"
                      style={{ width: `${result.mainCharacterPotential}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-mono-tech text-slate-400 mt-1">
                    › {result.mainCharacterReason}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div>
              <h4 className="font-display text-xs font-bold text-white tracking-wider mb-2.5">
                OBSERVED MOVEMENT TELEMETRY
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-tech text-xs">
                <div className="bg-cyber-surface/50 border border-cyber-borderSubtle p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">RANDOMNESS</span>
                  <span className="font-bold text-cyber-cyan text-base">{result.metrics.movementRandomness}%</span>
                </div>
                <div className="bg-cyber-surface/50 border border-cyber-borderSubtle p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">PATH REPETITION</span>
                  <span className="font-bold text-cyber-green text-base">{result.metrics.pathRepetition}%</span>
                </div>
                <div className="bg-cyber-surface/50 border border-cyber-borderSubtle p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">IDLE BEHAVIOR</span>
                  <span className="font-bold text-cyber-purple text-base">{result.metrics.idleBehavior}%</span>
                </div>
                <div className="bg-cyber-surface/50 border border-cyber-borderSubtle p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">DIRECTION SHIFTS</span>
                  <span className="font-bold text-cyber-amber text-base">{result.metrics.directionChanges}%</span>
                </div>
              </div>
            </div>

            {/* Funny Behavioral Observations */}
            <div className="bg-cyber-surface/40 border border-cyber-borderSubtle rounded-lg p-4 font-mono-tech">
              <div className="flex items-center gap-2 text-cyber-green mb-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-display font-bold text-xs text-white tracking-wider">
                  BEHAVIOR REPORT & SYSTEM OBSERVATIONS
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyber-green font-bold shrink-0">›</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hall of Fame Save Form */}
            {!isSavedToHallOfFame ? (
              <form onSubmit={handleSaveToLeaderboard} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter Specimen Alias (e.g. Corridor Pacer)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  maxLength={30}
                  className="flex-1 bg-cyber-surface border border-slate-700 focus:border-cyber-green text-white px-3 py-2 rounded text-xs font-mono-tech focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-cyber-purple/20 border border-cyber-purple/50 hover:bg-cyber-purple/30 text-cyber-purple font-mono-tech text-xs font-bold transition-all"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  SAVE TO HALL OF FAME
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono-tech text-cyber-green bg-cyber-green/10 border border-cyber-green/40 p-2.5 rounded">
                <Check className="w-4 h-4" />
                <span>SAVED TO GLOBAL NPC HALL OF FAME LEADERBOARD!</span>
              </div>
            )}

            {/* Modal Bottom Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-cyber-borderSubtle">
              <button
                onClick={onScanAgain}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-green text-black font-display font-bold text-xs tracking-wider hover:bg-cyber-greenGlow box-glow-green transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                SCAN AGAIN
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowProfileCard(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-cyber-surface border border-slate-700 hover:border-cyber-green text-white font-mono-tech text-xs transition-all"
                >
                  <Award className="w-4 h-4 text-cyber-cyan" />
                  VIEW ID BADGE
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-black/40 border border-slate-800 hover:bg-white/5 text-slate-400 hover:text-white font-mono-tech text-xs transition-all"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
