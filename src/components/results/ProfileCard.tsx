import React, { useRef, useState } from 'react';
import { Download, Copy, Check, Shield, Sparkles, QrCode } from 'lucide-react';
import type { ScanResult } from '../../types/npc';
import { soundEffects } from '../../services/audioService';

interface ProfileCardProps {
  result: ScanResult;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ result }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleCopySummary = () => {
    soundEffects.playClick(1400);
    const text = `🎮 NPC ANO — SCAN REPORT
Subject: ${result.subjectCode}
NPC Score: ${result.npcScore}% [${result.npcLevel}]
Type: ${result.npcType}
Main Character Potential: ${result.mainCharacterPotential}%
Path Repetition: ${result.metrics.pathRepetition}% | Idle: ${result.metrics.idleBehavior}%
Observation: "${result.observations[0] || 'Behavior appears questionable.'}"
Test your NPC rating at NPC ANO!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCard = async () => {
    soundEffects.playClick(1600);
    setIsExporting(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark background
      ctx.fillStyle = '#07090e';
      ctx.fillRect(0, 0, 800, 1000);

      // Grid background
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 800; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1000);
        ctx.stroke();
      }
      for (let y = 0; y < 1000; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
      }

      // Border & Corner Brackets
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, 740, 940);

      // Header Banner
      ctx.fillStyle = 'rgba(0, 255, 102, 0.1)';
      ctx.fillRect(30, 30, 740, 90);
      ctx.fillStyle = '#00ff66';
      ctx.font = 'bold 36px "Orbitron", sans-serif';
      ctx.fillText('NPC ANO // ID BADGE', 60, 85);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillText(`SUBJECT: ${result.subjectCode} | SPECIMEN RECORD`, 60, 110);

      // Score Box
      ctx.fillStyle = '#131926';
      ctx.fillRect(60, 150, 680, 170);
      ctx.strokeStyle = '#00ff66';
      ctx.strokeRect(60, 150, 680, 170);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillText('OFFICIAL NPC CLASSIFICATION SCORE', 90, 185);

      ctx.fillStyle = '#00ff66';
      ctx.font = 'bold 72px "Orbitron", sans-serif';
      ctx.fillText(`${result.npcScore}%`, 90, 265);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Orbitron", sans-serif';
      ctx.fillText(result.npcLevel, 320, 235);

      ctx.fillStyle = '#00f0ff';
      ctx.font = '20px "JetBrains Mono", monospace';
      ctx.fillText(`TYPE: ${result.npcType}`, 320, 275);

      // Telemetry Breakdown
      ctx.fillStyle = '#131926';
      ctx.fillRect(60, 340, 680, 250);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(60, 340, 680, 250);

      ctx.fillStyle = '#00ff66';
      ctx.font = 'bold 18px "Orbitron", sans-serif';
      ctx.fillText('BEHAVIORAL TELEMETRY MATRIX', 90, 380);

      const metricsList = [
        { label: 'MOVEMENT RANDOMNESS', val: `${result.metrics.movementRandomness}%` },
        { label: 'PATH REPETITION', val: `${result.metrics.pathRepetition}%` },
        { label: 'IDLE BEHAVIOR', val: `${result.metrics.idleBehavior}%` },
        { label: 'DIRECTION CHANGES', val: `${result.metrics.directionChanges}%` },
        { label: 'MAIN CHARACTER POTENTIAL', val: `${result.mainCharacterPotential}%` },
      ];

      metricsList.forEach((m, idx) => {
        const yPos = 420 + idx * 30;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px "JetBrains Mono", monospace';
        ctx.fillText(m.label, 90, yPos);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(m.val, 650, yPos);
      });

      // Observations Box
      ctx.fillStyle = '#131926';
      ctx.fillRect(60, 610, 680, 220);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(60, 610, 680, 220);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 18px "Orbitron", sans-serif';
      ctx.fillText('SYSTEM OBSERVATIONS', 90, 645);

      result.observations.slice(0, 3).forEach((obs, idx) => {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillText(`› ${obs}`, 90, 685 + idx * 40);
      });

      // Barcode / Footer stamp
      ctx.fillStyle = '#00ff66';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText('FICTIONAL ENTERTAINMENT SYSTEM // USEFULNESS: 0.0%', 60, 890);

      ctx.fillStyle = '#475569';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText('NPC ANO — ADVANCED BEHAVIORAL EXPERIMENT', 60, 915);

      // Barcode lines
      for (let i = 0; i < 40; i++) {
        const lw = Math.random() > 0.5 ? 3 : 1.5;
        ctx.fillStyle = '#00ff66';
        ctx.fillRect(520 + i * 5, 870, lw, 50);
      }

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `NPC-ANO-${result.subjectCode}.png`;
      a.click();
    } catch (err) {
      console.warn('Failed to export canvas card', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual Cyber Card Container */}
      <div
        ref={cardRef}
        className="w-full max-w-md mx-auto bg-cyber-panel border-2 border-cyber-green rounded-xl p-5 sm:p-6 shadow-2xl box-glow-green hud-corner-box relative font-mono-tech overflow-hidden"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
          <div className="flex items-center gap-2 text-cyber-green">
            <Shield className="w-5 h-5" />
            <span className="font-display font-bold text-sm tracking-wider text-white">
              NPC ANO // SPECIMEN ID
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-cyber-green/10 border border-cyber-green/40 text-cyber-green">
            {result.subjectCode}
          </span>
        </div>

        {/* Snapshot / Avatar + Score Header */}
        <div className="flex items-center gap-4 bg-cyber-surface p-4 rounded-lg border border-cyber-borderSubtle mb-4">
          {result.snapshotDataUrl ? (
            <img
              src={result.snapshotDataUrl}
              alt="Subject Snapshot"
              className="w-20 h-20 rounded border border-cyber-green/50 object-cover shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded border border-cyber-green/30 bg-black/60 flex items-center justify-center shrink-0 text-cyber-green">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-cyber-hudMuted uppercase">CLASSIFICATION SCORE</div>
            <div className="font-display text-3xl font-extrabold text-cyber-green glow-green">
              {result.npcScore}%
            </div>
            <div className="font-display text-xs font-bold text-white uppercase tracking-wider truncate">
              {result.npcLevel}
            </div>
            <div className="text-[11px] text-cyber-cyan font-semibold">
              {result.npcType}
            </div>
          </div>
        </div>

        {/* Metric Summary Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="bg-black/40 border border-white/5 p-2.5 rounded">
            <div className="text-[10px] text-slate-400">RANDOMNESS</div>
            <div className="font-bold text-cyber-cyan text-sm">{result.metrics.movementRandomness}%</div>
          </div>
          <div className="bg-black/40 border border-white/5 p-2.5 rounded">
            <div className="text-[10px] text-slate-400">PATH REPETITION</div>
            <div className="font-bold text-cyber-green text-sm">{result.metrics.pathRepetition}%</div>
          </div>
          <div className="bg-black/40 border border-white/5 p-2.5 rounded">
            <div className="text-[10px] text-slate-400">IDLE STILLNESS</div>
            <div className="font-bold text-cyber-purple text-sm">{result.metrics.idleBehavior}%</div>
          </div>
          <div className="bg-black/40 border border-white/5 p-2.5 rounded">
            <div className="text-[10px] text-slate-400">MC POTENTIAL</div>
            <div className="font-bold text-cyber-amber text-sm">{result.mainCharacterPotential}%</div>
          </div>
        </div>

        {/* Observation Quote */}
        <div className="bg-cyber-surface/50 border-l-2 border-cyber-green p-3 rounded-r text-xs text-slate-200 italic mb-4">
          “{result.observations[0] || 'Subject appears to be waiting for the player.'}”
        </div>

        {/* Footer Barcode & Watermark */}
        <div className="flex items-center justify-between border-t border-cyber-borderSubtle pt-3 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-cyber-green/80" />
            <span>USEFULNESS: 0%</span>
          </div>
          <span className="font-mono">SYS_AUTH_2026</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleDownloadCard}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyber-green text-black font-display font-bold text-xs tracking-wide hover:bg-cyber-greenGlow box-glow-green transition-all"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'GENERATING PNG...' : 'DOWNLOAD ID CARD'}
        </button>

        <button
          onClick={handleCopySummary}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyber-surface border border-slate-700 hover:border-cyber-green text-white font-mono-tech text-xs transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
          {copied ? 'COPIED TO CLIPBOARD' : 'COPY REPORT TEXT'}
        </button>
      </div>
    </div>
  );
};
