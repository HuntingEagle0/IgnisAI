import React, { useState } from 'react';
import { Alert } from '../../types/detection';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { formatConfidence, formatFRP } from '../../utils/formatters';

interface AlertCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onSelectAlertDetection: (detectionId: string) => void;
}

export const AlertCenterModal: React.FC<AlertCenterModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onSelectAlertDetection,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((a) =>
    selectedSeverity === 'all' ? true : a.severity === selectedSeverity
  );

  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400 border border-red-500/30">
            <ShieldAlert className="h-3 w-3" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="flex items-center gap-1 rounded bg-orange-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-orange-400 border border-orange-500/30">
            <AlertTriangle className="h-3 w-3" />
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-3 w-3" />
            MEDIUM
          </span>
        );
      case 'informational':
        return (
          <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
            <Info className="h-3 w-3" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-ignis-border bg-[#0b1322] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#0d172a]">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-red-500/10 p-2 border border-red-500/20">
              <ShieldAlert className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Thermal Alert Command Center
              </h2>
              <p className="text-xs text-slate-400">
                Operational triage of industrial and wildland thermal anomalies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 px-6 py-2.5 bg-slate-950/40 text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-2">Severity:</span>
          {(['all', 'critical', 'high', 'informational'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`rounded-md px-2.5 py-1 font-mono text-[11px] capitalize transition-colors ${
                selectedSeverity === sev
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
          <span className="ml-auto font-mono text-slate-400 text-[11px]">
            {filteredAlerts.length} Alerts
          </span>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-sm">
              No alerts matching the selected filter criteria.
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alert.severity)}
                      <span className="font-mono text-xs text-slate-300 font-semibold">
                        {alert.id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {alert.timestamp}
                      </span>
                      {alert.location.region && (
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400 font-mono">
                          {alert.location.region}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {alert.reason}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                      <span>
                        Thermal Power:{' '}
                        <strong className="text-orange-400 font-bold">
                          {formatFRP(alert.frp)}
                        </strong>
                      </span>
                      <span>
                        AI Confidence:{' '}
                        <strong className="text-cyan-400 font-bold">
                          {formatConfidence(alert.confidence)}
                        </strong>
                      </span>
                      <span>
                        Classification:{' '}
                        <strong
                          className={
                            alert.classification === 'industrial_persistent'
                              ? 'text-red-400 font-bold'
                              : 'text-emerald-400 font-bold'
                          }
                        >
                          {alert.classification === 'industrial_persistent'
                            ? 'Industrial'
                            : 'Vegetation'}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectAlertDetection(alert.detection_id);
                      onClose();
                    }}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 px-3 py-1.5 text-xs font-semibold transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
