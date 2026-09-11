import React from 'react';
import {
  X,
  MapPin,
  Flame,
  Calendar,
  Compass,
  Satellite,
  CheckCircle,
  Download,
  Crosshair,
  ExternalLink,
} from 'lucide-react';
import { Detection } from '../../types/detection';
import { EvidenceSummary } from './EvidenceSummary';
import {
  formatConfidence,
  formatCoordinates,
  formatDateTime,
  formatFRP,
  formatTemp,
} from '../../utils/formatters';
import { getLandcoverLabel } from '../../services/evidenceEngine';

interface DetectionDetailDrawerProps {
  detection: Detection | null;
  onClose: () => void;
  onCenterMap?: (lat: number, lon: number) => void;
  onMarkReviewed?: (id: string) => void;
  onExportSingle?: (d: Detection) => void;
}

export const DetectionDetailDrawer: React.FC<DetectionDetailDrawerProps> = ({
  detection,
  onClose,
  onCenterMap,
  onMarkReviewed,
  onExportSingle,
}) => {
  if (!detection) return null;

  const isIndustrial = detection.predicted_label === 'industrial_persistent';

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-[#0b1322] border-l border-ignis-border shadow-2xl backdrop-blur-xl transition-transform">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 bg-[#0d172a]">
        <div className="flex items-center gap-2.5">
          <div
            className={`h-3 w-3 rounded-full ${
              isIndustrial ? 'bg-red-500' : 'bg-emerald-500'
            }`}
          />
          <div>
            <h2 className="font-mono text-sm font-bold text-slate-100">
              {detection.id}
            </h2>
            <p className="text-[11px] text-slate-400">
              Observation: {formatDateTime(detection.acq_datetime)}
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Prominent AI Decision / Evidence Verdict Card */}
        <EvidenceSummary detection={detection} />

        {/* Location Section */}
        <div className="rounded-lg bg-slate-900/60 p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>Geographic Coordinates</span>
            </div>
            {onCenterMap && (
              <button
                onClick={() => onCenterMap(detection.latitude, detection.longitude)}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
              >
                <Crosshair className="h-3 w-3" />
                <span>Locate on Map</span>
              </button>
            )}
          </div>
          <div className="font-mono text-sm font-bold text-slate-200">
            {formatCoordinates(detection.latitude, detection.longitude)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Raw: {detection.latitude.toFixed(5)}, {detection.longitude.toFixed(5)}
          </p>
        </div>

        {/* Thermal Evidence */}
        <div className="rounded-lg bg-slate-900/60 p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            <span>Thermal Radiative Evidence</span>
          </div>
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="rounded bg-slate-950/60 p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Brightness</span>
              <span className="text-sm font-bold text-slate-100">
                {formatTemp(detection.brightness)}
              </span>
            </div>
            <div className="rounded bg-slate-950/60 p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">FRP</span>
              <span className="text-sm font-bold text-orange-400">
                {formatFRP(detection.frp)}
              </span>
            </div>
            <div className="rounded bg-slate-950/60 p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Bright T31</span>
              <span className="text-sm font-bold text-slate-100">
                {detection.bright_t31 ? formatTemp(detection.bright_t31) : 'N/A'}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>Pixel Scan: {detection.scan}</span>
            <span>Pixel Track: {detection.track}</span>
            <span>FIRMS Confidence: {detection.confidence}</span>
          </div>
        </div>

        {/* Persistence Evidence */}
        <div className="rounded-lg bg-slate-900/60 p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            <span>Thermal Persistence Engine (~1 km grid)</span>
          </div>
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="rounded bg-slate-950/60 p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Detections</span>
              <span className="text-sm font-bold text-slate-100">
                {detection.detection_count}
              </span>
            </div>
            <div className="rounded bg-slate-950/60 p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Distinct Days</span>
              <span className={`text-sm font-bold ${detection.distinct_days > 5 ? 'text-red-400' : 'text-slate-100'}`}>
                {detection.distinct_days}
              </span>
            </div>
            <div className="rounded bg-slate-950/60 p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block uppercase">Active Span</span>
              <span className="text-sm font-bold text-slate-100">
                {detection.active_span_days}d
              </span>
            </div>
          </div>
          {(detection.first_seen || detection.last_seen) && (
            <div className="mt-3 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60 flex justify-between">
              <span>First: {detection.first_seen || 'N/A'}</span>
              <span>Last: {detection.last_seen || 'N/A'}</span>
            </div>
          )}
        </div>

        {/* Geospatial Evidence (WorldCover & OSM) */}
        <div className="rounded-lg bg-slate-900/60 p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <Compass className="h-3.5 w-3.5 text-emerald-400" />
            <span>Fused Geospatial Evidence</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">ESA WorldCover 10m:</span>
              <span className="font-semibold text-slate-200">
                {getLandcoverLabel(detection.landcover)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Distance to Mapped Industrial:</span>
              <span className="font-mono font-semibold text-slate-200">
                {detection.osm_industrial_dist_km !== null
                  ? `${detection.osm_industrial_dist_km.toFixed(2)} km`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Inside Industrial Polygon:</span>
              <span
                className={`font-semibold font-mono ${
                  detection.osm_inside_industrial === 1
                    ? 'text-red-400'
                    : 'text-slate-400'
                }`}
              >
                {detection.osm_inside_industrial === 1 ? 'YES (Match)' : 'NO'}
              </span>
            </div>
          </div>
        </div>

        {/* Satellite Platform Info */}
        <div className="rounded-lg bg-slate-900/60 p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            <Satellite className="h-3.5 w-3.5 text-cyan-400" />
            <span>Satellite Observation Parameters</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded bg-slate-950/60 p-2 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block uppercase">Sensor</span>
              <span className="font-mono text-slate-200 font-bold">{detection.satellite}</span>
            </div>
            <div className="rounded bg-slate-950/60 p-2 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block uppercase">Pass</span>
              <span className="font-mono text-slate-200 font-bold">
                {detection.daynight === 'D' ? 'Day (D)' : 'Night (N)'}
              </span>
            </div>
            <div className="rounded bg-slate-950/60 p-2 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block uppercase">Review Status</span>
              <span className="font-mono text-slate-200 font-bold capitalize">
                {detection.review_status || 'Unreviewed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Action Bar */}
      <div className="border-t border-slate-800 bg-[#0d172a] p-4 flex gap-3">
        {onMarkReviewed && (
          <button
            onClick={() => onMarkReviewed(detection.id)}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 py-2.5 text-xs font-semibold transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark as Reviewed</span>
          </button>
        )}
        {onExportSingle && (
          <button
            onClick={() => onExportSingle(detection)}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        )}
      </div>
    </div>
  );
};
