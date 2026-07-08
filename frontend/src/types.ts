export type Destination = 'metro' | 'taxi' | 'parking' | 'bus';

export type Priority = 'fastest' | 'least-crowded' | 'least-walking';

export type ScenarioId = 'scenario1' | 'scenario2' | 'scenario3';

export interface Scenario {
  id: ScenarioId;
  name: string;
  description: string;
  icon: string;
}

export type CongestionLevel = 'Low' | 'Medium' | 'High';

export interface GateStatus {
  id: string;
  name: string;
  crowdLevel: CongestionLevel;
  waitTime: number; // in minutes
  statusText: string;
}

export interface QueueStatus {
  id: string;
  name: string;
  crowdLevel: CongestionLevel;
  waitTime: number; // in minutes
  length: string; // e.g. "120m"
}

export interface OperationsSnapshot {
  overallCrowd: number; // percentage, e.g., 78
  overallStatus: CongestionLevel;
  gates: GateStatus[];
  metroQueue: QueueStatus;
  taxiQueue: QueueStatus;
}

export interface ExitPlan {
  gateName: string;
  leaveStatus: 'Leave Now' | 'Wait 10 Mins' | 'Wait 15 Mins' | 'Wait 20 Mins';
  travelTime: number; // in minutes
  explanation: string;
  routeSteps: string[];
  crowdLevel: CongestionLevel;
}

export interface ExitRecommendation {
  primary: ExitPlan;
  alternatives: ExitPlan[];
  geminiEnriched?: boolean;
}

export interface EmergencyAlert {
  active: boolean;
  message: string;
  type: 'warning' | 'danger' | 'info';
  timestamp: string;
}
