import React from 'react';
import { FilterState, ClassificationType } from '../../types/detection';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface MapFilterBarProps {
  filter: FilterState;
  onChange: (newFilter: FilterState) => void;
  onReset: () => void;
}

export const MapFilterBar: React.FC<MapFilterBarProps> = ({
  filter,
  onChange,
  onReset,
}) => {
  return (
    <div className="rounded-xl border border-ignis-border bg-[#0d1524]/90 p-4 backdrop-blur-md shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Detection Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Classification */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-400">Classification</label>
        <div className="grid grid-cols-3 gap-1 text-xs">
          {(['all', 'industrial_persistent', 'vegetation_fire'] as const).map((cls) => (
            <button
              key={cls}
              onClick={() => onChange({ ...filter, classification: cls })}
              className={`py-1.5 px-2 rounded text-[11px] font-medium transition-colors ${
                filter.classification === cls
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cls === 'all'
                ? 'All'
                : cls === 'industrial_persistent'
                ? 'Industrial'
                : 'Vegetation'}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Confidence */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-400">Min Confidence</span>
          <span className="font-mono font-semibold text-cyan-400">
            {filter.minConfidence > 0 ? `≥ ${filter.minConfidence}%` : 'All'}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={95}
          step={5}
          value={filter.minConfidence}
          onChange={(e) =>
            onChange({ ...filter, minConfidence: Number(e.target.value) })
          }
          className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>0%</span>
          <span>70%</span>
          <span>85%</span>
          <span>95%</span>
        </div>
      </div>

      {/* Minimum FRP */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-400">Min Thermal Power (FRP)</span>
          <span className="font-mono font-semibold text-orange-400">
            {filter.minFRP > 0 ? `≥ ${filter.minFRP} MW` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={60}
          step={5}
          value={filter.minFRP}
          onChange={(e) =>
            onChange({ ...filter, minFRP: Number(e.target.value) })
          }
          className="w-full accent-orange-500 bg-slate-800 h-1.5 rounded cursor-pointer"
        />
      </div>

      {/* Industrial Proximity */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-400">
          Industrial Proximity
        </label>
        <select
          value={filter.industrialProximity}
          onChange={(e) =>
            onChange({
              ...filter,
              industrialProximity: e.target.value as FilterState['industrialProximity'],
            })
          }
          className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">Any Distance</option>
          <option value="inside">Inside Industrial Area (Match)</option>
          <option value="lt1km">&lt; 1 km to Industrial</option>
          <option value="lt5km">&lt; 5 km to Industrial</option>
          <option value="gt5km">&gt; 5 km (Isolated / Rural)</option>
        </select>
      </div>

      {/* Land Cover Class */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-400">
          ESA WorldCover Class
        </label>
        <select
          value={filter.landcover}
          onChange={(e) =>
            onChange({
              ...filter,
              landcover: e.target.value === 'all' ? 'all' : Number(e.target.value),
            })
          }
          className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Landcover Types</option>
          <option value={50}>Built-up / Urban / Industrial (50)</option>
          <option value={40}>Cropland / Agriculture (40)</option>
          <option value={10}>Tree Cover / Forest (10)</option>
          <option value={20}>Shrubland (20)</option>
          <option value={30}>Grassland (30)</option>
        </select>
      </div>

      {/* Satellite Platform */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-400">Satellite Sensor</label>
        <select
          value={filter.satellite}
          onChange={(e) => onChange({ ...filter, satellite: e.target.value })}
          className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Satellites</option>
          <option value="SNPP">Suomi-NPP (VIIRS SV-C2)</option>
          <option value="NOAA-20">NOAA-20 (VIIRS J1V-C2)</option>
          <option value="NOAA-21">NOAA-21 (VIIRS J2V-C2 NRT)</option>
        </select>
      </div>
    </div>
  );
};
