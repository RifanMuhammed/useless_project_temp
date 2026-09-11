import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Terminal, Trophy, Cpu, HelpCircle, Info, Sparkles } from 'lucide-react';
import { soundEffects } from '../../services/audioService';

export type ActiveTab = 'analyzer' | 'leaderboard' | 'achievements' | 'how-it-works' | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  unlockedCount: number;
  totalAchievements: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  unlockedCount,
  totalAchievements,
}) => {
  const handleTabClick = (tab: ActiveTab) => {
    soundEffects.playClick(1400);
    setActiveTab(tab);
  };

  const handleMuteToggle = () => {
    const nextMuted = soundEffects.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playClick(1600);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyber-border bg-cyber-bg/90 backdrop-blur-md">
      {/* Top micro telemetry bar */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1 text-[11px] font-mono-tech text-cyber-hudMuted border-b border-cyber-borderSubtle bg-black/40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyber-green">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green"></span>
            </span>
            SYSTEM: ONLINE
          </span>
          <span className="text-slate-500">|</span>
          <span>BUILD: 2.4.0-PROD</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyber-cyan">MEM: 12.4 MB</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyber-amber flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> USEFULNESS: 0%
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">FICTIONAL EXPERIMENT</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleTabClick('analyzer')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded border border-cyber-green/40 bg-cyber-surface box-glow-green group-hover:border-cyber-green transition-all">
              <Terminal className="w-5 h-5 text-cyber-green group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-wider text-white group-hover:text-cyber-green transition-colors">
                  NPC ANO
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-green/10 border border-cyber-green/30 text-cyber-green font-mono-tech">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-cyber-hudMuted font-mono-tech tracking-tight">
                “ARE YOU AN NPC?”
              </p>
            </div>
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-cyber-surface/60 border border-cyber-borderSubtle p-1 rounded-lg">
            <button
              onClick={() => handleTabClick('analyzer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono-tech transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/40 box-glow-green font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              ANALYZER
            </button>

            <button
              onClick={() => handleTabClick('leaderboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono-tech transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/40 box-glow-green font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              HALL OF FAME
            </button>

            <button
              onClick={() => handleTabClick('achievements')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono-tech transition-all relative ${
                activeTab === 'achievements'
                  ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/40 box-glow-green font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyber-purple" />
              ACHIEVEMENTS
              {unlockedCount > 0 && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40">
                  {unlockedCount}/{totalAchievements}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('how-it-works')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono-tech transition-all ${
                activeTab === 'how-it-works'
                  ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/40 box-glow-green font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              HOW IT WORKS
            </button>

            <button
              onClick={() => handleTabClick('about')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono-tech transition-all ${
                activeTab === 'about'
                  ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/40 box-glow-green font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              ABOUT
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle Button */}
            <button
              onClick={handleMuteToggle}
              title={isMuted ? 'Unmute HUD Audio' : 'Mute HUD Audio'}
              className={`p-2 rounded border transition-all text-xs font-mono-tech flex items-center gap-1.5 ${
                isMuted
                  ? 'border-slate-700 bg-cyber-surface/40 text-slate-400 hover:text-white hover:border-slate-600'
                  : 'border-cyber-green/40 bg-cyber-green/10 text-cyber-green box-glow-green'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline text-[11px]">{isMuted ? 'AUDIO OFF' : 'AUDIO ON'}</span>
            </button>

            {/* Mobile Tab Select Dropdown / Menu */}
            <div className="flex md:hidden">
              <select
                value={activeTab}
                onChange={(e) => handleTabClick(e.target.value as ActiveTab)}
                className="bg-cyber-surface border border-cyber-green/40 text-cyber-green font-mono-tech text-xs rounded px-2.5 py-1.5 focus:outline-none"
              >
                <option value="analyzer">⚡ ANALYZER</option>
                <option value="leaderboard">🏆 HALL OF FAME</option>
                <option value="achievements">✨ ACHIEVEMENTS</option>
                <option value="how-it-works">❓ HOW IT WORKS</option>
                <option value="about">ℹ️ ABOUT</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
