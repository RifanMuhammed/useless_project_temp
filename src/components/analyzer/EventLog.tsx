import React from 'react';
import { Terminal, Clock } from 'lucide-react';
import type { LiveEvent } from '../../types/npc';

interface EventLogProps {
  events: LiveEvent[];
}

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
  return (
    <div className="bg-cyber-panel border border-cyber-borderSubtle rounded-lg p-3.5 font-mono-tech">
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-xs text-cyber-hudMuted">
        <div className="flex items-center gap-1.5 text-cyber-green">
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-bold text-[11px]">LIVE SURVEILLANCE FEED</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Clock className="w-3 h-3" />
          <span>EVENTS: {events.length}</span>
        </div>
      </div>

      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 text-xs">
        {events.length === 0 ? (
          <div className="text-slate-600 text-[11px] py-2 text-center italic">
            Awaiting optical activity feed...
          </div>
        ) : (
          events.slice(-6).map((ev) => {
            let textColor = 'text-slate-300';
            if (ev.type === 'alert') textColor = 'text-cyber-crimson font-semibold';
            if (ev.type === 'warning') textColor = 'text-cyber-amber';
            if (ev.type === 'success') textColor = 'text-cyber-green font-semibold';

            return (
              <div key={ev.id} className="flex items-center gap-2 text-[11px] leading-tight">
                <span className="text-slate-500 text-[10px] shrink-0 font-mono">{ev.timestamp}</span>
                <span className="text-cyber-green/40">›</span>
                <span className={`${textColor} truncate`}>{ev.text}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
