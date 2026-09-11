import React, { useState } from 'react';
import { Trophy, Search, Sparkles } from 'lucide-react';
import type { LeaderboardEntry } from '../../types/npc';
import { NPC_LEVELS } from '../../constants/classifications';
import { soundEffects } from '../../services/audioService';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  onStartNewScan: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  onStartNewScan,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'high' | 'protagonist'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = entries
    .filter((entry) => {
      if (searchQuery.trim()) {
        return (
          entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.npcType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.npcLevel.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    })
    .filter((entry) => {
      if (filterType === 'high') return entry.npcScore >= 80;
      if (filterType === 'protagonist') return entry.npcScore <= 30;
      return true;
    });

  const getRankBadge = (rank?: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 font-display font-bold text-xs shadow-[0_0_10px_#f59e0b]">
          #1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 border border-slate-300 text-slate-200 font-display font-bold text-xs">
          #2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 border border-amber-700 text-amber-600 font-display font-bold text-xs">
          #3
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black/40 border border-slate-800 text-slate-500 font-mono text-xs">
        #{rank}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-cyber-surface/60 border border-cyber-border rounded-lg p-6 hud-corner-box">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-6 h-6 text-cyber-green animate-pulse" />
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white glow-green">
                NPC HALL OF FAME
              </h1>
            </div>
            <p className="text-xs font-mono-tech text-cyber-hudMuted">
              Official surveillance registry honoring the most obedient, automated, and predictably scripted humans on Earth.
            </p>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick(1500);
              onStartNewScan();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-green text-black font-display font-bold text-xs tracking-wider hover:bg-cyber-greenGlow box-glow-green transition-all self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            SUBMIT NEW SCAN
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-cyber-panel border border-cyber-borderSubtle p-3.5 rounded-lg font-mono-tech text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search specimen or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-slate-800 focus:border-cyber-green text-white pl-9 pr-3 py-1.5 rounded focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-slate-500 text-[11px] mr-1 hidden sm:inline">FILTER:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded transition-all ${
              filterType === 'all'
                ? 'bg-cyber-green/20 border border-cyber-green text-cyber-green font-bold'
                : 'bg-black/30 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ALL SPECIMENS
          </button>
          <button
            onClick={() => setFilterType('high')}
            className={`px-3 py-1 rounded transition-all ${
              filterType === 'high'
                ? 'bg-cyber-purple/20 border border-cyber-purple text-cyber-purple font-bold'
                : 'bg-black/30 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            HIGH NPC (&gt;80%)
          </button>
          <button
            onClick={() => setFilterType('protagonist')}
            className={`px-3 py-1 rounded transition-all ${
              filterType === 'protagonist'
                ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-bold'
                : 'bg-black/30 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            PROTAGONISTS (&lt;30%)
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-cyber-panel border border-cyber-border rounded-lg overflow-hidden shadow-xl box-glow-green">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-tech text-xs">
            <thead className="bg-cyber-surface border-b border-cyber-borderSubtle text-cyber-hudMuted text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">RANK</th>
                <th className="py-3.5 px-4">SPECIMEN / NAME</th>
                <th className="py-3.5 px-4">NPC SCORE</th>
                <th className="py-3.5 px-4">CLASSIFICATION</th>
                <th className="py-3.5 px-4">TYPE</th>
                <th className="py-3.5 px-4 text-right">DATE REGISTERED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((entry, index) => {
                const levelMeta = NPC_LEVELS.find((l) => l.level === entry.npcLevel);
                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-cyber-surface/50 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">{getRankBadge(entry.rank || index + 1)}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-cyber-green transition-colors">
                          {entry.name}
                        </span>
                        {entry.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-bold">
                            USER SCAN
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-extrabold text-sm text-cyber-green glow-green">
                          {entry.npcScore}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${levelMeta?.badgeColor || 'border-slate-700'}`}>
                        {entry.npcLevel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="text-cyber-cyan font-semibold">{entry.npcType}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 text-[11px]">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
