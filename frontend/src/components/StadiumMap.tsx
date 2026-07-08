/**
 * StadiumMap — Lightweight SVG schematic of MetLife Stadium.
 *
 * Shows Gate A (South), B (East), C (West) coloured by live crowd level.
 * The recommended exit gate pulses green. Metro and Taxi icons are positioned
 * near their real locations relative to the stadium.
 *
 * Props:
 *   snapshot   — live OperationsSnapshot (gate crowd levels)
 *   recommendedGate — gateName string from primary recommendation (e.g. "Gate C (West)")
 *   isEmergencyMode — when true the recommended gate pulses red/amber
 */
import type React from 'react';
import type { OperationsSnapshot, CongestionLevel } from '../types';
import { Map } from 'lucide-react';

interface StadiumMapProps {
  snapshot: OperationsSnapshot;
  recommendedGate: string | null;
  isEmergencyMode?: boolean;
}

const CROWD_FILL: Record<CongestionLevel, string> = {
  Low:    '#10b981', // emerald
  Medium: '#f59e0b', // amber
  High:   '#f43f5e', // rose
};

const CROWD_GLOW: Record<CongestionLevel, string> = {
  Low:    'drop-shadow(0 0 6px #10b98180)',
  Medium: 'drop-shadow(0 0 6px #f59e0b80)',
  High:   'drop-shadow(0 0 8px #f43f5e99)',
};

/** Return true if the gate name string contains the given letter */
const matchesGate = (recommended: string | null, letter: string) =>
  recommended?.toUpperCase().includes(`GATE ${letter}`) ?? false;

export const StadiumMap: React.FC<StadiumMapProps> = ({
  snapshot,
  recommendedGate,
  isEmergencyMode = false,
}) => {
  const gateA = snapshot.gates.find((g) => g.id === 'gateA');
  const gateB = snapshot.gates.find((g) => g.id === 'gateB');
  const gateC = snapshot.gates.find((g) => g.id === 'gateC');

  const aLevel: CongestionLevel = gateA?.crowdLevel ?? 'Low';
  const bLevel: CongestionLevel = gateB?.crowdLevel ?? 'Low';
  const cLevel: CongestionLevel = gateC?.crowdLevel ?? 'Low';

  const isA = matchesGate(recommendedGate, 'A');
  const isB = matchesGate(recommendedGate, 'B');
  const isC = matchesGate(recommendedGate, 'C');

  const recommendedGlow = isEmergencyMode
    ? 'drop-shadow(0 0 10px #f59e0bcc)'
    : 'drop-shadow(0 0 10px #22c55ecc)';
  const recommendedStroke = isEmergencyMode ? '#f59e0b' : '#22c55e';

  return (
    <div className="glass-card w-full rounded-2xl border-stadium-border/60 p-5">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <Map className="h-5 w-5 text-stadium-green" />
        <h2 className="font-outfit text-base font-bold text-white m-0">Stadium Exit Map</h2>
        {recommendedGate && (
          <span className={`ml-auto rounded-full border px-2.5 py-0.5 font-outfit text-[10px] font-bold uppercase tracking-wide ${
            isEmergencyMode
              ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
              : 'border-stadium-green/40 bg-stadium-green/15 text-stadium-green'
          }`}>
            {isEmergencyMode ? '🚨 Emergency Route' : '✦ Recommended: ' + recommendedGate.split(' ').slice(0, 2).join(' ')}
          </span>
        )}
      </div>

      {/* SVG Map */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#0a1520] border border-stadium-border/40">
        <svg
          viewBox="0 0 500 320"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          aria-label="MetLife Stadium exit map"
        >
          {/* ── Grid lines (pitch markings feel) ─────────────────────── */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff08" strokeWidth="0.5"/>
            </pattern>
            {/* Pulsing animation for recommended gate */}
            <style>{`
              @keyframes gate-pulse {
                0%, 100% { opacity: 1; r: 10; }
                50%       { opacity: 0.6; r: 13; }
              }
              .gate-pulse { animation: gate-pulse 1.6s ease-in-out infinite; }
              @keyframes route-dash {
                to { stroke-dashoffset: -20; }
              }
              .route-line { animation: route-dash 0.8s linear infinite; }
            `}</style>
          </defs>
          <rect width="500" height="320" fill="url(#grid)" />

          {/* ── Stadium outer shell ───────────────────────────────────── */}
          <ellipse cx="250" cy="158" rx="145" ry="110" fill="#0d1f2d" stroke="#1e3a4a" strokeWidth="2.5" />

          {/* ── Playing field ─────────────────────────────────────────── */}
          <ellipse cx="250" cy="158" rx="105" ry="75" fill="#0e3d1e" stroke="#1a5c2a" strokeWidth="1.5" />
          {/* Centre circle */}
          <circle cx="250" cy="158" r="22" fill="none" stroke="#1a5c2a" strokeWidth="1" />
          {/* Centre spot */}
          <circle cx="250" cy="158" r="2" fill="#1a5c2a" />
          {/* Halfway line */}
          <line x1="250" y1="85" x2="250" y2="231" stroke="#1a5c2a" strokeWidth="1" />
          {/* Pitch label */}
          <text x="250" y="162" textAnchor="middle" fill="#1a5c2a" fontSize="9" fontFamily="sans-serif" letterSpacing="2">METLIFE</text>

          {/* ── Seating tiers ─────────────────────────────────────────── */}
          <ellipse cx="250" cy="158" rx="125" ry="93" fill="none" stroke="#162b3a" strokeWidth="8" strokeDasharray="4 2" />

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* GATE A — SOUTH (bottom)                                     */}
          {/* ═══════════════════════════════════════════════════════════ */}

          {/* Route line to Gate A (dashed, animated when recommended) */}
          {isA && (
            <line
              x1="250" y1="268" x2="250" y2="310"
              stroke={recommendedStroke} strokeWidth="2.5"
              strokeDasharray="6 4"
              className="route-line"
              opacity="0.8"
            />
          )}

          {/* Gate A marker */}
          <g transform="translate(250,275)">
            <circle
              r={isA ? 12 : 10}
              fill={isA ? recommendedStroke : CROWD_FILL[aLevel]}
              opacity={isA ? 1 : 0.85}
              style={{ filter: isA ? recommendedGlow : CROWD_GLOW[aLevel] }}
              className={isA ? 'gate-pulse' : ''}
            />
            <text y="1" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">A</text>
          </g>
          {/* Gate A label */}
          <text x="250" y="303" textAnchor="middle" fill={isA ? recommendedStroke : '#94a3b8'} fontSize="9" fontWeight={isA ? 'bold' : 'normal'} fontFamily="sans-serif">
            {isA ? '▲ Gate A' : 'Gate A'}
          </text>
          {/* Gate A wait time */}
          <text x="250" y="314" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">{gateA?.waitTime}m wait</text>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* GATE B — EAST (right)                                       */}
          {/* ═══════════════════════════════════════════════════════════ */}

          {isB && (
            <line
              x1="418" y1="158" x2="478" y2="158"
              stroke={recommendedStroke} strokeWidth="2.5"
              strokeDasharray="6 4"
              className="route-line"
              opacity="0.8"
            />
          )}

          <g transform="translate(408,158)">
            <circle
              r={isB ? 12 : 10}
              fill={isB ? recommendedStroke : CROWD_FILL[bLevel]}
              opacity={isB ? 1 : 0.85}
              style={{ filter: isB ? recommendedGlow : CROWD_GLOW[bLevel] }}
              className={isB ? 'gate-pulse' : ''}
            />
            <text y="1" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">B</text>
          </g>
          <text x="452" y="151" textAnchor="middle" fill={isB ? recommendedStroke : '#94a3b8'} fontSize="9" fontWeight={isB ? 'bold' : 'normal'} fontFamily="sans-serif">
            {isB ? '▶ Gate B' : 'Gate B'}
          </text>
          <text x="452" y="162" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">{gateB?.waitTime}m wait</text>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* GATE C — WEST (left)                                        */}
          {/* ═══════════════════════════════════════════════════════════ */}

          {isC && (
            <line
              x1="82" y1="158" x2="22" y2="158"
              stroke={recommendedStroke} strokeWidth="2.5"
              strokeDasharray="6 4"
              className="route-line"
              opacity="0.8"
            />
          )}

          <g transform="translate(92,158)">
            <circle
              r={isC ? 12 : 10}
              fill={isC ? recommendedStroke : CROWD_FILL[cLevel]}
              opacity={isC ? 1 : 0.85}
              style={{ filter: isC ? recommendedGlow : CROWD_GLOW[cLevel] }}
              className={isC ? 'gate-pulse' : ''}
            />
            <text y="1" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">C</text>
          </g>
          <text x="48" y="151" textAnchor="middle" fill={isC ? recommendedStroke : '#94a3b8'} fontSize="9" fontWeight={isC ? 'bold' : 'normal'} fontFamily="sans-serif">
            {isC ? '◀ Gate C' : 'Gate C'}
          </text>
          <text x="48" y="162" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="sans-serif">{gateC?.waitTime}m wait</text>

          {/* ── Metro icon — top left ─────────────────────────────────── */}
          <g transform="translate(28, 40)">
            <rect x="0" y="0" width="60" height="26" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
            <text x="30" y="11" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">🚇 Metro</text>
            <text x="30" y="21" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">{snapshot.metroQueue.waitTime}m · {snapshot.metroQueue.length}</text>
          </g>

          {/* ── Taxi icon — top right ─────────────────────────────────── */}
          <g transform="translate(412, 40)">
            <rect x="0" y="0" width="62" height="26" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
            <text x="31" y="11" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold" fontFamily="sans-serif">🚕 Taxi</text>
            <text x="31" y="21" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">{snapshot.taxiQueue.waitTime}m · {snapshot.taxiQueue.length}</text>
          </g>

          {/* ── Stadium name ──────────────────────────────────────────── */}
          <text x="250" y="22" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold" letterSpacing="1.5" fontFamily="sans-serif">METLIFE STADIUM</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="font-inter text-[10px] font-semibold uppercase tracking-wider text-gray-500">Crowd Level:</span>
        {(['Low', 'Medium', 'High'] as CongestionLevel[]).map((level) => (
          <span key={level} className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ background: CROWD_FILL[level] }} />
            <span className="font-inter text-[10px] text-gray-400">{level}</span>
          </span>
        ))}
        <span className="flex items-center gap-1 ml-auto">
          <span className="h-2.5 w-2.5 rounded-full inline-block bg-stadium-green" />
          <span className="font-inter text-[10px] text-gray-400">Recommended Exit</span>
        </span>
      </div>
    </div>
  );
};
