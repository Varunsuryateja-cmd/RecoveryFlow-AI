import type React from 'react';
import type { OperationsSnapshot, CongestionLevel } from '../types';
import { Users, DoorOpen, Train, Car, Activity, Clock } from 'lucide-react';

interface LiveStatusProps {
  snapshot: OperationsSnapshot;
}

export const LiveStatus: React.FC<LiveStatusProps> = ({ snapshot }) => {
  
  const getCongestionStyles = (level: CongestionLevel) => {
    switch (level) {
      case 'High':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          glow: 'shadow-[0_0_15px_rgba(244,63,94,0.1)]'
        };
      case 'Medium':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]'
        };
      case 'Low':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]'
        };
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-stadium-green" />
        <h2 className="font-outfit text-base font-bold text-white m-0">
          Live Stadium Status
        </h2>
        <span className="h-1.5 w-1.5 rounded-full bg-stadium-green animate-ping" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        
        {/* Card 1: Overall Crowd Level */}
        <div className="glass-card lg:col-span-2 flex flex-col justify-between rounded-2xl p-4 border-stadium-border/60">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs font-semibold text-gray-400">
              Overall Crowd Level
            </span>
            <Users className="h-4 w-4 text-gray-500" />
          </div>
          
          <div className="my-3 flex items-baseline gap-2">
            <span className="font-outfit text-3xl font-extrabold text-white">
              {snapshot.overallCrowd}%
            </span>
            <span className={`rounded border px-1.5 py-0.5 font-outfit text-[10px] font-bold uppercase tracking-wider ${getCongestionStyles(snapshot.overallStatus).badge}`}>
              {snapshot.overallStatus} Congestion
            </span>
          </div>

          {/* Graphical Progress Bar */}
          <div className="w-full space-y-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-stadium-border/50">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  snapshot.overallCrowd > 80 
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                    : snapshot.overallCrowd > 50 
                      ? 'bg-gradient-to-r from-emerald-500 to-amber-500' 
                      : 'bg-emerald-500'
                }`}
                style={{ width: `${snapshot.overallCrowd}%` }}
              />
            </div>
            <div className="flex justify-between font-inter text-[9px] text-gray-500">
              <span>Optimized</span>
              <span>Capacity</span>
            </div>
          </div>
        </div>

        {/* Cards 2, 3, 4: Gates A, B, C */}
        {snapshot.gates.map((gate) => {
          const styles = getCongestionStyles(gate.crowdLevel);
          return (
            <div 
              key={gate.id} 
              className={`glass-card flex flex-col justify-between rounded-2xl p-4 border-stadium-border/60 transition-all duration-300 hover:border-stadium-border ${styles.glow}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-inter text-xs font-semibold text-gray-300">
                  {gate.name.split(' ')[0]} {gate.name.split(' ')[1] || ''}
                </span>
                <DoorOpen className="h-4 w-4 text-gray-500" />
              </div>
              
              <div className="mt-2 text-left">
                <p className="font-inter text-[10px] text-gray-400 uppercase tracking-wider">
                  Checkpoint Wait
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-outfit text-xl font-bold text-white">
                    {gate.waitTime}m
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-inter text-[10px] text-gray-400">
                  {gate.statusText}
                </span>
                <span className={`rounded-full border px-2 py-0.5 font-outfit text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}>
                  {gate.crowdLevel}
                </span>
              </div>
            </div>
          );
        })}

        {/* Card 5: Metro Queue */}
        {(() => {
          const metro = snapshot.metroQueue;
          const styles = getCongestionStyles(metro.crowdLevel);
          return (
            <div className={`glass-card flex flex-col justify-between rounded-2xl p-4 border-stadium-border/60 transition-all duration-300 hover:border-stadium-border ${styles.glow}`}>
              <div className="flex items-center justify-between">
                <span className="font-inter text-xs font-semibold text-gray-300">
                  Metro Station
                </span>
                <Train className="h-4 w-4 text-gray-500" />
              </div>

              <div className="mt-2 text-left">
                <p className="font-inter text-[10px] text-gray-400 uppercase tracking-wider">
                  Platform Wait
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-outfit text-xl font-bold text-white">
                    {metro.waitTime}m
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-inter text-[10px] text-gray-400">
                  Queue: {metro.length}
                </span>
                <span className={`rounded-full border px-2 py-0.5 font-outfit text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}>
                  {metro.crowdLevel}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Card 6: Taxi Queue */}
        {(() => {
          const taxi = snapshot.taxiQueue;
          const styles = getCongestionStyles(taxi.crowdLevel);
          return (
            <div className={`glass-card flex flex-col justify-between rounded-2xl p-4 border-stadium-border/60 transition-all duration-300 hover:border-stadium-border ${styles.glow}`}>
              <div className="flex items-center justify-between">
                <span className="font-inter text-xs font-semibold text-gray-300">
                  Taxi Stand
                </span>
                <Car className="h-4 w-4 text-gray-500" />
              </div>

              <div className="mt-2 text-left">
                <p className="font-inter text-[10px] text-gray-400 uppercase tracking-wider">
                  Queue Boarding
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-outfit text-xl font-bold text-white">
                    {taxi.waitTime}m
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-inter text-[10px] text-gray-400">
                  Queue: {taxi.length}
                </span>
                <span className={`rounded-full border px-2 py-0.5 font-outfit text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}>
                  {taxi.crowdLevel}
                </span>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
