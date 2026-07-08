import React from 'react';
import { Compass, ShieldAlert } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="relative w-full overflow-hidden border-b border-stadium-border/60 bg-stadium-dark/45 px-6 py-5 backdrop-blur-md">
      {/* Visual background gradient glow */}
      <div className="absolute -top-24 left-1/2 h-48 w-[600px] -translate-x-1/2 rounded-full bg-stadium-green/10 blur-[100px] pointer-events-none" />
      
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-stadium-green to-stadium-mint shadow-lg shadow-stadium-green/20">
            <Compass className="h-6 w-6 text-stadium-dark animate-spin-slow" />
            <div className="absolute inset-0 rounded-xl border border-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-outfit text-2xl font-extrabold tracking-tight text-white m-0">
                RecoveryFlow <span className="text-stadium-green">AI</span>
              </h1>
              <span className="hidden rounded-full border border-stadium-green/30 bg-stadium-green/10 px-2 py-0.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-stadium-green sm:inline-block">
                World Cup 2026 Edition
              </span>
            </div>
            <p className="font-inter text-xs text-gray-400 mt-0.5">
              Smart Stadium Exit & Routing Coordinator
            </p>
          </div>
        </div>

        {/* Center/Right: Match Info Card */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="glass-card flex items-center gap-4 rounded-xl px-4 py-2 border-stadium-border">
            {/* Match details */}
            <div className="flex items-center gap-3">
              {/* Flag-like icons or country shortnames */}
              <div className="flex items-center gap-1.5 font-outfit text-sm font-bold text-white">
                <span className="flex h-5 w-7 items-center justify-center rounded bg-blue-600 text-[10px] tracking-wide" title="Brazil">BRA</span>
                <span>2</span>
                <span className="text-gray-500 font-normal">:</span>
                <span>2</span>
                <span className="flex h-5 w-7 items-center justify-center rounded bg-red-600 text-[10px] tracking-wide" title="Spain">ESP</span>
              </div>
              <div className="h-4 w-px bg-stadium-border/60" />
              <div className="text-left">
                <p className="font-outfit text-xs font-semibold text-gray-300">
                  Brazil vs Spain
                </p>
                <p className="font-inter text-[10px] text-gray-400">
                  MetLife Stadium, NJ
                </p>
              </div>
            </div>
            
            <div className="h-6 w-px bg-stadium-border/60" />

            {/* Match status */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
              <span className="font-outfit text-xs font-bold uppercase tracking-wider text-red-400">
                Full Time
              </span>
            </div>
          </div>

          {/* Simulation mode indicator */}
          <div className="flex items-center gap-1.5 rounded-xl border border-stadium-gold/30 bg-stadium-gold/10 px-3 py-2 font-inter text-[11px] font-semibold text-stadium-gold">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Simulation Active</span>
          </div>
        </div>

      </div>
    </header>
  );
};
