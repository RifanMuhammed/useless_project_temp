import React, { useState, useRef, useCallback } from 'react';
import { Play, Square, Cpu } from 'lucide-react';
import { CameraFeed } from './CameraFeed';
import { LiveMetricsPanel } from './LiveMetricsPanel';
import { EventLog } from './EventLog';
import { SampleSelector } from './SampleSelector';
import type { BehavioralMetrics, LiveEvent, SampleProfile, ScanResult } from '../../types/npc';
import { scoringEngine } from '../../services/scoringEngine';
import { soundEffects } from '../../services/audioService';

interface AnalyzerViewProps {
  onScanComplete: (result: ScanResult) => void;
  onUnlockAchievement: (id: string) => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  onScanComplete,
  onUnlockAchievement,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [activeSample, setActiveSample] = useState<SampleProfile | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [latestSnapshot, setLatestSnapshot] = useState<string | undefined>(undefined);

  const [currentMetrics, setCurrentMetrics] = useState<BehavioralMetrics>({
    movementRandomness: 45,
    pathRepetition: 50,
    idleBehavior: 30,
    directionChanges: 40,
    activityLevel: 45,
    movementRepetition: 40,
    predictability: 50,
    loopDetected: false,
  });

  const [eventLogs, setEventLogs] = useState<LiveEvent[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      text: 'VISION MODULE ARMED // STANDBY',
      type: 'info',
    },
  ]);

  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanStartTimeRef = useRef<number>(0);

  const addEventLog = useCallback((text: string, type: 'info' | 'warning' | 'alert' | 'success' = 'info') => {
    const newEvent: LiveEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      text,
      type,
    };
    setEventLogs((prev) => [...prev.slice(-19), newEvent]);
  }, []);

  // Handle Metrics Update from Camera/Vision
  const handleMetricsUpdate = useCallback((metrics: BehavioralMetrics) => {
    setCurrentMetrics(metrics);
  }, []);

  // Stop / Finish Scan
  const finishScan = useCallback(() => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);

    setIsScanning(false);
    setScanProgress(100);

    const durationSeconds = (Date.now() - (scanStartTimeRef.current || Date.now() - 8000)) / 1000;
    addEventLog('SCAN COMPLETE // COMPILING NPC CLASSIFICATION', 'success');

    // Achievements check
    if (currentMetrics.loopDetected || currentMetrics.pathRepetition >= 80) {
      onUnlockAchievement('loop-detected');
    }
    if (currentMetrics.idleBehavior >= 85) {
      onUnlockAchievement('idle-master');
    }
    if (currentMetrics.movementRandomness >= 85) {
      onUnlockAchievement('main-character');
    }
    if (currentMetrics.activityLevel >= 75 && currentMetrics.idleBehavior < 20) {
      onUnlockAchievement('the-walker');
    }
    if (activeSample) {
      onUnlockAchievement('sample-tester');
    }

    // Compile result via scoring engine
    const finalResult = scoringEngine.compileScanResult(
      currentMetrics,
      durationSeconds,
      latestSnapshot
    );

    if (finalResult.npcScore >= 96) {
      onUnlockAchievement('final-boss');
    } else if (finalResult.npcScore >= 41 && finalResult.npcScore <= 60) {
      onUnlockAchievement('background-extra');
    }

    // Trigger result reveal
    setTimeout(() => {
      onScanComplete(finalResult);
    }, 400);
  }, [currentMetrics, latestSnapshot, activeSample, onScanComplete, onUnlockAchievement, addEventLog]);

  // Start Scan sequence
  const startScan = () => {
    soundEffects.playClick(1500);
    soundEffects.playTargetLocked();
    setIsScanning(true);
    setScanProgress(0);
    scanStartTimeRef.current = Date.now();

    addEventLog('SCAN SEQUENCE INITIATED', 'success');
    addEventLog('TRACKING TEMPORAL COORDINATE RECURRENCE', 'info');

    // Interval for simulated progress & event triggers
    const SCAN_DURATION_MS = 8000;
    const intervalStep = 100;

    let elapsed = 0;
    scanIntervalRef.current = setInterval(() => {
      elapsed += intervalStep;
      const progress = Math.min(100, (elapsed / SCAN_DURATION_MS) * 100);
      setScanProgress(progress);

      // Procedural scan tick sound
      if (elapsed % 800 === 0) {
        soundEffects.playScanTick();
      }

      // Contextual Event Triggers during scan
      if (elapsed === 1500) {
        addEventLog('MEASURING CENTROID VELOCITY DELTAS', 'info');
      } else if (elapsed === 3200) {
        if (currentMetrics.pathRepetition > 70) {
          addEventLog('WARNING: REPETITIVE PATH DETECTED', 'warning');
        } else if (currentMetrics.idleBehavior > 70) {
          addEventLog('WARNING: IDLE BEHAVIOR INCREASING', 'warning');
        } else {
          addEventLog('ANALYZING KINETIC ENTROPY VARIANCE', 'info');
        }
      } else if (elapsed === 5500) {
        if (currentMetrics.predictability > 75) {
          addEventLog('PREDICTABILITY THRESHOLD EXCEEDED', 'alert');
        } else {
          addEventLog('EVALUATING MAIN CHARACTER POTENTIAL', 'info');
        }
      } else if (elapsed >= SCAN_DURATION_MS) {
        finishScan();
      }
    }, intervalStep);
  };

  const stopScan = () => {
    soundEffects.playClick(900);
    finishScan();
  };

  return (
    <div className="space-y-6">
      {/* Hero Section Banner */}
      <div className="bg-cyber-surface/60 border border-cyber-border rounded-lg p-5 sm:p-6 hud-corner-box">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-black text-2xl sm:text-3xl text-white glow-green">
                NPC ANO
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono-tech bg-cyber-green/10 border border-cyber-green text-cyber-green">
                OPTICAL BEHAVIOR ENGINE
              </span>
            </div>
            <h2 className="font-display text-sm sm:text-base text-cyber-green font-semibold tracking-wide">
              “ARE YOU AN NPC?”
            </h2>
            <p className="text-xs font-mono-tech text-cyber-hudMuted mt-1">
              Advanced behavioral movement analysis for absolutely no reason. Observes simple movement patterns and calculates fictional NPC classifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            {!isScanning ? (
              <button
                onClick={startScan}
                className="flex items-center gap-2.5 px-6 py-3 rounded-lg bg-cyber-green text-black font-display font-bold text-sm tracking-wider hover:bg-cyber-greenGlow box-glow-green transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                START ANALYSIS
              </button>
            ) : (
              <button
                onClick={stopScan}
                className="flex items-center gap-2.5 px-6 py-3 rounded-lg bg-cyber-crimson text-white font-display font-bold text-sm tracking-wider hover:bg-red-500 shadow-lg shadow-red-500/30 transition-all animate-pulse"
              >
                <Square className="w-4 h-4 fill-current" />
                STOP ANALYSIS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Input Source & Preset Selector */}
      <SampleSelector
        activeSample={activeSample}
        uploadedVideoUrl={uploadedVideoUrl}
        onSelectSample={(sample) => {
          setActiveSample(sample);
          if (sample) {
            setCurrentMetrics(sample.metrics);
            addEventLog(`LOADED BENCHMARK PROFILE: ${sample.npcType}`, 'success');
          }
        }}
        onUploadVideo={(url) => {
          setUploadedVideoUrl(url);
          if (url) {
            addEventLog('UPLOADED LOCAL VIDEO STREAM', 'info');
          }
        }}
      />

      {/* Main Dual-Panel Workspace: Left Camera Feed / Right Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Camera / Video Feed */}
        <div className="lg:col-span-7 space-y-4">
          <CameraFeed
            isScanning={isScanning}
            onMetricsUpdate={handleMetricsUpdate}
            onEventLog={addEventLog}
            activeSample={activeSample}
            uploadedVideoUrl={uploadedVideoUrl}
            onCaptureSnapshot={(dataUrl) => setLatestSnapshot(dataUrl)}
            onSelectSamplePreset={() => {
              setActiveSample(null);
            }}
          />

          {/* Quick Action Buttons Below Camera */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-cyber-surface/40 border border-cyber-borderSubtle rounded-lg font-mono-tech text-xs">
            <div className="flex items-center gap-2 text-cyber-hudMuted">
              <Cpu className="w-4 h-4 text-cyber-green" />
              <span>SENSOR: {activeSample ? 'SIMULATED DATASET' : 'LOCAL WEBCAM'}</span>
            </div>

            <div className="flex items-center gap-2">
              {!isScanning ? (
                <button
                  onClick={startScan}
                  className="px-4 py-1.5 rounded bg-cyber-green/20 border border-cyber-green text-cyber-green font-bold hover:bg-cyber-green/30 box-glow-green transition-all"
                >
                  [ INITIATE SCAN ]
                </button>
              ) : (
                <button
                  onClick={stopScan}
                  className="px-4 py-1.5 rounded bg-cyber-crimson/20 border border-cyber-crimson text-cyber-crimson font-bold hover:bg-cyber-crimson/30 transition-all"
                >
                  [ FINISH SCAN ]
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Live Analysis Telemetry & Event Log */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="flex-1">
            <LiveMetricsPanel
              metrics={currentMetrics}
              isScanning={isScanning}
              scanProgress={scanProgress}
            />
          </div>

          <div>
            <EventLog events={eventLogs} />
          </div>
        </div>
      </div>
    </div>
  );
};
