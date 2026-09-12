import React, { useState } from 'react';
import { ThermalMap } from '../components/map/ThermalMap';
import { MapFilterBar } from '../components/map/MapFilterBar';
import { Detection, FilterState } from '../types/detection';
import { SlidersHorizontal, Eye, EyeOff, Radio } from 'lucide-react';

interface ThermalMapPageProps {
  detections: Detection[];
  selectedDetection: Detection | null;
  onSelectDetection: (d: Detection) => void;
  centerCoords?: [number, number] | null;
}

export const ThermalMapPage: React.FC<ThermalMapPageProps> = ({
  detections,
  selectedDetection,
  onSelectDetection,
  centerCoords,
}) => {
  const initialFilter: FilterState = {
    classification: 'all',
    minConfidence: 0,
    minFRP: 0,
    maxFRP: 100,
    timeRange: 'all',
    landcover: 'all',
    industrialProximity: 'all',
    satellite: 'all',
    searchQuery: '',
  };

  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [showFilters, setShowFilters] = useState(true);

  // Apply filters
  const filtered = detections.filter((d) => {
    if (filter.classification !== 'all' && d.predicted_label !== filter.classification) return false;
    if (d.prediction_confidence * 100 < filter.minConfidence) return false;
    if (d.frp < filter.minFRP) return false;
    if (filter.landcover !== 'all' && d.landcover !== filter.landcover) return false;
    if (filter.satellite !== 'all' && !d.satellite.toLowerCase().includes(filter.satellite.toLowerCase())) return false;
    if (filter.industrialProximity !== 'all') {
      if (filter.industrialProximity === 'inside' && d.osm_inside_industrial !== 1) return false;
      if (filter.industrialProximity === 'lt1km' && (d.osm_industrial_dist_km === null || d.osm_industrial_dist_km >= 1.0)) return false;
      if (filter.industrialProximity === 'lt5km' && (d.osm_industrial_dist_km === null || d.osm_industrial_dist_km >= 5.0)) return false;
      if (filter.industrialProximity === 'gt5km' && (d.osm_industrial_dist_km === null || d.osm_industrial_dist_km <= 5.0)) return false;
    }
    return true;
  });

  const industrialSources = filtered.filter((d) => d.predicted_label === 'industrial_persistent').length;
  const vegetationFires = filtered.filter((d) => d.predicted_label === 'vegetation_fire').length;
  const avgFrp =
    filtered.length > 0
      ? (filtered.reduce((acc, d) => acc + d.frp, 0) / filtered.length).toFixed(1)
      : '0.0';

  return (
    <div className="relative h-[calc(100vh-8.5rem)] min-h-[600px] w-full overflow-hidden rounded-xl border border-ignis-border shadow-2xl">
      {/* Underlying Map Component */}
      <ThermalMap
        detections={filtered}
        selectedDetection={selectedDetection}
        onSelectDetection={onSelectDetection}
        centerCoords={centerCoords}
        heightClass="h-full"
      />

      {/* Floating Filter Toggle for Mobile */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-3 left-44 z-[10] flex items-center gap-1.5 rounded-lg bg-[#0d1524]/90 px-3 py-1.5 text-xs font-mono text-cyan-300 border border-slate-800 shadow-lg backdrop-blur-md hover:bg-slate-800 transition-colors"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
      </button>

      {/* Left Floating Controls Drawer */}
      {showFilters && (
        <div className="absolute top-14 left-3 z-[10] w-80 max-h-[calc(100%-8rem)] overflow-y-auto no-scrollbar transition-all">
          <MapFilterBar
            filter={filter}
            onChange={setFilter}
            onReset={() => setFilter(initialFilter)}
          />
        </div>
      )}

      {/* Bottom Mission Intel Bar (Required Section 8) */}
      <div className="absolute bottom-3 right-3 left-3 sm:left-auto z-[10] flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ignis-border bg-[#0a101d]/95 px-5 py-3 shadow-2xl backdrop-blur-xl font-mono text-xs">
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-200">
            Detections displayed: <span className="text-cyan-400">{filtered.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <div>
            Industrial sources:{' '}
            <strong className="text-red-400 font-bold">{industrialSources}</strong>
          </div>
          <div>
            Vegetation fires:{' '}
            <strong className="text-emerald-400 font-bold">{vegetationFires}</strong>
          </div>
          <div className="hidden md:block">
            Avg FRP: <strong className="text-orange-400 font-bold">{avgFrp} MW</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
