import type React from 'react';
import type { Scenario, ScenarioId } from '../types';
import { HelpCircle, CloudRain, Car, Zap } from 'lucide-react';

interface ScenarioSelectorProps {
  currentScenario: ScenarioId;
  onScenarioChange: (id: ScenarioId) => void;
  /** Scenarios fetched from the backend. Falls back to empty list while loading. */
  scenarios: Scenario[];
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenario,
  onScenarioChange,
  scenarios,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="h-4 w-4" />;
      case 'Car':
        return <Car className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="glass-card w-full rounded-2xl p-5 border-stadium-border/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-stadium-gold" />
          <h2 className="font-outfit text-base font-bold text-white m-0">
            Simulation Controller
          </h2>
        </div>
        <div className="group relative flex cursor-help items-center gap-1 text-[11px] text-gray-400">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>How scenarios affect flows</span>
          <div className="absolute right-0 top-6 z-10 hidden w-64 rounded-lg border border-stadium-border bg-stadium-panel p-3 text-[11px] leading-relaxed text-gray-300 shadow-xl group-hover:block">
            Switching scenarios modifies the stadium exit gates and public transport queues to simulate various real-world matches. AI routing adjusts instantly.
          </div>
        </div>
      </div>

      {scenarios.length === 0 ? (
        /* Loading skeleton */
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-stadium-border/30 bg-stadium-dark/40"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {scenarios.map((scenario) => {
            const isActive = currentScenario === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => onScenarioChange(scenario.id as ScenarioId)}
                className={`flex items-start gap-3 rounded-xl p-3 text-left transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'border-stadium-green bg-gradient-to-br from-stadium-green/10 to-stadium-mint/10 text-white glow-pulse-green'
                    : 'border-stadium-border/50 bg-stadium-dark/40 text-gray-400 hover:border-gray-700 hover:bg-stadium-dark/65'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isActive
                      ? 'bg-stadium-green text-stadium-dark'
                      : 'bg-stadium-border text-gray-400'
                  }`}
                >
                  {getIcon(scenario.icon)}
                </div>
                <div>
                  <p className={`font-outfit text-xs font-bold ${isActive ? 'text-stadium-green' : 'text-gray-200'}`}>
                    {scenario.name}
                  </p>
                  <p className="font-inter text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-normal">
                    {scenario.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
