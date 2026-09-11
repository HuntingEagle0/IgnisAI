import React, { useState } from 'react';
import { Detection } from '../types/detection';
import {
  Factory,
  Flame,
  Calendar,
  Compass,
  ArrowRight,
  ShieldAlert,
  Clock,
  MapPin,
  Search,
} from 'lucide-react';
import { formatConfidence, formatCoordinates, formatDateTime, formatFRP } from '../utils/formatters';
import { getLandcoverLabel } from '../services/evidenceEngine';

interface IndustrialSitesPageProps {
  detections: Detection[];
  onSelectDetection: (d: Detection) => void;
}

export const IndustrialSitesPage: React.FC<IndustrialSitesPageProps> = ({
  detections,
  onSelectDetection,
}) => {
  // Filter only industrial persistent sources and sort by persistence (distinct_days desc, detection_count desc)
  const industrialSites = detections
    .filter((d) => d.predicted_label === 'industrial_persistent')
    .sort((a, b) => b.distinct_days - a.distinct_days || b.detection_count - a.detection_count);

  const [selectedSite, setSelectedSite] = useState<Detection>(
    industrialSites[0] || detections[0]
  );
  const [search, setSearch] = useState('');

  const filteredSites = industrialSites.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      `${s.latitude},${s.longitude}`.includes(q) ||
      (s.notes && s.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-ignis-border pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Factory className="h-4 w-4 text-red-400" />
          <span className="font-mono text-xs font-semibold text-red-400 uppercase tracking-wider">
            STATIONARY EMITTER PROFILING
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Industrial Site Intelligence & Persistence Ranking
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Surveillance of stationary high-heat industrial emitters, brick kilns, refinery flares, and furnace hubs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Industrial Persistence Ranking Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-4 backdrop-blur-md shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Persistence Ranking Table ({filteredSites.length} Static Emitters)
                </h2>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter site ID / location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-lg bg-slate-950 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#080c14] text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Site / Anomaly ID</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Persistence</th>
                    <th className="py-3 px-3">Confidence</th>
                    <th className="py-3 px-3">FRP</th>
                    <th className="py-3 px-3">OSM Proximity</th>
                    <th className="py-3 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredSites.map((site, index) => {
                    const isSelected = selectedSite?.id === site.id;
                    return (
                      <tr
                        key={site.id}
                        onClick={() => setSelectedSite(site)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-red-500/10 border-l-2 border-red-500'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-slate-400">
                          #{String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-200">{site.id}</td>
                        <td className="py-3 px-3 text-slate-400">
                          {formatCoordinates(site.latitude, site.longitude)}
                        </td>
                        <td className="py-3 px-3 text-red-400 font-bold">
                          {site.distinct_days} days{' '}
                          <span className="text-slate-500 text-[10px]">({site.detection_count} hits)</span>
                        </td>
                        <td className="py-3 px-3 text-slate-100 font-bold">
                          {formatConfidence(site.prediction_confidence)}
                        </td>
                        <td className="py-3 px-3 text-orange-400 font-bold">
                          {formatFRP(site.frp)}
                        </td>
                        <td className="py-3 px-3">
                          {site.osm_inside_industrial === 1 ? (
                            <span className="text-red-400 font-bold">Inside Polygon</span>
                          ) : site.osm_industrial_dist_km !== null ? (
                            <span className="text-slate-300">{site.osm_industrial_dist_km.toFixed(2)} km</span>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDetection(site);
                            }}
                            className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] text-cyan-400 font-medium transition-colors"
                          >
                            Details
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

        {/* Right Col: Selected Site Historical Timeline (Section 13) */}
        <div className="space-y-4">
          <div className="rounded-xl border border-ignis-border bg-[#0d1524]/90 p-5 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <Clock className="h-4 w-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Historical Thermal Timeline
              </h2>
            </div>

            {selectedSite ? (
              <div className="space-y-6">
                {/* Site Quick Snapshot */}
                <div className="rounded-lg bg-slate-950/60 p-3.5 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-mono text-sm font-bold text-slate-100">
                        {selectedSite.id}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {formatCoordinates(selectedSite.latitude, selectedSite.longitude)}
                      </p>
                    </div>
                    <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400 border border-red-500/30">
                      PERSISTENT STATIC
                    </span>
                  </div>
                  {selectedSite.notes && (
                    <p className="text-xs text-slate-300 italic">
                      "{selectedSite.notes}"
                    </p>
                  )}
                </div>

                {/* Vertical Timeline Steps matching Section 13 */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {/* Step 1: First Seen */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-cyan-400 bg-[#0d1524]" />
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                      First Seen / Inception
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-200">
                      {selectedSite.first_seen || '2024-03-01'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Initial thermal breakthrough captured by VIIRS pass
                    </p>
                  </div>

                  {/* Step 2: Repeated Detections */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-orange-400 bg-[#0d1524]" />
                    <span className="text-[10px] font-mono uppercase text-orange-400 font-bold block">
                      Repeated Observations
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-200">
                      {selectedSite.detection_count} Cumulative Hits
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Consistent multi-pass heat output across Day and Night sensor overflights
                    </p>
                  </div>

                  {/* Step 3: Persistent Activity */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-red-500 bg-[#0d1524]" />
                    <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">
                      Active Operational Span
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-200">
                      {selectedSite.distinct_days} Distinct Days ({selectedSite.active_span_days}d Span)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Spatial binning confirms stationary static emitter clustering
                    </p>
                  </div>

                  {/* Step 4: Latest Detection */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-emerald-400 bg-[#0d1524]" />
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      Latest Observation
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-200">
                      {selectedSite.last_seen || formatDateTime(selectedSite.acq_datetime)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Active emission with FRP {formatFRP(selectedSite.frp)} at {selectedSite.brightness} K
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectDetection(selectedSite)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 py-2 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <span>Open Full Detail Dossier</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-mono text-center py-8">
                Select an industrial source to view timeline
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
