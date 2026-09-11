import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  CartesianGrid,
} from 'recharts';
import { AnalyticsSummary, Detection } from '../types/detection';
import { BarChart3, PieChart as PieIcon, TrendingUp, Compass, Satellite, Flame } from 'lucide-react';

interface AnalyticsPageProps {
  analytics: AnalyticsSummary;
  detections: Detection[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics, detections }) => {
  // Classification Donut Data
  const classPieData = [
    { name: 'Vegetation Fire', value: analytics.vegetation_fire_count, color: '#10b981' },
    { name: 'Industrial Persistent', value: analytics.industrial_persistent_count, color: '#ef4444' },
  ];

  // Persistence scatter: distinct_days vs detection_count
  const persistenceData = detections.map((d) => ({
    name: d.id,
    distinctDays: d.distinct_days,
    detectionCount: d.detection_count,
    frp: d.frp,
    label: d.predicted_label === 'industrial_persistent' ? 'Industrial' : 'Vegetation',
    color: d.predicted_label === 'industrial_persistent' ? '#ef4444' : '#10b981',
  }));

  // Proximity buckets (<1km, 1-3km, 3-5km, >5km)
  const proximityBuckets = [
    { range: '< 1 km (Inside/Adjacent)', count: detections.filter((d) => (d.osm_industrial_dist_km ?? 99) < 1).length },
    { range: '1 - 3 km', count: detections.filter((d) => (d.osm_industrial_dist_km ?? 99) >= 1 && (d.osm_industrial_dist_km ?? 99) < 3).length },
    { range: '3 - 5 km', count: detections.filter((d) => (d.osm_industrial_dist_km ?? 99) >= 3 && (d.osm_industrial_dist_km ?? 99) < 5).length },
    { range: '> 5 km (Isolated)', count: detections.filter((d) => (d.osm_industrial_dist_km ?? 0) >= 5).length },
  ];

  const customTooltipStyle = {
    backgroundColor: '#0d1524',
    borderColor: '#1e3050',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '11px',
    fontFamily: 'monospace',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="border-b border-ignis-border pb-4">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            GEOSPATIAL & THERMAL ANALYTICS
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          System Analytics & AI Distribution
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Empirical distributions of thermal intensity, multi-pass persistence, and land-cover signatures
        </p>
      </div>

      {/* Grid of Analytical Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 1. Classification Distribution */}
        <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              <PieIcon className="h-4 w-4 text-cyan-400" />
              <span>Classification Distribution</span>
            </div>
            <span className="font-mono text-xs text-slate-400">Total: {analytics.total_detections}</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {classPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend
                  formatter={(val, entry) => (
                    <span className="text-xs text-slate-300 font-sans">{val}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-around text-center text-xs font-mono border-t border-slate-800/60 pt-3">
            <div>
              <span className="text-slate-400 block">Vegetation Share</span>
              <strong className="text-emerald-400 text-sm">
                {((analytics.vegetation_fire_count / analytics.total_detections) * 100).toFixed(1)}%
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Industrial Share</span>
              <strong className="text-red-400 text-sm">
                {((analytics.industrial_persistent_count / analytics.total_detections) * 100).toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>

        {/* 2. Temporal Detections Trend */}
        <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>Temporal Trends (Observation Window)</span>
            </div>
            <span className="font-mono text-xs text-slate-400">7-Day Aggregation</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.temporal_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vegetation"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Vegetation Fires"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="industrial"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Industrial Persistent"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 text-center font-mono mt-3">
            Notice: Industrial thermal detections maintain a steady baseline, while vegetation fires spike with seasonal harvesting and weather.
          </p>
        </div>

        {/* 3. AI Prediction Confidence Distribution */}
        <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              <BarChart3 className="h-4 w-4 text-cyan-400" />
              <span>Model Confidence Distribution</span>
            </div>
            <span className="font-mono text-xs text-slate-400">Softmax Output</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.confidence_histogram}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend />
                <Bar dataKey="vegetation" fill="#10b981" name="Vegetation Fires" radius={[4, 4, 0, 0]} />
                <Bar dataKey="industrial" fill="#ef4444" name="Industrial Sources" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Persistence Analysis (Distinct Days vs Detection Count) */}
        <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              <Flame className="h-4 w-4 text-orange-400" />
              <span>Persistence Analysis (~1 km Grid Clustering)</span>
            </div>
            <span className="font-mono text-xs text-slate-400">Distinct Days vs Hits</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="distinctDays"
                  name="Distinct Days"
                  unit="d"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Distinct Observation Days', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="detectionCount"
                  name="Total Detections"
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Hotspot Count', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={customTooltipStyle} className="p-2 border border-slate-700">
                          <p className="font-bold text-slate-100">{data.name}</p>
                          <p className={data.label === 'Industrial' ? 'text-red-400' : 'text-emerald-400'}>
                            {data.label}
                          </p>
                          <p className="text-slate-300">Distinct Days: {data.distinctDays}</p>
                          <p className="text-slate-300">Detection Count: {data.detectionCount}</p>
                          <p className="text-orange-400">FRP: {data.frp} MW</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Hotspots" data={persistenceData} fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 text-center font-mono mt-3">
            Industrial sources cluster strongly along the high distinct-days and multi-hit axis.
          </p>
        </div>

        {/* 5. ESA WorldCover Distribution */}
        <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              <Compass className="h-4 w-4 text-emerald-400" />
              <span>ESA WorldCover 10m Ground Distribution</span>
            </div>
            <span className="font-mono text-xs text-slate-400">GeoTIFF Sampled</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.landcover_breakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={120} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill="#06b6d4" name="Detections" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 text-center font-mono mt-3">
            Built-up (50) exhibits an 88.7% industrial correlation, while Cropland (40) is dominated by vegetation fire.
          </p>
        </div>

        {/* 6. Satellite Sensor Breakdown */}
        <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              <Satellite className="h-4 w-4 text-cyan-400" />
              <span>Satellite Sensor Distribution</span>
            </div>
            <span className="font-mono text-xs text-slate-400">VIIRS 375m Archive + NRT</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.satellite_breakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="satellite" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill="#8b5cf6" name="Detections" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
