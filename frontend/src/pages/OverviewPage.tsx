import React from 'react';
import {
  Flame,
  Factory,
  Trees,
  ShieldAlert,
  Globe2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { KpiCard } from '../components/kpi/KpiCard';
import { ThermalMap } from '../components/map/ThermalMap';
import { Detection } from '../types/detection';
import { formatConfidence, formatCoordinates, formatFRP } from '../utils/formatters';
import { getLandcoverLabel } from '../services/evidenceEngine';

interface OverviewPageProps {
  detections: Detection[];
  selectedDetection: Detection | null;
  onSelectDetection: (d: Detection) => void;
  onNavigateToLive: () => void;
  onNavigateToMap: () => void;
  isDemoMode: boolean;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  detections,
  selectedDetection,
  onSelectDetection,
  onNavigateToLive,
  onNavigateToMap,
  isDemoMode,
}) => {
  const industrialCount = detections.filter(
    (d) => d.predicted_label === 'industrial_persistent'
  ).length;
  const vegetationCount = detections.filter(
    (d) => d.predicted_label === 'vegetation_fire'
  ).length;
  const highConfAlerts = detections.filter(
    (d) => d.prediction_confidence >= 0.95
  ).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Top Banner / Mission Context */}
      <div className="relative overflow-hidden rounded-2xl border border-ignis-border bg-gradient-to-r from-[#0d172a] via-[#091120] to-[#0d172a] p-6 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-cyan-400 border border-cyan-500/30">
              OPERATIONAL INTELLIGENCE PLATFORM
            </span>
            <span className="text-xs text-slate-400 font-mono">
              VIIRS 375m • ESA WorldCover • OSM Overpass
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-100">
            AI-Driven Detection of Industrial Fires & Persistent Thermal Sources
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Continuously ingests satellite thermal anomalies, extracts spatial persistence and land-cover signatures, and deploys deep learning to distinguish genuine wildland/crop fires from stationary industrial emitters like kilns, flares, and power plants.
          </p>
        </div>
      </div>

      {/* Hero KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          title="Total Hotspots"
          value={detections.length.toLocaleString()}
          subtext="Active in buffer region"
          icon={<Flame className="h-5 w-5" />}
          variant="cyan"
          isDemo={isDemoMode}
        />
        <KpiCard
          title="Industrial Sources"
          value={industrialCount.toLocaleString()}
          subtext="Persistent static emitters"
          icon={<Factory className="h-5 w-5" />}
          variant="red"
          isDemo={isDemoMode}
        />
        <KpiCard
          title="Vegetation Fires"
          value={vegetationCount.toLocaleString()}
          subtext="Forest & crop residue burns"
          icon={<Trees className="h-5 w-5" />}
          variant="green"
          isDemo={isDemoMode}
        />
        <KpiCard
          title="High Confidence"
          value={highConfAlerts.toLocaleString()}
          subtext="AI certainty ≥ 95%"
          icon={<ShieldAlert className="h-5 w-5" />}
          variant="amber"
          isDemo={isDemoMode}
        />
        <KpiCard
          title="Monitored Area"
          value="India / N27E075"
          subtext="VIIRS I-Band footprint"
          icon={<Globe2 className="h-5 w-5" />}
          variant="neutral"
          isDemo={false}
        />
      </div>

      {/* Main Interactive Map Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 tracking-tight">
              Live Geospatial Thermal Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Interactive map displaying AI-classified thermal anomalies across observation passes
            </p>
          </div>
          <button
            onClick={onNavigateToMap}
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Full-Screen Map View</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <ThermalMap
          detections={detections}
          selectedDetection={selectedDetection}
          onSelectDetection={onSelectDetection}
          heightClass="h-[480px]"
        />
      </div>

      {/* Recent Detections Preview Table */}
      <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
              Recent Thermal Detections Stream
            </h3>
          </div>
          <button
            onClick={onNavigateToLive}
            className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All Stream Detections</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#080d18] text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Hotspot ID</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4">FRP</th>
                <th className="py-3 px-4">Persistence</th>
                <th className="py-3 px-4">Land Cover</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {detections.slice(0, 6).map((d) => {
                const isIndustrial = d.predicted_label === 'industrial_persistent';
                return (
                  <tr
                    key={d.id}
                    onClick={() => onSelectDetection(d)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-200">{d.id}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatCoordinates(d.latitude, d.longitude)}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                          isIndustrial
                            ? 'bg-red-500/15 text-red-400 border-red-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isIndustrial ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                        />
                        {isIndustrial ? 'Industrial' : 'Vegetation'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-100">
                      {formatConfidence(d.prediction_confidence)}
                    </td>
                    <td className="py-3 px-4 text-orange-400 font-bold">
                      {formatFRP(d.frp)}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {d.distinct_days} days ({d.detection_count} hits)
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400">
                      {getLandcoverLabel(d.landcover)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDetection(d);
                        }}
                        className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
