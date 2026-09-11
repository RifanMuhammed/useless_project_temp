import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import type { ActiveTab } from './components/common/Navbar';
import { BootSequence } from './components/common/BootSequence';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { AchievementToast } from './components/common/AchievementToast';
import { AnalyzerView } from './components/analyzer/AnalyzerView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { HowItWorksView } from './components/how-it-works/HowItWorksView';
import { AboutView } from './components/about/AboutView';
import { ResultModal } from './components/results/ResultModal';
import type { Achievement, LeaderboardEntry, ScanResult } from './types/npc';
import { storageService } from './services/storageService';
import { soundEffects } from './services/audioService';

export const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Scan & Result State
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);

  // Leaderboard & Achievements State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [toastAchievement, setToastAchievement] = useState<Achievement | null>(null);

  // Initialize storage
  useEffect(() => {
    setLeaderboard(storageService.getLeaderboard());
    setAchievements(storageService.getAchievements());
  }, []);

  const handleUnlockAchievement = (id: string) => {
    const { achievement, newlyUnlocked } = storageService.unlockAchievement(id);
    if (newlyUnlocked && achievement) {
      setAchievements(storageService.getAchievements());
      setToastAchievement(achievement);
      soundEffects.playAchievementChime();
    }
  };

  const handleScanComplete = (result: ScanResult) => {
    storageService.saveScanResult(result);
    setActiveResult(result);
  };

  const handleAddToLeaderboard = (result: ScanResult, customName: string) => {
    const updated = storageService.addLeaderboardEntry({
      name: customName,
      npcScore: result.npcScore,
      npcLevel: result.npcLevel,
      npcType: result.npcType,
    });
    setLeaderboard(updated);
    handleUnlockAchievement('hall-of-famer');
  };

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 cyber-grid relative selection:bg-cyber-green selection:text-black">
      {/* CRT Scanline Overlay Effect */}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-30 opacity-40" />

      {/* Boot Initializing Sequence */}
      {!bootComplete && (
        <BootSequence onComplete={() => setBootComplete(true)} />
      )}

      {/* Main App Layout */}
      <div className="flex flex-col min-h-screen">
        {/* Top Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          unlockedCount={unlockedAchievementsCount}
          totalAchievements={achievements.length}
        />

        {/* Global Disclaimer Header */}
        <DisclaimerBanner />

        {/* Dynamic Content Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'analyzer' && (
            <AnalyzerView
              onScanComplete={handleScanComplete}
              onUnlockAchievement={handleUnlockAchievement}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView
              entries={leaderboard}
              onStartNewScan={() => setActiveTab('analyzer')}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              achievements={achievements}
              onStartScan={() => setActiveTab('analyzer')}
            />
          )}

          {activeTab === 'how-it-works' && (
            <HowItWorksView onStartScan={() => setActiveTab('analyzer')} />
          )}

          {activeTab === 'about' && (
            <AboutView onStartScan={() => setActiveTab('analyzer')} />
          )}
        </main>

        {/* Global Result Modal */}
        {activeResult && (
          <ResultModal
            result={activeResult}
            onClose={() => setActiveResult(null)}
            onAddToLeaderboard={handleAddToLeaderboard}
            onScanAgain={() => {
              setActiveResult(null);
              setActiveTab('analyzer');
            }}
          />
        )}

        {/* Live Achievement Toast Popup */}
        <AchievementToast
          achievement={toastAchievement}
          onClose={() => setToastAchievement(null)}
        />

        {/* Footer */}
        <footer className="border-t border-cyber-borderSubtle bg-black/60 py-6 px-4 text-center font-mono-tech text-xs text-cyber-hudMuted">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white tracking-wider">NPC ANO</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyber-green">“ARE YOU AN NPC?”</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Fictional Entertainment Project // Built for absolutely no reason.
            </div>
            <div className="text-slate-600 text-[10px]">
              SYS_REV: 2026.09 // LOCAL WEBCAM COMPUTER VISION
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
