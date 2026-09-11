import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Factory, Trees } from 'lucide-react';
import { Detection } from '../../types/detection';
import { generateEvidenceSummary } from '../../services/evidenceEngine';
import { ConfidenceMeter } from './ConfidenceMeter';

interface EvidenceSummaryProps {
  detection: Detection;
}

export const EvidenceSummary: React.FC<EvidenceSummaryProps> = ({ detection }) => {
  const evidence = generateEvidenceSummary(detection);
  const isIndustrial = detection.predicted_label === 'industrial_persistent';

  return (
    <div
      className={`rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all ${
        isIndustrial
          ? 'border-red-500/40 bg-gradient-to-b from-red-950/30 via-slate-900/80 to-slate-900/90 shadow-red-950/30'
          : 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-slate-900/80 to-slate-900/90 shadow-emerald-950/30'
      }`}
    >
      {/* SIH Hackathon Presentation Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          {isIndustrial ? (
            <Factory className="h-5 w-5 text-red-400" />
          ) : (
            <Trees className="h-5 w-5 text-emerald-400" />
          )}
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            AI CLASSIFICATION VERDICT
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-0.5 border border-slate-700">
          <ShieldCheck className="h-3 w-3 text-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-300 font-semibold">
            PyTorch MLP
          </span>
        </div>
      </div>

      {/* Primary Classification Label */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              isIndustrial ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
            }`}
          />
          <h3
            className={`font-mono text-lg sm:text-xl font-extrabold tracking-tight ${
              isIndustrial ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {isIndustrial ? 'INDUSTRIAL PERSISTENT' : 'VEGETATION FIRE'}
          </h3>
        </div>
        <p className="mt-1 text-xs text-slate-300">
          {isIndustrial
            ? 'Static high-temperature emitter (refinery flare, kiln, furnace, or power plant)'
            : 'Wildland, forest, or open agricultural crop-residue fire'}
        </p>
      </div>

      {/* Confidence Meter */}
      <div className="mb-4">
        <ConfidenceMeter
          confidence={detection.prediction_confidence}
          classification={detection.predicted_label}
        />
      </div>

      {/* Dynamic Evidence Bullets */}
      <div className="space-y-2 mb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          Corroborating Evidence
        </span>
        <div className="space-y-1.5">
          {evidence.bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/50 p-2 rounded border border-slate-800/60"
            >
              <CheckCircle2
                className={`h-4 w-4 shrink-0 mt-0.5 ${
                  isIndustrial ? 'text-red-400' : 'text-emerald-400'
                }`}
              />
              <span className="leading-snug">{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Human-readable Narrative Explanation */}
      <div className="rounded-lg bg-slate-950/60 p-3 border border-slate-800">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Automated Reasoning Summary</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "{evidence.narrative}"
        </p>
      </div>
    </div>
  );
};
