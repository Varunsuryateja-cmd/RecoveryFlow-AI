import type React from 'react';
import { useState } from 'react';
import type { Destination, Priority } from '../types';
import { MapPin, Zap, Accessibility, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface ExitPlannerProps {
  destination: Destination;
  setDestination: (dest: Destination) => void;
  priority: Priority;
  setPriority: (priority: Priority) => void;
  accessibility: boolean;
  setAccessibility: (accessible: boolean) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ExitPlanner: React.FC<ExitPlannerProps> = ({
  destination,
  setDestination,
  priority,
  setPriority,
  accessibility,
  setAccessibility,
  onGenerate,
  isGenerating
}) => {
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasGeneratedOnce(true);
    onGenerate();
  };

  return (
    <div className="glass-card flex h-full flex-col justify-between rounded-2xl p-6 border-stadium-border/60">
      <div>
        {/* Title */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stadium-green/10 text-stadium-green border border-stadium-green/20">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <h2 className="font-outfit text-lg font-bold text-white m-0">
            Plan My Exit
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Destination */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="destination" className="flex items-center gap-1.5 font-inter text-xs font-semibold text-gray-400">
              <MapPin className="h-3.5 w-3.5" />
              <span>Select Destination</span>
            </label>
            <div className="relative">
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value as Destination)}
                className="w-full appearance-none rounded-xl border border-stadium-border/65 bg-stadium-dark/80 px-4 py-3 font-outfit text-sm font-medium text-white focus:border-stadium-green focus:outline-none focus:ring-1 focus:ring-stadium-green"
              >
                <option value="metro">Metro Station Loop</option>
                <option value="taxi">Taxi Stand Terminal</option>
                <option value="bus">West Bus Terminal</option>
                <option value="parking">North Parking Lots</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="priority" className="flex items-center gap-1.5 font-inter text-xs font-semibold text-gray-400">
              <Zap className="h-3.5 w-3.5" />
              <span>Routing Priority</span>
            </label>
            <div className="relative">
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full appearance-none rounded-xl border border-stadium-border/65 bg-stadium-dark/80 px-4 py-3 font-outfit text-sm font-medium text-white focus:border-stadium-green focus:outline-none focus:ring-1 focus:ring-stadium-green"
              >
                <option value="fastest">Fastest (Min Time)</option>
                <option value="least-crowded">Least Crowded (Low Stress)</option>
                <option value="least-walking">Least Walking (Shortest Path)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </div>
            </div>
          </div>

          {/* Accessibility Toggle */}
          <div className="rounded-xl border border-stadium-border/45 bg-stadium-dark/30 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2.5 text-left">
                <Accessibility className="h-5 w-5 text-stadium-mint mt-0.5" />
                <div>
                  <label htmlFor="accessibility" className="font-outfit text-xs font-bold text-white cursor-pointer select-none">
                    Step-Free Access
                  </label>
                  <p className="font-inter text-[10px] text-gray-400 mt-0.5 leading-normal">
                    Requires wheelchair-accessible ramps, elevators, and wide gates.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  id="accessibility"
                  type="checkbox"
                  checked={accessibility}
                  onChange={(e) => setAccessibility(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-5 w-9 rounded-full bg-stadium-border/60 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-stadium-mint peer-checked:after:translate-x-full peer-focus:outline-none" />
              </label>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className={`relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-stadium-green to-stadium-mint px-5 py-3.5 font-outfit text-sm font-bold text-stadium-dark shadow-lg shadow-stadium-green/20 hover:shadow-stadium-green/35 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              isGenerating ? 'opacity-85 pointer-events-none' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI Analyzing Options...</span>
              </>
            ) : (
              <>
                <span>{hasGeneratedOnce ? 'Update Recommendations' : 'Generate Exit Plan'}</span>
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Safety notice in football theme */}
      <div className="mt-6 border-t border-stadium-border/40 pt-4 text-left">
        <p className="font-inter text-[10px] leading-relaxed text-gray-400">
          * Dynamic routing is powered by simulated stadium CCTV flow monitors and transit coordinators. Follow local steward directions in emergencies.
        </p>
      </div>
    </div>
  );
};
