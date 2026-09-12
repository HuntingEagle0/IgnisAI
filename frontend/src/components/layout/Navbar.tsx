import React from 'react';
import {
  Flame,
  Radio,
  Satellite,
  Bell,
  Database,
  Layers,
  BarChart3,
  Cpu,
  Factory,
  Info,
  RefreshCw,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'live'
  | 'map'
  | 'analytics'
  | 'models'
  | 'industrial'
  | 'about';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  backendOnline: boolean;
  alertCount: number;
  onOpenAlerts: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  isDemoMode,
  onToggleDemoMode,
  backendOnline,
  alertCount,
  onOpenAlerts,
  onRefresh,
  isRefreshing,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Radio className="w-4 h-4" /> },
    { id: 'live', label: 'Live Detection', icon: <Flame className="w-4 h-4" /> },
    { id: 'map', label: 'Thermal Map', icon: <Layers className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'industrial', label: 'Industrial Sites', icon: <Factory className="w-4 h-4" /> },
    { id: 'models', label: 'Model Insights', icon: <Cpu className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ignis-border bg-[#080c14]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-600 shadow-lg shadow-red-950/50">
            <Flame className="h-6 w-6 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-extrabold tracking-wider text-slate-100">
                IGNIS <span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center rounded-md bg-cyan-950/60 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-800/60">
                SIH-2026
              </span>
            </div>
            <p className="hidden md:block text-[11px] font-medium text-slate-400">
              Industrial Fire & Persistent Thermal Intelligence
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status & Controls */}
        <div className="flex items-center gap-3">
          {/* FIRMS Live Feed Indicator */}
          <div className="hidden sm:flex items-center gap-2 rounded-md bg-slate-900/80 px-2.5 py-1 border border-slate-800 text-xs">
            <Satellite className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-400 font-mono text-[11px]">NASA FIRMS</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {/* Mode Toggle: Demo Mode / Live Backend */}
          <button
            onClick={onToggleDemoMode}
            title="Click to toggle between Demo Mode and Live FastAPI Backend"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-colors border ${
              isDemoMode
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
                : backendOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/40 hover:bg-red-500/20'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{isDemoMode ? 'DEMO DATA' : backendOnline ? 'BACKEND LIVE' : 'BACKEND OFFLINE'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh NRT Satellite Feed"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Alert Center Trigger */}
          <button
            onClick={onOpenAlerts}
            className="relative p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Open Alert Center"
          >
            <Bell className="w-4 h-4" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Secondary Nav Strip */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/80 px-4 py-1.5 bg-[#0a0f1a] no-scrollbar">
        <div className="flex space-x-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
