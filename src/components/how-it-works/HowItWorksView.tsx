import React from 'react';
import { Eye, Crosshair, Cpu, Award, ShieldAlert, Sparkles, Binary } from 'lucide-react';
import { soundEffects } from '../../services/audioService';

interface HowItWorksViewProps {
  onStartScan: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onStartScan }) => {
  const steps = [
    {
      step: 'STEP 01',
      title: 'Observe',
      desc: 'Optical sensors observe visible frame deltas in real-time without sending footage to any external cloud or server.',
      icon: Eye,
      tag: 'OPTICAL CV',
    },
    {
      step: 'STEP 02',
      title: 'Track',
      desc: 'The browser calculates motion centroid vectors, spatial recurrence trails, and velocity variance between successive frames.',
      icon: Crosshair,
      tag: 'CENTROID TRACKING',
    },
    {
      step: 'STEP 03',
      title: 'Analyze',
      desc: 'Six core behavioral parameters—idle stillness, path loops, angle flips, randomness, and overall energy—are computed dynamically.',
      icon: Cpu,
      tag: 'HEURISTIC ENGINE',
    },
    {
      step: 'STEP 04',
      title: 'Classify',
      desc: 'A modular weighted algorithm synthesizes the metrics into an official fictional NPC Score between 0% and 100%.',
      icon: Binary,
      tag: 'SCORE FORMULA',
    },
    {
      step: 'STEP 05',
      title: 'Judge',
      desc: 'The system renders the final verdict: Are you a scripted Looping NPC, an unskippable Quest Giver, or a rogue Main Character?',
      icon: Award,
      tag: 'FINAL VERDICT',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green text-cyber-green font-mono-tech text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          SYSTEM ARCHITECTURE SPECIFICATION
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white glow-green">
          HOW NPC ANO WORKS
        </h1>
        <p className="font-mono-tech text-xs sm:text-sm text-cyber-hudMuted max-w-xl mx-auto">
          A step-by-step walkthrough of the intentionally over-engineered fictional behavioral movement analysis pipeline.
        </p>
      </div>

      {/* 5 Steps Interactive Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="bg-cyber-panel border border-cyber-border rounded-lg p-5 font-mono-tech flex flex-col justify-between box-glow-green hud-corner-box group hover:border-cyber-green transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-cyber-green mb-3">
                  <span className="font-bold">{item.step}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    {item.tag}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-lg bg-cyber-green/10 border border-cyber-green/40 flex items-center justify-center text-cyber-green mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-display text-base font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500">
                PIPELINE STAGE {index + 1}/5
              </div>
            </div>
          );
        })}
      </div>

      {/* Formula & Disclaimers Box */}
      <div className="bg-cyber-surface/60 border border-cyber-border rounded-xl p-6 sm:p-8 hud-corner-box space-y-4">
        <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <Binary className="w-5 h-5 text-cyber-cyan" />
          THE MODULAR NPC SCORING FORMULA
        </h3>

        <div className="bg-black/70 p-4 rounded-lg border border-cyber-borderSubtle font-mono-tech text-xs sm:text-sm text-cyber-green leading-relaxed overflow-x-auto">
          <code>
            npcScore = clamp(0, 100, (pathRepetition × 0.30) + (idleBehavior × 0.20) + (movementRepetition × 0.20) + (predictability × 0.20) + ((100 - randomness) × 0.10))
          </code>
        </div>

        <div className="bg-cyber-amber/10 border-l-4 border-cyber-amber p-4 rounded-r font-mono-tech text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 text-cyber-amber font-bold">
            <ShieldAlert className="w-4 h-4" />
            CRITICAL ENTERTAINMENT DISCLAIMER
          </div>
          <p>
            NPC ANO is an entertainment experiment and useless-project parody. Its classifications are fictional and are NOT a scientifically valid assessment of a person&apos;s personality, identity, intelligence, psychological state, or medical health.
          </p>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              soundEffects.playClick(1500);
              onStartScan();
            }}
            className="px-6 py-3 rounded-lg bg-cyber-green text-black font-display font-bold text-sm tracking-wider hover:bg-cyber-greenGlow box-glow-green transition-all transform hover:scale-[1.02]"
          >
            START ANALYSIS WORKSPACE
          </button>
        </div>
      </div>
    </div>
  );
};
