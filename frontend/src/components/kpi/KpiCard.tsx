import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  variant?: 'cyan' | 'red' | 'green' | 'amber' | 'neutral';
  isDemo?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  icon,
  variant = 'cyan',
  isDemo = false,
}) => {
  const variantStyles = {
    cyan: 'border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-900/60 text-cyan-400',
    red: 'border-red-500/30 bg-gradient-to-b from-red-950/20 to-slate-900/60 text-red-400',
    green: 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 text-emerald-400',
    amber: 'border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-900/60 text-amber-400',
    neutral: 'border-slate-800 bg-gradient-to-b from-slate-900/40 to-slate-900/80 text-slate-400',
  };

  const iconBg = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.01] ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </span>
            {isDemo && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-mono text-amber-300 border border-amber-500/30">
                DEMO
              </span>
            )}
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            {value}
          </div>
          {subtext && (
            <p className="text-[11px] font-medium text-slate-400">
              {subtext}
            </p>
          )}
        </div>
        <div className={`rounded-lg border p-2.5 ${iconBg[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
