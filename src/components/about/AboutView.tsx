import React from 'react';
import { Terminal } from 'lucide-react';
import { soundEffects } from '../../services/audioService';

interface AboutViewProps {
  onStartScan: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartScan }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 font-mono-tech">
      {/* Manifesto Banner */}
      <div className="bg-cyber-panel border-2 border-cyber-green rounded-xl p-6 sm:p-10 box-glow-green hud-corner-box shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-cyber-green mb-4">
          <Terminal className="w-5 h-5 animate-pulse" />
          <span className="font-display font-bold text-xs tracking-widest uppercase">
            R&D MANIFESTO // PROJECT SPECIFICATION
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-white glow-green mb-6 leading-tight">
          WHY DID WE BUILD THIS?
        </h1>

        <div className="space-y-6 text-slate-200 text-sm sm:text-base leading-relaxed">
          <div className="bg-black/60 p-5 rounded-lg border border-cyber-borderSubtle italic text-cyber-green text-base sm:text-lg">
            “We wanted to answer a question nobody asked:
            <br />
            What if we could determine whether someone behaves like an NPC?”
          </div>

          <p>
            In modern open-world gaming, Non-Playable Characters (NPCs) populate vast environments, faithfully pacing 3-meter corridors, staring blankly at shop counters, and waiting eternally for the player to initiate dialogue.
          </p>

          <p>
            Meanwhile in reality, humans stand motionless waiting for elevators, walk in repetitive circles while talking on the phone, and execute identical morning routines with mechanical precision.
          </p>

          <div className="border-l-2 border-cyber-amber pl-4 py-1 text-cyber-amber font-semibold text-sm">
            “NPC ANO has no meaningful contribution to society.
            <br />
            Fortunately, that was never the goal.”
          </div>

          <p className="text-slate-400 text-xs sm:text-sm">
            Built as a premier useless-project experiment and deadpan entertainment showcase, NPC ANO turns cutting-edge browser computer vision and optical frame differencing into an over-engineered surveillance terminal for pure amusement.
          </p>
        </div>

        {/* Diagnostic Meta Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-cyber-borderSubtle text-xs">
          <div className="bg-cyber-surface/60 p-3 rounded border border-white/5">
            <span className="text-slate-400 block text-[10px]">PRACTICAL VALUE</span>
            <span className="font-bold text-cyber-amber text-sm">0.00%</span>
          </div>
          <div className="bg-cyber-surface/60 p-3 rounded border border-white/5">
            <span className="text-slate-400 block text-[10px]">ENGINEERING EFFORT</span>
            <span className="font-bold text-cyber-green text-sm">100.0%</span>
          </div>
          <div className="bg-cyber-surface/60 p-3 rounded border border-white/5">
            <span className="text-slate-400 block text-[10px]">ENTERTAINMENT FACTOR</span>
            <span className="font-bold text-cyber-cyan text-sm">MAXIMAL</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              soundEffects.playClick(1500);
              onStartScan();
            }}
            className="px-6 py-3 rounded-lg bg-cyber-green text-black font-display font-bold text-sm tracking-wider hover:bg-cyber-greenGlow box-glow-green transition-all transform hover:scale-[1.02]"
          >
            TEST YOUR NPC RATING NOW
          </button>
        </div>
      </div>
    </div>
  );
};
