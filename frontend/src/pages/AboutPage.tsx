import React from 'react';
import {
  Flame,
  Award,
  Satellite,
  Compass,
  Cpu,
  Database,
  CheckCircle2,
  ShieldCheck,
  Globe2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-2xl border border-ignis-border bg-gradient-to-b from-[#0d172a] to-[#080d1a] p-8 shadow-xl text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-mono font-semibold text-cyan-400 border border-cyan-500/30">
          <Award className="h-4 w-4" />
          <span>SMART INDIA HACKATHON PROJECT</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
          IGNIS <span className="text-cyan-400">AI</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          AI-Based Detection and Classification of Industrial Fires & Persistent Thermal Sources Using Multi-Modal Satellite Intelligence
        </p>
      </div>

      {/* The Core Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-red-400">
            <Flame className="h-4 w-4" />
            <span>The Operational Challenge</span>
          </div>
          <h2 className="text-base font-bold text-slate-100">
            Satellite Hotspot False Positive Alarm Fatigue
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Conventional satellite fire monitoring services (like NASA FIRMS) report raw thermal anomalies indiscriminately. In heavily industrialized corridors, stationary emitters such as refinery flares, brick kilns, steel mills, and power plants generate false fire alerts thousands of times per year, overburdening emergency response teams and forest services.
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <ShieldCheck className="h-4 w-4" />
            <span>The IGNIS AI Solution</span>
          </div>
          <h2 className="text-base font-bold text-slate-100">
            AI + Multi-Modal Geospatial Ground-Truthing
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            IGNIS AI fuses satellite thermal observations with ESA WorldCover 10m high-resolution land classification, OpenStreetMap industrial polygons, and multi-temporal thermal persistence clustering to automatically isolate stationary industrial emitters from genuine wildland, forest, and crop-residue fires.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Data Fusion */}
      <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-6 backdrop-blur-md shadow-xl space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-400" />
          <span>Multi-Modal Data Ingestion Engine</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg bg-slate-950/60 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-slate-100">
              <Satellite className="h-4 w-4 text-cyan-400" />
              <span>NASA FIRMS VIIRS (375m)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Provides raw thermal radiance (Kelvin), Fire Radiative Power (MW), day/night passes, and ground-truth historical labeling (type=0 vegetation vs type=2 other static land source).
            </p>
          </div>

          <div className="rounded-lg bg-slate-950/60 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-slate-100">
              <Globe2 className="h-4 w-4 text-emerald-400" />
              <span>ESA WorldCover 10m GeoTIFF</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Samples physical land-cover at each hotspot (built-up, cropland, forest, shrubland), providing ground context to distinguish urban factories from rural agricultural stubble burns.
            </p>
          </div>

          <div className="rounded-lg bg-slate-950/60 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-slate-100">
              <Compass className="h-4 w-4 text-orange-400" />
              <span>OpenStreetMap (OSM) Infrastructure</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Queries mapped industrial zones, power plants, kilns, and quarries via OSMnx to calculate geodesic distance and polygon containment for each detection.
            </p>
          </div>

          <div className="rounded-lg bg-slate-950/60 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-slate-100">
              <Cpu className="h-4 w-4 text-red-400" />
              <span>Thermal Persistence Algorithm (~1 km)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Bins coordinates into 0.01° cells to aggregate detection count, distinct days, and active temporal span. Industrial plants show repeated multi-week signatures; fires burn out rapidly.
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Integrity Disclosure */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-3">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          SIH Presentation & Scientific Integrity Disclosures
        </h2>
        <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>Strict alignment with actual ML notebook: Model uses FIRMS tabular detections rather than raw imagery.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>No fabricated metrics: Model evaluation accuracy is presented only when computed against real test splits.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>Dual operational mode: Seamlessly toggles between local demo simulations and live FastAPI server.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
