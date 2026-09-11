import React, { useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import type { Achievement } from '../../types/npc';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce max-w-sm w-full">
      <div className="bg-cyber-panel border-2 border-cyber-purple/80 rounded-lg p-4 shadow-2xl box-glow-purple hud-corner-box">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyber-purple/20 border border-cyber-purple/50 text-cyber-purple">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono-tech uppercase tracking-widest text-cyber-purple font-bold">
                ★ ACHIEVEMENT UNLOCKED ★
              </div>
              <div className="font-display text-sm font-bold text-white glow-purple">
                {achievement.title}
              </div>
              <div className="text-xs font-mono-tech text-slate-300 mt-0.5">
                {achievement.description}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
