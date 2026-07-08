import type React from 'react';
import type { ExitPlan } from '../types';
import { RefreshCw, Clock, ShieldCheck } from 'lucide-react';

interface AlternativePlansProps {
  plans: ExitPlan[];
  isGenerating: boolean;
}

export const AlternativePlans: React.FC<AlternativePlansProps> = ({
  plans,
  isGenerating
}) => {
  if (isGenerating || plans.length === 0) {
    return null;
  }

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-emerald-400';
      case 'Medium':
        return 'text-amber-400';
      default:
        return 'text-rose-400';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <RefreshCw className="h-5 w-5 text-stadium-mint" />
        <h2 className="font-outfit text-base font-bold text-white m-0">
          Alternative Exit Plans
        </h2>
      </div>

      {/* Alternatives Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="glass-card flex flex-col justify-between rounded-2xl p-5 border-stadium-border/60 hover:border-stadium-mint/35 transition-all duration-300"
          >
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between border-b border-stadium-border/40 pb-2.5">
                <span className="font-outfit text-sm font-bold text-white">
                  Option {idx + 1}: Via {plan.gateName.split(' ')[0]} {plan.gateName.split(' ')[1] || ''}
                </span>
                <span className="rounded bg-stadium-border/65 px-2 py-0.5 font-outfit text-[10px] font-bold text-gray-300 border border-stadium-border">
                  {plan.leaveStatus}
                </span>
              </div>

              {/* Main metrics */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-inter text-xs text-gray-400">Duration:</span>
                  <span className="font-outfit text-sm font-extrabold text-white">
                    {plan.travelTime} Mins
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-inter text-[10px] text-gray-400">Density:</span>
                  <span className={`font-outfit text-xs font-bold ${getCrowdColor(plan.crowdLevel)}`}>
                    {plan.crowdLevel}
                  </span>
                </div>
              </div>

              {/* Rationale explanation */}
              <p className="font-inter text-xs leading-relaxed text-gray-400 text-left mt-3.5 bg-stadium-dark/30 p-2.5 rounded-lg border border-stadium-border/30">
                {plan.explanation}
              </p>
            </div>

            {/* Quick route steps preview */}
            <div className="mt-4 border-t border-stadium-border/40 pt-3">
              <div className="flex items-center gap-1 text-left">
                <ShieldCheck className="h-3.5 w-3.5 text-stadium-mint shrink-0" />
                <span className="font-inter text-[10px] font-semibold text-gray-300">
                  Key Steps:
                </span>
                <span className="font-inter text-[10px] text-gray-400 truncate ml-1">
                  {plan.routeSteps.join(' → ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
