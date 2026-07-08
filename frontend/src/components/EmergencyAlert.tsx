import type React from 'react';
import type { EmergencyAlert } from '../types';
import { AlertTriangle, Info, X } from 'lucide-react';

interface EmergencyAlertBannerProps {
  alert: EmergencyAlert;
  onDismiss?: () => void;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({ alert, onDismiss }) => {
  if (!alert.active) return null;

  const styles = {
    danger: {
      container: 'border-rose-500/60 bg-rose-500/10',
      icon: 'text-rose-400',
      text: 'text-rose-300',
      pulse: 'bg-rose-500',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    warning: {
      container: 'border-amber-500/60 bg-amber-500/10',
      icon: 'text-amber-400',
      text: 'text-amber-300',
      pulse: 'bg-amber-500',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    info: {
      container: 'border-stadium-mint/60 bg-stadium-mint/10',
      icon: 'text-stadium-mint',
      text: 'text-cyan-300',
      pulse: 'bg-stadium-mint',
      badge: 'bg-stadium-mint/20 text-cyan-300 border-stadium-mint/30',
    },
  };

  const s = styles[alert.type] ?? styles.warning;

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-xl border p-4 ${s.container} transition-all duration-300`}
    >
      {/* Pulsing indicator */}
      <span className="relative mt-0.5 flex h-3 w-3 shrink-0">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${s.pulse}`} />
        <span className={`relative inline-flex h-3 w-3 rounded-full ${s.pulse}`} />
      </span>

      {/* Icon */}
      {alert.type === 'info' ? (
        <Info className={`h-5 w-5 shrink-0 ${s.icon}`} />
      ) : (
        <AlertTriangle className={`h-5 w-5 shrink-0 ${s.icon}`} />
      )}

      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`rounded-full border px-2 py-0.5 font-outfit text-[10px] font-bold uppercase tracking-wider ${s.badge}`}>
            {alert.type === 'danger' ? '🚨 Emergency Alert' : alert.type === 'warning' ? '⚠️ Warning' : 'ℹ️ Notice'}
          </span>
        </div>
        <p className={`font-inter text-sm font-medium leading-relaxed ${s.text}`}>
          {alert.message}
        </p>
        <p className="font-inter text-[10px] text-gray-500 mt-1">
          Issued: {new Date(alert.timestamp).toLocaleTimeString()}
        </p>
      </div>

      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 rounded-lg p-1 text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
