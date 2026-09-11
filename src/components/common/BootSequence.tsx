import React, { useEffect, useState } from 'react';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';
import { soundEffects } from '../../services/audioService';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    soundEffects.playBootSequence();

    const sequence: { text: string; delay: number }[] = [
      { text: 'SYSTEM INITIALIZING...', delay: 200 },
      { text: 'CAMERA MODULE: READY', delay: 500 },
      { text: 'BEHAVIOR ENGINE: READY', delay: 850 },
      { text: 'NPC DATABASE: READY', delay: 1200 },
      { text: 'USEFULNESS LEVEL: 0%', delay: 1550 },
      { text: '>> SYSTEM ONLINE <<', delay: 1900 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    sequence.forEach((item, index) => {
      const timer = setTimeout(() => {
        setStep(index + 1);
        setLogs((prev) => [...prev, item.text]);
        soundEffects.playClick(800 + index * 150);
      }, item.delay);
      timers.push(timer);
    });

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2400);
    timers.push(finishTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-bg cyber-grid crt-overlay p-4">
      {/* Central Terminal Window */}
      <div className="w-full max-w-lg bg-cyber-panel border border-cyber-green/50 rounded-lg p-6 sm:p-8 box-glow-green hud-corner-box relative shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-6 font-mono-tech text-xs">
          <div className="flex items-center gap-2 text-cyber-green">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span className="font-bold">NPC ANO // BOOT SEQUENCE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
            <span className="text-slate-400">SYS_V2.4</span>
          </div>
        </div>

        {/* Glitch Animated Logo */}
        <div className="text-center my-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyber-green/10 border border-cyber-green/40 mb-3 animate-pulse">
            <Cpu className="w-8 h-8 text-cyber-green" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider text-white glow-green">
            NPC ANO
          </h1>
          <p className="font-mono-tech text-xs sm:text-sm text-cyber-hudMuted mt-1 tracking-widest">
            “ARE YOU AN NPC?”
          </p>
        </div>

        {/* Terminal Output Log */}
        <div className="bg-black/60 border border-cyber-borderSubtle rounded p-4 font-mono-tech text-xs sm:text-sm space-y-1.5 min-h-[140px]">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 ${
                log.includes('ONLINE')
                  ? 'text-cyber-green font-bold glow-green text-sm'
                  : log.includes('USEFULNESS')
                  ? 'text-cyber-amber font-semibold'
                  : 'text-slate-300'
              }`}
            >
              <span className="text-cyber-green/60">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
          {step < 6 && (
            <div className="flex items-center gap-1 text-cyber-green animate-pulse">
              <span>_</span>
            </div>
          )}
        </div>

        {/* Action Controls & Disclaimer footnote */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyber-borderSubtle">
          <span className="text-[11px] font-mono-tech text-slate-500 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-cyber-amber" />
            Fictional Behavioral Terminal
          </span>
          <button
            onClick={onComplete}
            className="text-xs font-mono-tech px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            [ SKIP BOOT ]
          </button>
        </div>
      </div>
    </div>
  );
};
