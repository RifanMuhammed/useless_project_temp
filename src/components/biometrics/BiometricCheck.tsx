import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Play, Sparkles, ShieldCheck } from 'lucide-react';
import { visionEngine } from '../../services/visionEngine';
import type { BehavioralMetrics } from '../../types/npc';
import { soundEffects } from '../../services/audioService';

interface BiometricCheckProps {
  onScanComplete: (metrics: BehavioralMetrics, snapshotDataUrl?: string) => void;
  onSkip: () => void;
}

export const BiometricCheck: React.FC<BiometricCheckProps> = ({
  onScanComplete,
  onSkip,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [latestSnapshot, setLatestSnapshot] = useState<string | undefined>(undefined);

  const [liveMetrics, setLiveMetrics] = useState<BehavioralMetrics>({
    movementRandomness: 45,
    pathRepetition: 50,
    idleBehavior: 30,
    directionChanges: 40,
    activityLevel: 45,
    movementRepetition: 40,
    predictability: 50,
    loopDetected: false,
  });

  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
        setHasCameraPermission(true);
        soundEffects.playTargetLocked();
      }
    } catch {
      setHasCameraPermission(false);
    }
  }, []);

  useEffect(() => {
    initCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [initCamera]);

  // Main Vision Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderLoop = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const { metrics, boundingBox, trail } = visionEngine.processVideoFrame(videoRef.current);
        visionEngine.drawHUDOverlay(ctx, canvas.width, canvas.height, boundingBox, trail, isScanning, 60);
        setLiveMetrics(metrics);

        // Snapshot capture
        if (isScanning && !latestSnapshot && Math.random() < 0.2) {
          try {
            const snapCanvas = document.createElement('canvas');
            snapCanvas.width = 320;
            snapCanvas.height = 240;
            const sCtx = snapCanvas.getContext('2d');
            if (sCtx) {
              sCtx.drawImage(videoRef.current, 0, 0, 320, 240);
              setLatestSnapshot(snapCanvas.toDataURL('image/jpeg', 0.8));
            }
          } catch {
            // Ignore
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isScanning, latestSnapshot]);

  // Start 5-second biometric scan
  const startBiometricScan = () => {
    soundEffects.playTargetLocked();
    setIsScanning(true);
    setCountdown(5);

    let remaining = 5;
    const timer = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      soundEffects.playScanTick();

      if (remaining <= 0) {
        clearInterval(timer);
        setIsScanning(false);
        onScanComplete(liveMetrics, latestSnapshot);
      }
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-mono-tech">
      <div className="bg-cyber-panel border-2 border-cyber-cyan rounded-2xl p-6 box-glow-cyan hud-corner-box shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
          <div className="flex items-center gap-2 text-cyber-cyan">
            <Camera className="w-5 h-5 animate-pulse" />
            <span className="font-display font-bold text-sm tracking-wider text-white">
              OPTIONAL BIOMETRIC MOTION SCAN (5s)
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan">
            SENSOR READY
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          The camera will observe your posture & stillness for 5 seconds to compute a biometric modifier. You can skip directly to results at any time.
        </p>

        {/* Camera Container */}
        <div className="relative aspect-[4/3] bg-black rounded-lg border border-cyber-cyan/40 overflow-hidden mb-6">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Sweeping scan beam */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-1.5 bg-cyber-cyan shadow-[0_0_15px_#00f0ff] animate-sweep" />
              <div className="absolute top-4 right-4 bg-black/80 border border-cyber-cyan px-3 py-1 rounded text-cyber-cyan font-bold text-sm">
                SCANNING: {countdown}s
              </div>
            </div>
          )}

          {/* Fallback if no camera */}
          {hasCameraPermission === false && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
              <Sparkles className="w-10 h-10 text-cyber-amber mb-2" />
              <div className="font-display font-bold text-white text-sm mb-1">
                CAMERA SENSOR OFFLINE
              </div>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                No camera detected. You can proceed directly with your psychological quiz score!
              </p>
              <button
                onClick={onSkip}
                className="px-5 py-2 rounded-lg bg-cyber-green text-black font-bold text-xs"
              >
                PROCEED TO RESULTS
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={onSkip}
            className="px-4 py-2.5 rounded-lg bg-cyber-surface border border-slate-700 hover:border-slate-500 text-slate-300 text-xs transition-all"
          >
            SKIP BIOMETRIC SCAN →
          </button>

          {!isScanning ? (
            <button
              onClick={startBiometricScan}
              disabled={hasCameraPermission === false}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyber-cyan text-black font-display font-bold text-xs tracking-wider hover:bg-cyan-300 box-glow-cyan transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              START 5-SECOND SCAN
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-cyber-cyan font-bold animate-pulse">
              <ShieldCheck className="w-4 h-4" />
              MEASURING POSTURE STILLNESS ({countdown}s)...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
