import React from 'react';
import { Terminal, Sparkles, Camera, Brain, Trophy, ShieldAlert, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { soundEffects } from '../../services/audioService';

interface HeroLandingProps {
  onStartQuiz: () => void;
  onStartCamera: () => void;
  onViewLeaderboard: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartQuiz,
  onStartCamera,
  onViewLeaderboard,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto font-mono-tech">
      {/* Hero Cyber Header Card */}
      <div className="bg-cyber-panel border-2 border-cyber-green rounded-2xl p-6 sm:p-10 box-glow-green hud-corner-box shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-cyber-border pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyber-green/10 border border-cyber-green flex items-center justify-center text-cyber-green box-glow-green">
              <Terminal className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider">
                  NPC ANO
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyber-green/10 border border-cyber-green text-cyber-green font-bold">
                  v2.5
                </span>
              </div>
              <p className="text-xs text-cyber-hudMuted tracking-wider">
                ADVANCED PSYCHOLOGICAL & BEHAVIORAL DIAGNOSTIC TERMINAL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-cyber-borderSubtle text-xs">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
            <span className="text-cyber-green font-bold">SYSTEM ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyber-amber flex items-center gap-1 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" /> USEFULNESS: 0%
            </span>
          </div>
        </div>

        {/* Hero Title & Punchline */}
        <div className="space-y-4 my-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-purple/15 border border-cyber-purple text-cyber-purple text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            “ARE YOU AN NPC?”
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white glow-green leading-tight">
            DISCOVER IF YOU POSSESS FREE WILL
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Advanced behavioral analysis for absolutely no reason. Take the 6-question psychological scenario test or execute an optical motion scan to determine if you are a scripted background extra or a rogue protagonist.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-4">
          <button
            onClick={() => {
              soundEffects.playClick(1500);
              onStartQuiz();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-cyber-green text-black font-display font-black text-sm sm:text-base tracking-wider hover:bg-cyber-greenGlow box-glow-green transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Brain className="w-5 h-5" />
            START NPC TEST (60 SEC)
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEffects.playClick(1300);
              onStartCamera();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cyber-surface border border-slate-700 hover:border-cyber-green text-white font-mono-tech text-xs sm:text-sm font-bold transition-all hover:bg-cyber-surfaceLight"
          >
            <Camera className="w-4 h-4 text-cyber-cyan" />
            QUICK CAMERA SCAN
          </button>

          <button
            onClick={() => {
              soundEffects.playClick(1200);
              onViewLeaderboard();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-black/40 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white text-xs transition-all"
          >
            <Trophy className="w-4 h-4 text-cyber-amber" />
            HALL OF FAME
          </button>
        </div>
      </div>

      {/* Feature Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-cyber-surface/60 border border-cyber-borderSubtle p-5 rounded-xl hud-corner-box group hover:border-cyber-green transition-all">
          <div className="w-8 h-8 rounded-lg bg-cyber-green/10 border border-cyber-green/40 flex items-center justify-center text-cyber-green mb-3">
            <Brain className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-white text-sm mb-1.5">
            6 SATIRICAL SCENARIOS
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Evaluates your reactions to elevator silence, daily loops, conversation tree limits, and sudden ambient noises.
          </p>
        </div>

        <div className="bg-cyber-surface/60 border border-cyber-borderSubtle p-5 rounded-xl hud-corner-box group hover:border-cyber-purple transition-all">
          <div className="w-8 h-8 rounded-lg bg-cyber-purple/10 border border-cyber-purple/40 flex items-center justify-center text-cyber-purple mb-3">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-white text-sm mb-1.5">
            FREE WILL CHALLENGE
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Interactive reflex testing that monitors whether you obey mandatory prompts or spam forbidden controls.
          </p>
        </div>

        <div className="bg-cyber-surface/60 border border-cyber-borderSubtle p-5 rounded-xl hud-corner-box group hover:border-cyber-cyan transition-all">
          <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan mb-3">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-white text-sm mb-1.5">
            CYBER ID BADGE EXPORT
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Receive an official fictional classification rating, humorous psychological breakdown, and downloadable PNG badge.
          </p>
        </div>
      </div>
    </div>
  );
};
