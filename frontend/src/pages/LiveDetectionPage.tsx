import React, { useState } from 'react';
import {
  Flame,
  Factory,
  Trees,
  RefreshCw,
  Download,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';
import { Detection } from '../types/detection';
import {
  formatConfidence,
  formatCoordinates,
  formatDateTime,
  formatFRP,
} from '../utils/formatters';
import { getLandcoverLabel } from '../services/evidenceEngine';
import { exportDetectionsToCsv } from '../utils/exportCsv';

interface LiveDetectionPageProps {
  detections: Detection[];
  onSelectDetection: (d: Detection) => void;
  onRefreshNRT: () => void;
  isRefreshing: boolean;
  lastRefreshTime: string;
}

export const LiveDetectionPage: React.FC<LiveDetectionPageProps> = ({
  detections,
  onSelectDetection,
  onRefreshNRT,
  isRefreshing,
  lastRefreshTime,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<'all' | 'industrial_persistent' | 'vegetation_fire'>('all');
  const [minConf, setMinConf] = useState(0);
  const [satFilter, setSatFilter] = useState('all');

  const industrialCount = detections.filter((d) => d.predicted_label === 'industrial_persistent').length;
  const vegetationCount = detections.filter((d) => d.predicted_label === 'vegetation_fire').length;
  const highConfCount = detections.filter((d) => d.prediction_confidence >= 0.95).length;

  const filtered = detections.filter((d) => {
    if (classFilter !== 'all' && d.predicted_label !== classFilter) return false;
    if (d.prediction_confidence * 100 < minConf) return false;
    if (satFilter !== 'all' && !d.satellite.toLowerCase().includes(satFilter.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = d.id.toLowerCase().includes(q);
      const matchCoord = `${d.latitude},${d.longitude}`.includes(q);
      const matchNotes = d.notes?.toLowerCase().includes(q) ?? false;
      if (!matchId && !matchCoord && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-ignis-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              NRT VIIRS HOTSPOT STREAM
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Live Satellite Detection Feed
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fresh NASA FIRMS thermal observations classified via trained PyTorch MLP
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportDetectionsToCsv(filtered)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onRefreshNRT}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-4 py-2 text-xs font-semibold text-white transition-all shadow-md shadow-cyan-950/50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Ingesting NRT...' : 'Refresh NRT Feed'}</span>
          </button>
        </div>
      </div>

      {/* Stream Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Active Stream Hotspots</span>
          <span className="font-mono text-xl font-bold text-slate-100">{detections.length}</span>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3.5">
          <span className="text-[11px] font-mono text-red-400 uppercase block">Industrial Sources</span>
          <span className="font-mono text-xl font-bold text-red-400">{industrialCount}</span>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
          <span className="text-[11px] font-mono text-emerald-400 uppercase block">Vegetation Fires</span>
          <span className="font-mono text-xl font-bold text-emerald-400">{vegetationCount}</span>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5">
          <span className="text-[11px] font-mono text-amber-400 uppercase block">High Confidence Alerts</span>
          <span className="font-mono text-xl font-bold text-amber-400">{highConfCount}</span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Last Data Refresh</span>
          <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1 mt-1">
            <Clock className="h-3.5 w-3.5" />
            {lastRefreshTime}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#0d1524]/80 p-4 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, coordinates, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-slate-950/80 border border-slate-800 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Classification Filter Buttons */}
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setClassFilter('all')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                classFilter === 'all'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({detections.length})
            </button>
            <button
              onClick={() => setClassFilter('industrial_persistent')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                classFilter === 'industrial_persistent'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Industrial ({industrialCount})
            </button>
            <button
              onClick={() => setClassFilter('vegetation_fire')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
                classFilter === 'vegetation_fire'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Vegetation ({vegetationCount})
            </button>
          </div>

          {/* Min Confidence */}
          <select
            value={minConf}
            onChange={(e) => setMinConf(Number(e.target.value))}
            className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value={0}>Confidence: Any</option>
            <option value={80}>Confidence ≥ 80%</option>
            <option value={90}>Confidence ≥ 90%</option>
            <option value={95}>Confidence ≥ 95%</option>
          </select>

          {/* Satellite */}
          <select
            value={satFilter}
            onChange={(e) => setSatFilter(e.target.value)}
            className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Sensors</option>
            <option value="SNPP">SNPP (VIIRS)</option>
            <option value="NOAA-20">NOAA-20</option>
            <option value="NOAA-21">NOAA-21 (NRT)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-ignis-border bg-[#0d1524]/90 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#080c14] text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Hotspot ID</th>
                <th className="py-3.5 px-4">Coordinates</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Thermal FRP</th>
                <th className="py-3.5 px-4">Persistence</th>
                <th className="py-3.5 px-4">Land Cover</th>
                <th className="py-3.5 px-4">Satellite</th>
                <th className="py-3.5 px-4">Observation Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 font-mono">
                    No satellite thermal detections match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => {
                  const isIndustrial = d.predicted_label === 'industrial_persistent';
                  const isReviewed = d.review_status === 'reviewed';

                  return (
                    <tr
                      key={d.id}
                      onClick={() => onSelectDetection(d)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      {/* Review Badge */}
                      <td className="py-3 px-4 font-sans">
                        {isReviewed ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                            Reviewed
                          </span>
                        ) : isIndustrial ? (
                          <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
                            Triage
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                            Unreviewed
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-200">{d.id}</td>

                      <td className="py-3 px-4 text-slate-400">
                        {formatCoordinates(d.latitude, d.longitude)}
                      </td>

                      {/* AI Classification */}
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

                      <td className="py-3 px-4 font-bold text-orange-400">
                        {formatFRP(d.frp)}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        <span className={d.distinct_days > 5 ? 'text-red-400 font-bold' : ''}>
                          {d.distinct_days} days
                        </span>{' '}
                        <span className="text-slate-500">({d.detection_count} hits)</span>
                      </td>

                      <td className="py-3 px-4 font-sans text-slate-400">
                        {getLandcoverLabel(d.landcover)}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {d.satellite} ({d.daynight})
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        {formatDateTime(d.acq_datetime)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDetection(d);
                          }}
                          className="rounded bg-slate-800 hover:bg-slate-700 px-3 py-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 bg-[#080c14] px-4 py-3 text-xs font-mono text-slate-400">
          <span>Showing {filtered.length} of {detections.length} total NRT observations</span>
          <span>Engine: PyTorch MLP (128 → 64 → 32 → 2)</span>
        </div>
      </div>
    </div>
  );
};
