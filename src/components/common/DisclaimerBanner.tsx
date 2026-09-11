import React from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="w-full bg-cyber-surface/70 border-t border-b border-cyber-borderSubtle py-2.5 px-4 text-center">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs font-mono-tech text-cyber-hudMuted">
        <span className="flex items-center gap-1.5 text-cyber-amber font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          DISCLAIMER:
        </span>
        <span>
          NPC ANO is an entertainment experiment & useless-project parody.
          Classifications are fictional and do NOT measure real psychological, medical, personality, or intelligence attributes.
        </span>
        <span className="text-cyber-green inline-flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3" /> USEFULNESS: 0.0%
        </span>
      </div>
    </div>
  );
};
