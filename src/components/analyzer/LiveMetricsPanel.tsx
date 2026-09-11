import React from 'react';
import { Activity, RotateCw, PauseCircle, Compass, Zap, Radio } from 'lucide-react';
import type { BehavioralMetrics } from '../../types/npc';

interface LiveMetricsPanelProps {
  metrics: BehavioralMetrics;
  isScanning: boolean;
  scanProgress: number; // 0 - 100%
}

export const LiveMetricsPanel: React.FC<LiveMetricsPanelProps> = ({
  metrics,
  isScanning,
  scanProgress,
}) => {
  // Helper to render cyber ascii block representation
  const renderAsciiBar = (value: number) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((value / 100) * totalBlocks);
    const filled = '█'.repeat(Math.max(0, filledBlocks));
    const empty = '░'.repeat(Math.max(0, totalBlocks - filledBlocks));
    return `${filled}${empty}`;
  };

  const metricItems = [
    {
      id: 'randomness',
      label: 'MOVEMENT RANDOMNESS',
      value: metrics.movementRandomness,
      icon: Activity,
      color: metrics.movementRandomness > 70 ? 'text-cyber-cyan' : 'text-slate-400',
      barColor: 'bg-cyber-cyan',
      desc: 'Chaos vs. Scripted Trajectory',
    },
    {
      id: 'path-repetition',
      label: 'PATH REPETITION',
      value: metrics.pathRepetition,
      icon: RotateCw,
      color: metrics.pathRepetition > 75 ? 'text-cyber-green' : 'text-slate-400',
      barColor: 'bg-cyber-green',
      desc: 'Linear oscillation & patrol cycles',
    },
    {
      id: 'idle',
      label: 'IDLE BEHAVIOR',
      value: metrics.idleBehavior,
      icon: PauseCircle,
      color: metrics.idleBehavior > 70 ? 'text-cyber-purple' : 'text-slate-400',
      barColor: 'bg-cyber-purple',
      desc: 'Waiting for player interaction',
    },
    {
      id: 'direction-changes',
      label: 'DIRECTION CHANGES',
      value: metrics.directionChanges,
      icon: Compass,
      color: 'text-cyber-amber',
      barColor: 'bg-cyber-amber',
      desc: 'Angle shifts & path divergence',
    },
    {
      id: 'activity',
      label: 'ACTIVITY LEVEL',
      value: metrics.activityLevel,
      icon: Zap,
      color: 'text-cyber-greenGlow',
      barColor: 'bg-cyber-green',
      desc: 'Total optical energy delta',
    },
  ];

  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5 box-glow-green hud-corner-box flex flex-col justify-between h-full">
      <div>
        {/* Header with Scan Progress */}
        <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isScanning ? 'text-cyber-green animate-pulse' : 'text-slate-500'}`} />
            <span className="font-display text-sm font-bold text-white tracking-wider">
              LIVE BEHAVIOR TELEMETRY
            </span>
          </div>
          <span className="text-xs font-mono-tech text-cyber-hudMuted">
            {isScanning ? `ANALYZING [${Math.round(scanProgress)}%]` : 'READY'}
          </span>
        </div>

        {/* Scan Progress Bar */}
        {isScanning && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-cyber-green mb-1">
              <span>SCAN PROGRESS</span>
              <span>{Math.round(scanProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-cyber-green/30">
              <div
                className="h-full bg-cyber-green shadow-[0_0_10px_#00ff66] transition-all duration-200"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Dynamic Metric Bars */}
        <div className="space-y-3.5">
          {metricItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="group">
                <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span className="font-medium tracking-wide">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-slate-500 text-[11px]">
                      {renderAsciiBar(item.value)}
                    </span>
                    <span className={`font-bold ${item.color}`}>{item.value}%</span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-2 bg-black/50 rounded overflow-hidden border border-cyber-borderSubtle">
                  <div
                    className={`h-full ${item.barColor} transition-all duration-300 shadow-sm`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loop Detection Radar Indicator */}
      <div className="mt-5 pt-4 border-t border-cyber-borderSubtle">
        <div className="flex items-center justify-between bg-black/40 border border-cyber-borderSubtle p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full border border-cyber-green/40 flex items-center justify-center overflow-hidden bg-cyber-surface">
              <div
                className={`absolute inset-0 border-r-2 border-cyber-green/80 origin-center ${
                  metrics.loopDetected ? 'animate-radar-sweep' : ''
                }`}
              />
              <span className={`w-2 h-2 rounded-full ${metrics.loopDetected ? 'bg-cyber-green animate-ping' : 'bg-slate-600'}`} />
            </div>
            <div>
              <div className="text-[11px] font-mono-tech text-slate-400">PATROL ROUTE DETECTION</div>
              <div className="font-display text-xs font-bold text-white">
                LOOP BEHAVIOR:{' '}
                <span className={metrics.loopDetected ? 'text-cyber-green glow-green' : 'text-slate-400'}>
                  {metrics.loopDetected ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${
              metrics.loopDetected
                ? 'bg-cyber-green/15 border-cyber-green/40 text-cyber-green'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {metrics.loopDetected ? 'CYCLES DETECTED' : 'UNSCRIPTED'}
          </span>
        </div>
      </div>
    </div>
  );
};
