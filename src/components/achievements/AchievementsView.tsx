import React from 'react';
import { Trophy, Lock, CheckCircle, Sparkles, RotateCw, PauseCircle, Users, Footprints, Cpu, Crown } from 'lucide-react';
import type { Achievement } from '../../types/npc';

interface AchievementsViewProps {
  achievements: Achievement[];
  onStartScan: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'RotateCw':
        return RotateCw;
      case 'PauseCircle':
        return PauseCircle;
      case 'Users':
        return Users;
      case 'Sparkles':
        return Sparkles;
      case 'Crown':
        return Crown;
      case 'Footprints':
        return Footprints;
      case 'Cpu':
        return Cpu;
      case 'Trophy':
      default:
        return Trophy;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Overall Progress */}
      <div className="bg-cyber-surface/60 border border-cyber-border rounded-lg p-6 hud-corner-box">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-6 h-6 text-cyber-purple animate-pulse" />
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white glow-purple">
                NPC ACHIEVEMENTS
              </h1>
            </div>
            <p className="text-xs font-mono-tech text-cyber-hudMuted">
              Unlock prestigious badges by demonstrating extreme automation or catastrophic protagonist chaos during scans.
            </p>
          </div>

          <div className="bg-black/50 border border-cyber-borderSubtle p-4 rounded-lg min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-mono-tech mb-1.5">
              <span className="text-slate-400">UNLOCKED</span>
              <span className="text-cyber-green font-bold">
                {unlockedCount} / {achievements.length} [{progressPercent}%]
              </span>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-cyber-green/30">
              <div
                className="h-full bg-cyber-green shadow-[0_0_8px_#00ff66] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <div
              key={item.id}
              className={`p-5 rounded-lg border font-mono-tech transition-all relative overflow-hidden flex flex-col justify-between ${
                item.unlocked
                  ? 'bg-cyber-panel border-cyber-purple/60 box-glow-purple hud-corner-box'
                  : 'bg-cyber-panel/40 border-slate-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      item.unlocked
                        ? 'bg-cyber-purple/20 border-cyber-purple/50 text-cyber-purple'
                        : 'bg-black/40 border-slate-800 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {item.unlocked ? (
                    <span className="flex items-center gap-1 text-[10px] text-cyber-green bg-cyber-green/10 border border-cyber-green/30 px-2 py-0.5 rounded font-bold">
                      <CheckCircle className="w-3 h-3" /> UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-black/40 border border-slate-800 px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>

                <h3 className={`font-display text-sm font-bold tracking-wide mb-1.5 ${item.unlocked ? 'text-white glow-purple' : 'text-slate-400'}`}>
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
                <span>CAT: {item.category.toUpperCase()}</span>
                {item.unlockedAt && (
                  <span>{new Date(item.unlockedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
