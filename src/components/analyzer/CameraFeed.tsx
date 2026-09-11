import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraOff, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import { visionEngine } from '../../services/visionEngine';
import type { BehavioralMetrics } from '../../types/npc';
import { soundEffects } from '../../services/audioService';

interface CameraFeedProps {
  isScanning: boolean;
  onMetricsUpdate: (metrics: BehavioralMetrics) => void;
  onEventLog: (text: string, type?: 'info' | 'warning' | 'alert' | 'success') => void;
  onCaptureSnapshot: (dataUrl: string) => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  isScanning,
  onMetricsUpdate,
  onEventLog,
  onCaptureSnapshot,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(30);
  const [isSubjectDetected, setIsSubjectDetected] = useState<boolean>(false);

  const fpsCountRef = useRef<number>(0);
  const fpsTimeRef = useRef<number>(Date.now());

  // Initialize Camera
  const initCamera = useCallback(async () => {
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
      onEventLog('OPTICAL SENSOR OFFLINE', 'warning');
    }
  }, [onEventLog]);

  useEffect(() => {
    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [initCamera]);

  // Main Animation / Vision Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubDetected = false;

    const renderLoop = () => {
      fpsCountRef.current++;
      const now = Date.now();
      if (now - fpsTimeRef.current >= 1000) {
        setFps(fpsCountRef.current);
        fpsCountRef.current = 0;
        fpsTimeRef.current = now;
      }

      const width = canvas.width;
      const height = canvas.height;

      if (videoRef.current) {
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

      // Snapshot capture during active scan
      if (isScanning && Math.random() < 0.05) {
        try {
          const snapCanvas = document.createElement('canvas');
          snapCanvas.width = 320;
          snapCanvas.height = 240;
          const sCtx = snapCanvas.getContext('2d');
          if (sCtx && videoRef.current && videoRef.current.readyState >= 2) {
            sCtx.drawImage(videoRef.current, 0, 0, 320, 240);
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
  }, [isScanning, onMetricsUpdate, onEventLog, fps, onCaptureSnapshot]);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black rounded-lg border border-cyber-green/40 overflow-hidden box-glow-green hud-corner-box">
      {/* Webcam Video */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="w-full h-full object-cover opacity-85"
      />

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
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none font-mono-tech">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-cyber-border px-2.5 py-1 rounded text-[11px]">
          <span
            className={`w-2 h-2 rounded-full ${
              isSubjectDetected ? 'bg-cyber-green animate-ping' : 'bg-cyber-amber'
            }`}
          />
          <span className={isSubjectDetected ? 'text-cyber-green font-bold' : 'text-cyber-amber'}>
            {isSubjectDetected ? 'SUBJECT DETECTED' : 'SEARCHING FOR SUBJECT...'}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-cyber-border px-2.5 py-1 rounded text-[11px] text-cyber-hudMuted">
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
          <span className="text-cyber-cyan">WEBCAM LIVE SENSOR</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-cyber-green">
          <CheckCircle2 className="w-3 h-3" />
          <span>CV TRACKING OPTIMAL</span>
        </div>
      </div>

      {/* Camera Error Overlay */}
      {hasCameraPermission === false && (
        <div className="absolute inset-0 bg-cyber-bg/95 flex flex-col items-center justify-center p-6 text-center z-20 font-mono-tech">
          <div className="w-14 h-14 rounded-full bg-cyber-crimson/20 border border-cyber-crimson flex items-center justify-center mb-4 text-cyber-crimson">
            <CameraOff className="w-7 h-7" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1 tracking-wide">
            {cameraError || 'CAMERA ACCESS DENIED'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-5">
            “NPC ANO cannot observe the subject without camera permissions. Please grant camera access or use the 6-Question Psychological Test.”
          </p>
          <button
            onClick={initCamera}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-cyber-surface border border-slate-600 hover:border-white text-xs text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            TRY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};
