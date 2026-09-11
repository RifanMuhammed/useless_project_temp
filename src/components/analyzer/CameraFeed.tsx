import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraOff, Play, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { visionEngine } from '../../services/visionEngine';
import type { VisionBoundingBox, MotionPoint } from '../../services/visionEngine';
import type { BehavioralMetrics, SampleProfile } from '../../types/npc';
import { soundEffects } from '../../services/audioService';

interface CameraFeedProps {
  isScanning: boolean;
  onMetricsUpdate: (metrics: BehavioralMetrics) => void;
  onEventLog: (text: string, type?: 'info' | 'warning' | 'alert' | 'success') => void;
  activeSample: SampleProfile | null;
  uploadedVideoUrl: string | null;
  onCaptureSnapshot: (dataUrl: string) => void;
  onSelectSamplePreset: (presetKey: 'idle' | 'looping' | 'protagonist') => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  isScanning,
  onMetricsUpdate,
  onEventLog,
  activeSample,
  uploadedVideoUrl,
  onCaptureSnapshot,
  onSelectSamplePreset,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(30);
  const [isSubjectDetected, setIsSubjectDetected] = useState<boolean>(false);

  // Simulated canvas variables for sample mode
  const sampleTimeRef = useRef<number>(0);
  const fpsCountRef = useRef<number>(0);
  const fpsTimeRef = useRef<number>(Date.now());

  // Initialize Camera
  const initCamera = useCallback(async () => {
    if (activeSample || uploadedVideoUrl) return;

    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
        setHasCameraPermission(true);
        onEventLog('OPTICAL SENSOR CONNECTED', 'success');
        soundEffects.playTargetLocked();
      }
    } catch (err: unknown) {
      console.warn('Webcam access error:', err);
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('CAMERA ACCESS DENIED');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('CAMERA NOT FOUND');
      } else {
        setCameraError('CAMERA INITIALIZATION FAILED');
      }
      setHasCameraPermission(false);
      onEventLog('OPTICAL SENSOR OFFLINE // USE SAMPLE MODE', 'warning');
    }
  }, [activeSample, uploadedVideoUrl, onEventLog]);

  useEffect(() => {
    if (!activeSample && !uploadedVideoUrl) {
      initCamera();
    }

    return () => {
      // Cleanup camera stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [initCamera, activeSample, uploadedVideoUrl]);

  // Main Animation / Vision Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubDetected = false;

    const renderLoop = () => {
      // Calculate FPS
      fpsCountRef.current++;
      const now = Date.now();
      if (now - fpsTimeRef.current >= 1000) {
        setFps(fpsCountRef.current);
        fpsCountRef.current = 0;
        fpsTimeRef.current = now;
      }

      const width = canvas.width;
      const height = canvas.height;

      if (activeSample) {
        // --- SIMULATED MOTION MODE (For Sample Profiles) ---
        sampleTimeRef.current += 0.04;
        const t = sampleTimeRef.current;

        let sampleX = 0.5;
        let sampleY = 0.5;
        const boxWidth = 0.45;
        const boxHeight = 0.55;

        if (activeSample.npcType === 'IDLE NPC') {
          // Minimal breathing micro sway
          sampleX = 0.5 + Math.sin(t * 0.8) * 0.015;
          sampleY = 0.45 + Math.cos(t * 0.6) * 0.01;
        } else if (activeSample.npcType === 'LOOPING NPC') {
          // Strict oscillating patrol back and forth
          sampleX = 0.5 + Math.sin(t * 1.5) * 0.28;
          sampleY = 0.48 + Math.abs(Math.sin(t * 3)) * 0.02;
        } else {
          // Main character chaotic jumps & spins
          sampleX = 0.5 + Math.sin(t * 3.5) * 0.3 + Math.cos(t * 7.2) * 0.1;
          sampleY = 0.45 + Math.cos(t * 4.1) * 0.2 + Math.sin(t * 9.3) * 0.08;
        }

        const simBox: VisionBoundingBox = {
          x: Math.max(0.05, Math.min(0.55, sampleX - boxWidth / 2)),
          y: Math.max(0.05, Math.min(0.45, sampleY - boxHeight / 2)),
          width: boxWidth,
          height: boxHeight,
          detected: true,
          confidence: 0.96,
        };

        const simTrail: MotionPoint[] = [];
        for (let i = 12; i >= 0; i--) {
          const pt = t - i * 0.08;
          let px = 0.5;
          let py = 0.5;
          if (activeSample.npcType === 'IDLE NPC') {
            px = 0.5 + Math.sin(pt * 0.8) * 0.015;
            py = 0.45 + Math.cos(pt * 0.6) * 0.01;
          } else if (activeSample.npcType === 'LOOPING NPC') {
            px = 0.5 + Math.sin(pt * 1.5) * 0.28;
            py = 0.48 + Math.abs(Math.sin(pt * 3)) * 0.02;
          } else {
            px = 0.5 + Math.sin(pt * 3.5) * 0.3 + Math.cos(pt * 7.2) * 0.1;
            py = 0.45 + Math.cos(pt * 4.1) * 0.2 + Math.sin(pt * 9.3) * 0.08;
          }
          simTrail.push({ x: px, y: py, time: now - i * 80, intensity: 0.8 });
        }

        visionEngine.drawHUDOverlay(ctx, width, height, simBox, simTrail, isScanning, 60);

        // Add simulated noise / slight jitter to sample metrics
        const jitter = (Math.random() - 0.5) * 3;
        const liveSampleMetrics: BehavioralMetrics = {
          movementRandomness: Math.round(Math.max(1, Math.min(99, activeSample.metrics.movementRandomness + jitter))),
          pathRepetition: Math.round(Math.max(1, Math.min(99, activeSample.metrics.pathRepetition - jitter * 0.5))),
          idleBehavior: Math.round(Math.max(1, Math.min(99, activeSample.metrics.idleBehavior + jitter * 0.2))),
          directionChanges: Math.round(Math.max(1, Math.min(99, activeSample.metrics.directionChanges + jitter))),
          activityLevel: Math.round(Math.max(1, Math.min(99, activeSample.metrics.activityLevel + jitter))),
          movementRepetition: Math.round(Math.max(1, Math.min(99, activeSample.metrics.movementRepetition - jitter * 0.4))),
          predictability: Math.round(Math.max(1, Math.min(99, activeSample.metrics.predictability - jitter * 0.3))),
          loopDetected: activeSample.metrics.loopDetected,
        };

        onMetricsUpdate(liveSampleMetrics);
        if (!isSubDetected) {
          isSubDetected = true;
          setIsSubjectDetected(true);
        }
      } else if (videoRef.current) {
        // --- REAL WEBCAM / VIDEO PROCESSING ---
        const { metrics, boundingBox, trail } = visionEngine.processVideoFrame(videoRef.current);
        visionEngine.drawHUDOverlay(ctx, width, height, boundingBox, trail, isScanning, fps);
        onMetricsUpdate(metrics);

        if (boundingBox.detected !== isSubDetected) {
          isSubDetected = boundingBox.detected;
          setIsSubjectDetected(boundingBox.detected);
          if (boundingBox.detected) {
            onEventLog('SUBJECT DETECTED IN CAMERA FRAME', 'info');
          } else {
            onEventLog('SUBJECT LOST // SEARCHING FRAME', 'warning');
          }
        }
      }

      // Snapshot trigger during active scanning
      if (isScanning && Math.random() < 0.05) {
        try {
          const snapCanvas = document.createElement('canvas');
          snapCanvas.width = 320;
          snapCanvas.height = 240;
          const sCtx = snapCanvas.getContext('2d');
          if (sCtx) {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              sCtx.drawImage(videoRef.current, 0, 0, 320, 240);
            } else {
              sCtx.fillStyle = '#0d111a';
              sCtx.fillRect(0, 0, 320, 240);
              sCtx.fillStyle = '#00ff66';
              sCtx.font = '16px "Orbitron", sans-serif';
              sCtx.fillText('SUBJECT SCAN #0047', 40, 120);
            }
            onCaptureSnapshot(snapCanvas.toDataURL('image/jpeg', 0.8));
          }
        } catch {
          // Ignore
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [activeSample, isScanning, onMetricsUpdate, onEventLog, fps, onCaptureSnapshot]);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black rounded-lg border border-cyber-green/40 overflow-hidden box-glow-green hud-corner-box">
      {/* Background Hidden Video for Frame Processing */}
      <video
        ref={videoRef}
        src={uploadedVideoUrl || undefined}
        playsInline
        muted
        loop
        className={`w-full h-full object-cover ${activeSample ? 'opacity-20 filter grayscale' : 'opacity-85'}`}
      />

      {/* Simulated Avatar Silhouette if in Sample Mode */}
      {activeSample && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full border border-cyber-green/30 bg-cyber-green/5 flex items-center justify-center mb-4 animate-pulse">
            <Sparkles className="w-12 h-12 text-cyber-green/70" />
          </div>
          <div className="bg-black/80 border border-cyber-green/50 px-4 py-1.5 rounded text-xs font-mono-tech text-cyber-green box-glow-green">
            [ SIMULATED TEST PROFILE: {activeSample.name} ]
          </div>
        </div>
      )}

      {/* Primary HUD Overlay Canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Sweeping Scan Line when Scanning */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-1.5 bg-cyber-green shadow-[0_0_15px_#00ff66] animate-sweep" />
          <div className="absolute inset-0 bg-cyber-green/5 animate-pulse" />
        </div>
      )}

      {/* Top HUD Status Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-cyber-border px-2.5 py-1 rounded text-[11px] font-mono-tech">
          <span
            className={`w-2 h-2 rounded-full ${
              isSubjectDetected ? 'bg-cyber-green animate-ping' : 'bg-cyber-amber'
            }`}
          />
          <span className={isSubjectDetected ? 'text-cyber-green font-bold' : 'text-cyber-amber'}>
            {isSubjectDetected ? 'SUBJECT DETECTED' : 'SEARCHING FOR NPC...'}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-cyber-border px-2.5 py-1 rounded text-[11px] font-mono-tech text-cyber-hudMuted">
          {isScanning ? (
            <span className="text-cyber-green flex items-center gap-1 font-bold animate-pulse">
              <Play className="w-3 h-3 fill-current" /> SCAN ACTIVE
            </span>
          ) : (
            <span className="text-slate-400">STANDBY</span>
          )}
        </div>
      </div>

      {/* Bottom Status Bar Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[10px] sm:text-[11px] font-mono-tech text-cyber-hudMuted bg-black/70 px-3 py-1.5 rounded border border-white/5 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <span>RES: 640x480</span>
          <span>FPS: {fps}</span>
          <span className="text-cyber-cyan">
            MODE: {activeSample ? 'SIMULATION' : uploadedVideoUrl ? 'VIDEO_FILE' : 'WEBCAM_LIVE'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-cyber-green">
          <CheckCircle2 className="w-3 h-3" />
          <span>CV TRACKING OPTIMAL</span>
        </div>
      </div>

      {/* Camera Permission Denied / Error Overlay */}
      {hasCameraPermission === false && !activeSample && !uploadedVideoUrl && (
        <div className="absolute inset-0 bg-cyber-bg/95 flex flex-col items-center justify-center p-6 text-center z-20">
          <div className="w-14 h-14 rounded-full bg-cyber-crimson/20 border border-cyber-crimson flex items-center justify-center mb-4 text-cyber-crimson">
            <CameraOff className="w-7 h-7" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1 tracking-wide">
            {cameraError || 'CAMERA ACCESS DENIED'}
          </h3>
          <p className="text-xs font-mono-tech text-slate-400 max-w-sm mb-5">
            “NPC ANO cannot observe the subject without visual sensors. Fortunately, the NPC database does not strictly require one.”
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={initCamera}
              className="flex items-center gap-2 px-4 py-2 rounded bg-cyber-surface border border-slate-600 hover:border-white text-xs font-mono-tech text-white transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              TRY AGAIN
            </button>
            <button
              onClick={() => onSelectSamplePreset('idle')}
              className="flex items-center gap-2 px-4 py-2 rounded bg-cyber-green/20 border border-cyber-green text-xs font-mono-tech text-cyber-green box-glow-green font-bold hover:bg-cyber-green/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              USE SAMPLE MODE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
