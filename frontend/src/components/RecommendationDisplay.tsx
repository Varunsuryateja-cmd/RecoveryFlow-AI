import type React from 'react';
import type { ExitPlan } from '../types';
import { Sparkles, Shield, Compass, Navigation, Clock } from 'lucide-react';

interface RecommendationDisplayProps {
  plan: ExitPlan | null;
  isGenerating: boolean;
  isEmergencyMode?: boolean;
  geminiEnriched?: boolean;
}

export const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({
  plan,
  isGenerating,
  isEmergencyMode = false,
  geminiEnriched = false,
}) => {
  if (isGenerating) {
    return (
      <div className="glass-card flex h-[350px] w-full flex-col items-center justify-center rounded-2xl border-stadium-border/60 p-6 text-center">
        {/* Animated Scanning Logo */}
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-stadium-green/10 text-stadium-green">
          <Compass className="h-10 w-10 animate-spin-slow" />
          {/* Laser scanning line */}
          <div className="absolute left-0 w-full h-0.5 bg-stadium-green animate-scan shadow-lg shadow-stadium-green" />
        </div>
        <h3 className="font-outfit text-lg font-bold text-white">
          Computing Optimal Routing...
        </h3>
        <p className="font-inter text-xs text-gray-400 max-w-sm mt-1.5 leading-relaxed">
          Retrieving real-time crowd densities, pedestrian checkpoint speeds, and scheduled shuttle loop positions.
        </p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="glass-card flex h-[350px] w-full flex-col items-center justify-center rounded-2xl border-stadium-border/60 p-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stadium-border/40 text-gray-400">
          <Navigation className="h-6 w-6" />
        </div>
        <h3 className="font-outfit text-base font-bold text-gray-200">
          No Route Generated Yet
        </h3>
        <p className="font-inter text-xs text-gray-400 max-w-xs mt-1">
          Select your destination and priority on the left, then click "Generate Exit Plan" to calculate routes.
        </p>
      </div>
    );
  }

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'Leave Now':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Wait 10 Mins':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
  };

  const getCrowdBadgeColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      default:
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stadium-green/30 bg-gradient-to-b from-[#0f1d24]/85 to-stadium-panel p-6 shadow-xl shadow-stadium-green/5 glow-pulse-green">
      
      {/* Background glow highlights */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-stadium-green/5 blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stadium-border/50 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stadium-green/20 text-stadium-green">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-outfit text-xs font-bold uppercase tracking-wider text-stadium-green">
            AI Recommended Route
          </span>
          {/* Emergency mode badge */}
          {isEmergencyMode && (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 font-outfit text-[10px] font-bold uppercase tracking-wide text-amber-300">
              🚨 Emergency Reroute
            </span>
          )}
          {/* Gemini enrichment badge */}
          {geminiEnriched && !isEmergencyMode && (
            <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 font-outfit text-[10px] font-bold tracking-wide text-purple-300">
              ✦ Gemini Enhanced
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 font-outfit text-[10px] font-extrabold uppercase tracking-wide ${getLeaveStatusColor(plan.leaveStatus)}`}>
            {plan.leaveStatus}
          </span>
        </div>
      </div>

      {/* Core recommendation metrics */}
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
        {/* Recommended gate */}
        <div className="rounded-xl bg-stadium-dark/40 border border-stadium-border/40 p-4 text-left">
          <p className="font-inter text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Recommended Exit
          </p>
          <p className="font-outfit text-lg font-bold text-white mt-1">
            {plan.gateName}
          </p>
        </div>

        {/* Est Travel Time */}
        <div className="rounded-xl bg-stadium-dark/40 border border-stadium-border/40 p-4 text-left">
          <p className="font-inter text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Est. Transit Duration
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="h-4.5 w-4.5 text-stadium-green" />
            <span className="font-outfit text-lg font-bold text-white">
              {plan.travelTime} Mins
            </span>
          </div>
        </div>

        {/* Path congestion */}
        <div className="col-span-2 rounded-xl bg-stadium-dark/40 border border-stadium-border/40 p-4 text-left md:col-span-1">
          <p className="font-inter text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Path Congestion
          </p>
          <div className="mt-1.5 flex">
            <span className={`rounded-md px-2 py-0.5 font-outfit text-xs font-bold ${getCrowdBadgeColor(plan.crowdLevel)}`}>
              {plan.crowdLevel} Crowd Density
            </span>
          </div>
        </div>
      </div>

      {/* AI reasoning text */}
      <div className="mt-5 rounded-xl border border-stadium-border/50 bg-stadium-dark/60 p-4 text-left">
        <div className="flex items-start gap-2.5">
          <Shield className="h-4.5 w-4.5 text-stadium-green shrink-0 mt-0.5" />
          <div>
            <p className="font-outfit text-xs font-bold text-gray-200">
              AI Routing Analysis
            </p>
            <p className="font-inter text-xs leading-relaxed text-gray-300 mt-1">
              {plan.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-5 text-left">
        <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Step-by-step route directions
        </h4>
        <div className="relative border-l border-stadium-border/60 pl-4 ml-1.5 space-y-4">
          {plan.routeSteps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Dot indicator */}
              <div className="absolute -left-[21px] top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-stadium-green ring-4 ring-stadium-dark" />
              <p className="font-inter text-xs text-gray-300 font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
