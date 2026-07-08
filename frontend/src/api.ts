/**
 * RecoveryFlow AI — Backend API client
 * All communication with FastAPI goes through this module.
 * Base URL is configured via VITE_API_URL env var (defaults to localhost:8000).
 */

import type {
  Destination,
  Priority,
  ScenarioId,
  OperationsSnapshot,
  ExitRecommendation,
  EmergencyAlert,
  Scenario,
} from './types';

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://127.0.0.1:8000';
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${path} failed [${res.status}]: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ── Scenarios ──────────────────────────────────────────────────────────────

export const fetchScenarios = (): Promise<Scenario[]> =>
  apiFetch<Scenario[]>('/api/scenarios');

export const fetchActiveScenario = (): Promise<{ scenario_id: ScenarioId }> =>
  apiFetch<{ scenario_id: ScenarioId }>('/api/scenarios/active');

export const setActiveScenario = (scenarioId: ScenarioId): Promise<{ scenario_id: ScenarioId }> =>
  apiFetch<{ scenario_id: ScenarioId }>('/api/scenarios/active', {
    method: 'POST',
    body: JSON.stringify({ scenario_id: scenarioId }),
  });

// ── Stadium ────────────────────────────────────────────────────────────────

export const fetchStadiumSnapshot = (): Promise<OperationsSnapshot> =>
  apiFetch<OperationsSnapshot>('/api/stadium/snapshot');

// ── Recommendations ────────────────────────────────────────────────────────

export interface RecommendationRequest {
  destination: Destination;
  priority: Priority;
  accessibility: boolean;
}

export const generateRecommendation = (req: RecommendationRequest): Promise<ExitRecommendation> =>
  apiFetch<ExitRecommendation>('/api/recommendations/generate', {
    method: 'POST',
    body: JSON.stringify(req),
  });

// ── Alerts ─────────────────────────────────────────────────────────────────

export const fetchEmergencyAlert = (): Promise<EmergencyAlert> =>
  apiFetch<EmergencyAlert>('/api/alerts/emergency');
