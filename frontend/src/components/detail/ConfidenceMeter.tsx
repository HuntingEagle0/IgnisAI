import React from 'react';

interface ConfidenceMeterProps {
  confidence: number; // 0.0 to 1.0
  classification: 'vegetation_fire' | 'industrial_persistent';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  classification,
}) => {
  const pct = Math.round(confidence * 1000) / 10;
  const isIndustrial = classification === 'industrial_persistent';

  const getColor = () => {
    if (isIndustrial) {
      if (pct >= 90) return 'from-red-500 to-rose-600';
      if (pct >= 75) return 'from-orange-500 to-red-500';
      return 'from-amber-500 to-orange-500';
    } else {
      if (pct >= 90) return 'from-emerald-400 to-teal-500';
      if (pct >= 75) return 'from-emerald-500 to-emerald-600';
      return 'from-lime-500 to-emerald-500';
    }
  };

  const getTier = () => {
    if (pct >= 95) return 'VERY HIGH CONFIDENCE';
    if (pct >= 85) return 'HIGH CONFIDENCE';
    if (pct >= 70) return 'MODERATE CONFIDENCE';
    return 'EVALUATION THRESHOLD';
  };

  return (
    <div className="space-y-1.5 rounded-lg bg-slate-900/60 p-3 border border-slate-800">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-slate-400 font-medium">{getTier()}</span>
        <span className="font-mono font-bold text-slate-100 text-sm">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getColor()}`}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
};
