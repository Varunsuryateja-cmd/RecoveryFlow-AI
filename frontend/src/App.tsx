import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { LiveStatus } from './components/LiveStatus';
import { ExitPlanner } from './components/ExitPlanner';
import { RecommendationDisplay } from './components/RecommendationDisplay';
import { AlternativePlans } from './components/AlternativePlans';
import { EmergencyAlertBanner } from './components/EmergencyAlert';
import { StadiumMap } from './components/StadiumMap';
import {
  fetchScenarios,
  fetchStadiumSnapshot,
  setActiveScenario,
  generateRecommendation,
  fetchEmergencyAlert,
} from './api';
import type {
  ScenarioId,
  Scenario,
  Destination,
  Priority,
  ExitRecommendation,
  OperationsSnapshot,
  EmergencyAlert,
} from './types';
import { Compass, Info, WifiOff } from 'lucide-react';

// ── Default snapshot shown while loading ──────────────────────────────────
const EMPTY_SNAPSHOT: OperationsSnapshot = {
  overallCrowd: 0,
  overallStatus: 'Low',
  gates: [
    { id: 'gateA', name: 'Gate A (South)', crowdLevel: 'Low', waitTime: 0, statusText: 'Loading...' },
    { id: 'gateB', name: 'Gate B (East)',  crowdLevel: 'Low', waitTime: 0, statusText: 'Loading...' },
    { id: 'gateC', name: 'Gate C (West)',  crowdLevel: 'Low', waitTime: 0, statusText: 'Loading...' },
  ],
  metroQueue: { id: 'metro', name: 'Metro Station Loop', crowdLevel: 'Low', waitTime: 0, length: '—' },
  taxiQueue:  { id: 'taxi',  name: 'Taxi Stand Queue',   crowdLevel: 'Low', waitTime: 0, length: '—' },
};

function App() {
  // ── User preferences ──────────────────────────────────────────────────────
  const [currentScenario, setCurrentScenario] = useState<ScenarioId>('scenario1');
  const [destination, setDestination]         = useState<Destination>('metro');
  const [priority, setPriority]               = useState<Priority>('fastest');
  const [accessibility, setAccessibility]     = useState<boolean>(false);

  // ── Server state ──────────────────────────────────────────────────────────
  const [scenarios, setScenarios]           = useState<Scenario[]>([]);
  const [opsSnapshot, setOpsSnapshot]       = useState<OperationsSnapshot>(EMPTY_SNAPSHOT);
  const [snapshotLoading, setSnapshotLoading] = useState<boolean>(true);
  const [recommendation, setRecommendation] = useState<ExitRecommendation | null>(null);
  const [isGenerating, setIsGenerating]     = useState<boolean>(false);
  const [alert, setAlert]                   = useState<EmergencyAlert | null>(null);
  const [apiError, setApiError]             = useState<string | null>(null);

  // ── Emergency rerouting state ─────────────────────────────────────────────
  // When a danger alert is active we override priority to 'least-crowded'.
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(false);
  // Ref tracks the previous alert active state so we can react on transitions.
  const prevAlertActive = useRef<boolean>(false);

  // ── Refresh stadium snapshot ───────────────────────────────────────────────
  const refreshSnapshot = useCallback(async () => {
    try {
      const snap = await fetchStadiumSnapshot();
      setOpsSnapshot(snap);
      setApiError(null);
    } catch (err) {
      console.error('Failed to load stadium snapshot:', err);
      setApiError('Unable to reach the RecoveryFlow AI backend. Ensure the server is running on port 8000.');
    } finally {
      setSnapshotLoading(false);
    }
  }, []);

  // ── Refresh emergency alert ────────────────────────────────────────────────
  const refreshAlert = useCallback(async () => {
    try {
      const a = await fetchEmergencyAlert();
      setAlert(a.active ? a : null);
    } catch {
      // non-critical — ignore
    }
  }, []);

  // ── Core recommendation generator ─────────────────────────────────────────
  // Accepts an optional priorityOverride for emergency rerouting.
  const handleGenerate = useCallback(async (priorityOverride?: Priority) => {
    setIsGenerating(true);
    const effectivePriority = priorityOverride ?? priority;
    try {
      const rec = await generateRecommendation({
        destination,
        priority: effectivePriority,
        accessibility,
      });
      setRecommendation(rec);
      setApiError(null);
    } catch (err) {
      console.error('Recommendation failed:', err);
      setApiError('Failed to generate recommendation. Check the backend server.');
    } finally {
      setIsGenerating(false);
    }
  }, [destination, priority, accessibility]);

  // ── Scenario switch ────────────────────────────────────────────────────────
  const handleScenarioChange = useCallback(async (id: ScenarioId) => {
    setCurrentScenario(id);
    setSnapshotLoading(true);
    setRecommendation(null);
    try {
      await setActiveScenario(id);
      await refreshSnapshot();
    } catch (err) {
      console.error('Failed to switch scenario:', err);
      setApiError('Failed to update scenario on the server.');
      setSnapshotLoading(false);
    }
  }, [refreshSnapshot]);

  // ── On mount: load scenarios, snapshot, alerts ────────────────────────────
  useEffect(() => {
    fetchScenarios()
      .then(setScenarios)
      .catch((err) => console.error('Failed to load scenarios:', err));

    refreshSnapshot();
    refreshAlert();

    // Poll for emergency alerts every 15 seconds
    const alertInterval = setInterval(refreshAlert, 15_000);
    return () => clearInterval(alertInterval);
  }, [refreshSnapshot, refreshAlert]);

  // Auto-generate initial recommendation when snapshot first loads
  useEffect(() => {
    if (!snapshotLoading && !recommendation) {
      handleGenerate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshotLoading]);

  // ── Feature 3: Automatic Emergency Rerouting ───────────────────────────────
  // When a danger alert activates → override priority to 'least-crowded'.
  // When alert is dismissed     → restore user's chosen priority.
  useEffect(() => {
    const alertIsActiveDanger = alert?.active === true && alert.type === 'danger';
    const wasActive = prevAlertActive.current;

    if (alertIsActiveDanger && !wasActive) {
      // Alert just activated — engage emergency mode and regenerate
      setIsEmergencyMode(true);
      handleGenerate('least-crowded');
    } else if (!alertIsActiveDanger && wasActive) {
      // Alert just cleared — restore normal mode and regenerate with user priority
      setIsEmergencyMode(false);
      handleGenerate();
    }

    prevAlertActive.current = !!alertIsActiveDanger;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert]);

  // ── Alert dismiss handler ─────────────────────────────────────────────────
  const handleDismissAlert = useCallback(() => {
    setAlert(null);
    // Transition from emergency mode back to normal
    if (isEmergencyMode) {
      setIsEmergencyMode(false);
      handleGenerate();
    }
  }, [isEmergencyMode, handleGenerate]);

  return (
    <div className="flex min-h-screen flex-col bg-stadium-dark font-sans selection:bg-stadium-green/30 selection:text-stadium-green">

      {/* 1. Header */}
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">

        {/* API error banner */}
        {apiError && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-left">
            <WifiOff className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-300 leading-relaxed">
              <span className="font-bold text-rose-200 uppercase tracking-wider text-[10px] mr-1.5 rounded bg-rose-500/20 px-1.5 py-0.5 border border-rose-500/30">
                Backend Offline
              </span>
              {apiError}
            </div>
          </div>
        )}

        {/* Emergency Alert Banner */}
        {alert && (
          <EmergencyAlertBanner
            alert={alert}
            onDismiss={handleDismissAlert}
          />
        )}

        {/* Context Banner */}
        <div className="flex items-start gap-3 rounded-xl border border-stadium-border bg-stadium-panel/50 p-4 text-left">
          <Info className="h-5 w-5 text-stadium-mint shrink-0 mt-0.5" />
          <div className="text-xs text-gray-400 leading-relaxed">
            <span className="font-bold text-white uppercase tracking-wider text-[10px] mr-1.5 rounded bg-stadium-border px-1.5 py-0.5">Context</span>
            Welcome to the post-match exit portal. Fans leaving MetLife Stadium are currently experiencing high-volume exits.
            Recommendations are powered by the RecoveryFlow AI backend — switch scenarios to see real-time adjustments.
          </div>
        </div>

        {/* 2. Scenario Selector */}
        <ScenarioSelector
          currentScenario={currentScenario}
          onScenarioChange={handleScenarioChange}
          scenarios={scenarios}
        />

        {/* 3. Live Stadium Status */}
        <LiveStatus snapshot={opsSnapshot} />

        {/* 4. Stadium Map — uses existing opsSnapshot + recommendation data */}
        <StadiumMap
          snapshot={opsSnapshot}
          recommendedGate={recommendation?.primary.gateName ?? null}
          isEmergencyMode={isEmergencyMode}
        />

        {/* 5 & 6. Exit Planner + AI Recommendation */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ExitPlanner
              destination={destination}
              setDestination={setDestination}
              priority={priority}
              setPriority={setPriority}
              accessibility={accessibility}
              setAccessibility={setAccessibility}
              onGenerate={() => handleGenerate()}
              isGenerating={isGenerating}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <RecommendationDisplay
              plan={recommendation ? recommendation.primary : null}
              isGenerating={isGenerating}
              isEmergencyMode={isEmergencyMode}
              geminiEnriched={recommendation?.geminiEnriched ?? false}
            />
            <AlternativePlans
              plans={recommendation ? recommendation.alternatives : []}
              isGenerating={isGenerating}
            />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-stadium-border/40 bg-stadium-dark/80 py-5 text-center text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-stadium-green" />
            <span className="font-outfit font-bold text-gray-400">RecoveryFlow AI</span>
            <span className="text-gray-600">|</span>
            <span>FIFA World Cup 2026 Smart City Initiative</span>
          </div>
          <div className="font-inter text-[11px]">
            Designed for MetLife Stadium, New Jersey / New York
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
