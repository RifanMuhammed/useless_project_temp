import React, { useRef } from 'react';
import { Camera, Sparkles, Upload, RotateCw, PauseCircle, Zap } from 'lucide-react';
import type { SampleProfile } from '../../types/npc';
import { SAMPLE_PROFILES } from '../../constants/samples';
import { soundEffects } from '../../services/audioService';

interface SampleSelectorProps {
  activeSample: SampleProfile | null;
  uploadedVideoUrl: string | null;
  onSelectSample: (profile: SampleProfile | null) => void;
  onUploadVideo: (url: string | null) => void;
}

export const SampleSelector: React.FC<SampleSelectorProps> = ({
  activeSample,
  uploadedVideoUrl,
  onSelectSample,
  onUploadVideo,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLiveCameraClick = () => {
    soundEffects.playClick(1300);
    onSelectSample(null);
    onUploadVideo(null);
  };

  const handleSampleClick = (preset: 'idle' | 'looping' | 'protagonist') => {
    soundEffects.playClick(1500);
    onUploadVideo(null);
    onSelectSample(SAMPLE_PROFILES[preset]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    soundEffects.playClick(1400);
    const objectUrl = URL.createObjectURL(file);
    onSelectSample(null);
    onUploadVideo(objectUrl);
  };

  const sampleOptions = [
    {
      key: 'idle' as const,
      name: '01: IDLE NPC',
      desc: 'Stillness, standing vendor',
      icon: PauseCircle,
      badge: '94% NPC',
    },
    {
      key: 'looping' as const,
      name: '02: LOOPING NPC',
      desc: 'Pacing back-and-forth patrol',
      icon: RotateCw,
      badge: '91% NPC',
    },
    {
      key: 'protagonist' as const,
      name: '03: PROTAGONIST',
      desc: 'Erratic, chaotic movement',
      icon: Zap,
      badge: '14% NPC',
    },
  ];

  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-4 font-mono-tech">
      <div className="flex items-center justify-between border-b border-cyber-borderSubtle pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyber-green" />
          <span className="font-display text-xs font-bold text-white tracking-wider">
            INPUT SOURCE & SAMPLE BENCHMARKS
          </span>
        </div>
        <span className="text-[10px] text-cyber-hudMuted hidden sm:inline">
          JUDGE BENCHMARK MODE READY
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {/* Live Camera Button */}
        <button
          onClick={handleLiveCameraClick}
          className={`flex flex-col items-center justify-center p-2.5 rounded border transition-all text-center ${
            !activeSample && !uploadedVideoUrl
              ? 'bg-cyber-green/20 border-cyber-green text-cyber-green box-glow-green font-bold'
              : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4 mb-1" />
          <span className="text-[11px] font-bold">WEBCAM LIVE</span>
          <span className="text-[9px] text-slate-500 mt-0.5">Real Sensor</span>
        </button>

        {/* 3 Preset Samples */}
        {sampleOptions.map((sample) => {
          const Icon = sample.icon;
          const isSelected = activeSample?.id === SAMPLE_PROFILES[sample.key].id;
          return (
            <button
              key={sample.key}
              onClick={() => handleSampleClick(sample.key)}
              className={`flex flex-col items-center justify-center p-2.5 rounded border transition-all text-center ${
                isSelected
                  ? 'bg-cyber-green/20 border-cyber-green text-cyber-green box-glow-green font-bold'
                  : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mb-1 text-cyber-green" />
              <span className="text-[11px] font-bold">{sample.name}</span>
              <span className="text-[9px] text-cyber-cyan mt-0.5">{sample.badge}</span>
            </button>
          );
        })}

        {/* Upload Video Button */}
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-full flex flex-col items-center justify-center p-2.5 rounded border transition-all text-center ${
              uploadedVideoUrl
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan box-glow-cyan font-bold'
                : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-bold">UPLOAD VIDEO</span>
            <span className="text-[9px] text-slate-500 mt-0.5">MP4 / WEBM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
