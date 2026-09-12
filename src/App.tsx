import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import type { ActiveTab } from './components/common/Navbar';
import { BootSequence } from './components/common/BootSequence';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { AchievementToast } from './components/common/AchievementToast';
import { HeroLanding } from './components/home/HeroLanding';
import { QuizAssessment } from './components/quiz/QuizAssessment';
import { BiometricCheck } from './components/biometrics/BiometricCheck';
import { AnalyzerView } from './components/analyzer/AnalyzerView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { AboutView } from './components/about/AboutView';
import { ResultModal } from './components/results/ResultModal';
import type { Achievement, BehavioralMetrics, LeaderboardEntry, ScanResult } from './types/npc';
import type { QuizOption } from './constants/quizQuestions';
import { scoringEngine } from './services/scoringEngine';
import { storageService } from './services/storageService';
import { soundEffects } from './services/audioService';

export const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Assessment & Results State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, QuizOption>>({});
  const [quizLatency, setQuizLatency] = useState<number | undefined>(undefined);
  const [showBiometricCheck, setShowBiometricCheck] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);

  // Leaderboard & Achievements State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [toastAchievement, setToastAchievement] = useState<Achievement | null>(null);

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

  // Handle Quiz Completion
  const handleQuizComplete = (answers: Record<number, QuizOption>, wantsBiometricCheck: boolean, averageLatencyMs?: number) => {
    setQuizAnswers(answers);
    setQuizLatency(averageLatencyMs);
    handleUnlockAchievement('sample-tester');

    if (wantsBiometricCheck) {
      setShowBiometricCheck(true);
    } else {
      // Compile results immediately with high precision metrics
      const result = scoringEngine.compileQuizResult(answers, undefined, undefined, averageLatencyMs);
      storageService.saveScanResult(result);
      setActiveResult(result);

      if (result.npcScore >= 96) {
        handleUnlockAchievement('final-boss');
      } else if (result.npcScore <= 20) {
        handleUnlockAchievement('main-character');
      } else if (result.npcScore >= 41 && result.npcScore <= 60) {
        handleUnlockAchievement('background-extra');
      }
    }
  };

  // Handle Biometric Scan complete after quiz
  const handleBiometricComplete = (metrics: BehavioralMetrics, snapshotDataUrl?: string) => {
    setShowBiometricCheck(false);
    const result = scoringEngine.compileQuizResult(quizAnswers, metrics, snapshotDataUrl, quizLatency);
    storageService.saveScanResult(result);
    setActiveResult(result);
  };

  // Handle direct camera scan
  const handleCameraScanComplete = (result: ScanResult) => {
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
    <div className="min-h-screen bg-cyber-bg text-slate-100 cyber-grid relative selection:bg-cyber-green selection:text-black font-sans">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-30 opacity-40" />

      {/* Boot Initializing Sequence */}
      {!bootComplete && (
        <BootSequence onComplete={() => setBootComplete(true)} />
      )}

      {/* Main App Layout */}
      <div className="flex flex-col min-h-screen">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          unlockedCount={unlockedAchievementsCount}
          totalAchievements={achievements.length}
        />

        <DisclaimerBanner />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Home Hero View */}
          {activeTab === 'home' && (
            <HeroLanding
              onStartQuiz={() => setActiveTab('quiz')}
              onStartCamera={() => setActiveTab('camera')}
              onViewLeaderboard={() => setActiveTab('leaderboard')}
            />
          )}

          {/* Quiz Assessment View */}
          {activeTab === 'quiz' && (
            showBiometricCheck ? (
              <BiometricCheck
                onScanComplete={handleBiometricComplete}
                onSkip={() => {
                  setShowBiometricCheck(false);
                  const res = scoringEngine.compileQuizResult(quizAnswers);
                  storageService.saveScanResult(res);
                  setActiveResult(res);
                }}
              />
            ) : (
              <QuizAssessment
                onComplete={handleQuizComplete}
                onCancel={() => setActiveTab('home')}
              />
            )
          )}

          {/* Dedicated Camera View */}
          {activeTab === 'camera' && (
            <AnalyzerView
              onScanComplete={handleCameraScanComplete}
              onUnlockAchievement={handleUnlockAchievement}
            />
          )}

          {/* Leaderboard View */}
          {activeTab === 'leaderboard' && (
            <LeaderboardView
              entries={leaderboard}
              onStartNewScan={() => setActiveTab('quiz')}
            />
          )}

          {/* Achievements View */}
          {activeTab === 'achievements' && (
            <AchievementsView
              achievements={achievements}
              onStartScan={() => setActiveTab('quiz')}
            />
          )}

          {/* About View */}
          {activeTab === 'about' && (
            <AboutView onStartScan={() => setActiveTab('quiz')} />
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
              setActiveTab('quiz');
            }}
          />
        )}

        {/* Achievement Toast */}
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
              SYS_REV: 2026.09 // MULTI-FACTOR BEHAVIORAL ASSESSMENT
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
