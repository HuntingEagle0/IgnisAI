import React from 'react';
import { ModelMetrics } from '../types/detection';
import {
  Cpu,
  Layers,
  Activity,
  Workflow,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  AlertCircle,
  Database,
  Flame,
  Calendar,
  Compass,
  Satellite,
} from 'lucide-react';

interface ModelInsightsPageProps {
  metrics: ModelMetrics[];
}

export const ModelInsightsPage: React.FC<ModelInsightsPageProps> = ({ metrics }) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="border-b border-ignis-border pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            MACHINE LEARNING PIPELINE ARCHITECTURE
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          AI Model Intelligence & Multi-Source Fusion
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Comprehensive breakdown of feature engineering, PyTorch deep neural architecture, and inference workflow
        </p>
      </div>

      {/* 1. End-to-End Visual Pipeline Flow */}
      <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <Workflow className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
            End-to-End Pipeline Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center font-mono">
          {/* Step 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 relative group hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">Step 01</span>
            <Database className="h-6 w-6 text-slate-300 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-100 font-sans">Raw Detections</h3>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              NASA FIRMS VIIRS (Archive + NRT) + FSI Alerts
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 relative group hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">Step 02</span>
            <Compass className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-100 font-sans">Geospatial Fusion</h3>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              ESA WorldCover 10m raster + OSM Industrial distance
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 relative group hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">Step 03</span>
            <Calendar className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-100 font-sans">Persistence Engine</h3>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              ~1 km grid cell aggregation: distinct days & active span
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 relative group hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">Step 04</span>
            <Layers className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-slate-100 font-sans">Preprocessing</h3>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Median Imputer, StandardScaler, OneHotEncoder
            </p>
          </div>

          {/* Step 5 */}
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 relative group hover:border-red-500/50 transition-colors">
            <span className="text-[10px] text-red-400 uppercase font-bold block mb-1">Step 05</span>
            <Cpu className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-red-300 font-sans">PyTorch MLP</h3>
            <p className="text-[11px] text-slate-300 mt-1 font-sans">
              Industrial Persistent vs Vegetation Fire
            </p>
          </div>
        </div>
      </div>

      {/* 2. Actual Feature Signal Groups (from Notebook) */}
      <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-6 backdrop-blur-md shadow-xl">
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>Engineered Feature Signals (Exact Notebook Schema)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Thermal Signals */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400">
              <Flame className="h-4 w-4" />
              <span>Thermal Signals</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• <strong className="text-slate-100">brightness:</strong> VIIRS I-4 (375m) K</li>
              <li>• <strong className="text-slate-100">frp:</strong> Fire Radiative Power (MW)</li>
              <li>• <strong className="text-slate-100">bright_t31:</strong> I-5 Thermal (375m) K</li>
              <li>• <strong className="text-slate-100">scan & track:</strong> Pixel geometry</li>
            </ul>
          </div>

          {/* Persistence Signals */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <Calendar className="h-4 w-4" />
              <span>Persistence Signals</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• <strong className="text-slate-100">distinct_days:</strong> Unique dates active</li>
              <li>• <strong className="text-slate-100">detection_count:</strong> Cumulative hits</li>
              <li>• <strong className="text-slate-100">active_span_days:</strong> Temporal range</li>
              <li>• <strong className="text-slate-100">grid_cell:</strong> ~1 km bin (0.01°)</li>
            </ul>
          </div>

          {/* Geographic Signals */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <Compass className="h-4 w-4" />
              <span>Geographic Signals</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• <strong className="text-slate-100">landcover:</strong> ESA WorldCover code</li>
              <li>• <strong className="text-slate-100">osm_dist_km:</strong> Distance to plant/kiln</li>
              <li>• <strong className="text-slate-100">osm_inside:</strong> Polygon interior flag</li>
            </ul>
          </div>

          {/* Context Signals */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
              <Satellite className="h-4 w-4" />
              <span>Observation Context</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• <strong className="text-slate-100">confidence:</strong> FIRMS l / n / h</li>
              <li>• <strong className="text-slate-100">daynight:</strong> Day (D) vs Night (N)</li>
              <li>• <strong className="text-slate-100">satellite:</strong> SNPP / NOAA-20 / 21</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. PyTorch Deep Learning Architecture Detail */}
      <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span>Deep Neural Network Architecture: FireMLP (PyTorch)</span>
          </div>
          <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-cyan-500/20">
            Core DL Model
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 text-xs text-slate-300 font-sans">
            <p className="leading-relaxed">
              The neural classifier uses a custom feedforward architecture designed to capture non-linear interactions between multi-scale persistence counts and continuous spatial proximities.
            </p>

            <div className="rounded-lg bg-slate-950/80 p-4 border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="text-cyan-400 font-bold">// PyTorch FireMLP Topology</div>
              <div>Input Layer: [Fused Features: 11 Numerical + One-Hot Categorical]</div>
              <div className="text-slate-400">↳ Linear(in_dim, 128) → BatchNorm1d(128) → ReLU() → Dropout(0.3)</div>
              <div className="text-slate-400">↳ Linear(128, 64) → BatchNorm1d(64) → ReLU() → Dropout(0.3)</div>
              <div className="text-slate-400">↳ Linear(64, 32) → BatchNorm1d(32) → ReLU() → Dropout(0.3)</div>
              <div className="text-slate-200">↳ Linear(32, 2) → Softmax Logits</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded bg-slate-900/60 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Loss Function</span>
                <span className="text-slate-100 font-bold">Weighted CrossEntropyLoss</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Compensates for minority industrial static class</p>
              </div>
              <div className="rounded bg-slate-900/60 p-3 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Optimizer & Schedule</span>
                <span className="text-slate-100 font-bold">Adam (lr=1e-3) + ReduceLROnPlateau</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Factor 0.5 with patience=3 epochs</p>
              </div>
            </div>
          </div>

          {/* Model Artifacts Registry */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold border-b border-slate-800 pb-2">
              <FileCode className="h-4 w-4 text-cyan-400" />
              <span>Saved Model Artifacts</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">preprocessor.joblib</span>
                <span className="text-emerald-400 text-[10px]">Pipeline</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">label_encoder.joblib</span>
                <span className="text-emerald-400 text-[10px]">Encoder</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">fire_mlp.pt</span>
                <span className="text-red-400 text-[10px]">PyTorch Weights</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">random_forest.joblib</span>
                <span className="text-cyan-400 text-[10px]">Baseline</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300">xgboost_model.json</span>
                <span className="text-cyan-400 text-[10px]">Baseline</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Model Comparison & Strictly Accurate Metrics Display */}
      <div className="rounded-xl border border-ignis-border bg-[#0d1524]/80 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Model Comparison & Validation Status</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Stratified 80/20 Split</span>
        </div>

        {/* Strictly Accurate Rule: Notice when metrics are pending */}
        <div className="mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3.5 flex items-start gap-3 text-xs text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
          <div className="space-y-0.5">
            <span className="font-bold font-mono">SCIENTIFIC ACCURACY NOTICE:</span>
            <p className="text-[11px] text-amber-200/90 font-sans">
              In accordance with hackathon standards, evaluation metrics (Accuracy, ROC-AUC, F1-Score) are not fabricated. Evaluation results populate dynamically once the user executes the model training cell or connects the live FastAPI backend on their dataset.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#080c14] text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Model Candidate</th>
                <th className="py-3 px-4">Architecture Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">ROC-AUC</th>
                <th className="py-3 px-4">Class Weights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {metrics.map((m) => (
                <tr key={m.name} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-100">{m.name}</td>
                  <td className="py-3 px-4 text-slate-400 capitalize">{m.type.replace('_', ' ')}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                      {m.status === 'evaluated' ? 'Evaluated' : 'Pending Evaluation'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 italic">
                    {m.accuracy !== null ? `${(m.accuracy * 100).toFixed(2)}%` : 'Evaluation metrics available after model evaluation.'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 italic">
                    {m.roc_auc !== null ? m.roc_auc.toFixed(4) : 'Available after evaluation.'}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {m.name.includes('MLP') ? 'Weighted CE' : m.name.includes('Forest') ? 'Balanced' : 'Scale Pos Weight'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
