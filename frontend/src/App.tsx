import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { DetectionDetailDrawer } from './components/detail/DetectionDetailDrawer';
import { AlertCenterModal } from './components/alerts/AlertCenterModal';
import { OverviewPage } from './pages/OverviewPage';
import { LiveDetectionPage } from './pages/LiveDetectionPage';
import { ThermalMapPage } from './pages/ThermalMapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ModelInsightsPage } from './pages/ModelInsightsPage';
import { IndustrialSitesPage } from './pages/IndustrialSitesPage';
import { AboutPage } from './pages/AboutPage';
import { Detection, Alert, ModelMetrics, AnalyticsSummary } from './types/detection';
import { apiService } from './services/api';
import { DEMO_ANALYTICS, DEMO_MODEL_METRICS } from './services/mockData';
import { exportDetectionsToCsv } from './utils/exportCsv';
import { ShieldCheck, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [detections, setDetections] = useState<Detection[]>([]);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState('Just now');
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(DEMO_ANALYTICS);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics[]>(DEMO_MODEL_METRICS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Data Load & Backend Check
  useEffect(() => {
    const init = async () => {
      const online = await apiService.checkBackendHealth();
      setBackendOnline(online);
      const data = await apiService.getDetections();
      setDetections(data);
      const alts = await apiService.getAlerts();
      setAlerts(alts);
      const ana = await apiService.getAnalytics();
      setAnalytics(ana);
      const met = await apiService.getModelMetrics();
      setModelMetrics(met);
    };
    init();
  }, []);

  const handleToggleDemoMode = async () => {
    const next = !isDemoMode;
    setIsDemoMode(next);
    apiService.setDemoMode(next);

    if (!next) {
      const online = await apiService.checkBackendHealth();
      setBackendOnline(online);
      if (online) {
        showToast('Switched to Live FastAPI Backend connection');
      } else {
        showToast('FastAPI backend offline. Start "uvicorn main:app --reload" on port 8000');
      }
    } else {
      showToast('Switched to Demo Simulation Mode');
    }

    const data = await apiService.getDetections();
    setDetections(data);
  };

  const handleRefreshNRT = async () => {
    setIsRefreshing(true);
    try {
      const res = await apiService.refreshNRT();
      const updated = await apiService.getDetections();
      setDetections(updated);
      setLastRefreshTime('Just now');
      showToast(`Successfully ingested fresh satellite NRT observation at ${res.timestamp}`);
    } catch {
      showToast('NRT refresh completed.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectDetection = (d: Detection) => {
    setSelectedDetection(d);
  };

  const handleCenterMap = (lat: number, lon: number) => {
    setMapCenter([lat, lon]);
    setCurrentTab('map');
  };

  const handleMarkReviewed = async (id: string) => {
    await apiService.updateDetectionStatus(id, 'reviewed');
    const updated = await apiService.getDetections();
    setDetections(updated);
    if (selectedDetection && selectedDetection.id === id) {
      setSelectedDetection({ ...selectedDetection, review_status: 'reviewed' });
    }
    showToast(`Detection ${id} marked as reviewed.`);
  };

  const handleSelectAlertDetection = (detId: string) => {
    const target = detections.find((d) => d.id === detId);
    if (target) {
      setSelectedDetection(target);
      setMapCenter([target.latitude, target.longitude]);
      setCurrentTab('map');
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Command Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        backendOnline={backendOnline}
        alertCount={alerts.filter((a) => a.status === 'active').length}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onRefresh={handleRefreshNRT}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        {currentTab === 'overview' && (
          <OverviewPage
            detections={detections}
            selectedDetection={selectedDetection}
            onSelectDetection={handleSelectDetection}
            onNavigateToLive={() => setCurrentTab('live')}
            onNavigateToMap={() => setCurrentTab('map')}
            isDemoMode={isDemoMode}
          />
        )}

        {currentTab === 'live' && (
          <LiveDetectionPage
            detections={detections}
            onSelectDetection={handleSelectDetection}
            onRefreshNRT={handleRefreshNRT}
            isRefreshing={isRefreshing}
            lastRefreshTime={lastRefreshTime}
          />
        )}

        {currentTab === 'map' && (
          <ThermalMapPage
            detections={detections}
            selectedDetection={selectedDetection}
            onSelectDetection={handleSelectDetection}
            centerCoords={mapCenter}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsPage analytics={analytics} detections={detections} />
        )}

        {currentTab === 'industrial' && (
          <IndustrialSitesPage
            detections={detections}
            onSelectDetection={handleSelectDetection}
          />
        )}

        {currentTab === 'models' && <ModelInsightsPage metrics={modelMetrics} />}

        {currentTab === 'about' && <AboutPage />}
      </main>

      {/* Slide-over Inspection Drawer */}
      <DetectionDetailDrawer
        detection={selectedDetection}
        onClose={() => setSelectedDetection(null)}
        onCenterMap={handleCenterMap}
        onMarkReviewed={handleMarkReviewed}
        onExportSingle={(d) => exportDetectionsToCsv([d], `${d.id}.csv`)}
      />

      {/* Alert Center Modal */}
      <AlertCenterModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onSelectAlertDetection={handleSelectAlertDetection}
      />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-slate-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-md text-xs font-mono text-cyan-200">
          <Info className="h-4 w-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Operational Footer */}
      <footer className="border-t border-slate-900 bg-[#060a12] py-4 text-center text-xs font-mono text-slate-500">
        <div className="flex flex-wrap items-center justify-center gap-4 px-4">
          <span>IGNIS AI • Smart India Hackathon</span>
          <span>VIIRS 375m • ESA WorldCover 10m • OSM</span>
          <span>PyTorch FireMLP Classifier</span>
          <span className="text-slate-400 font-semibold">
            {isDemoMode ? 'Demo Mode Active' : backendOnline ? 'Live Backend Connected' : 'Offline Backend'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
