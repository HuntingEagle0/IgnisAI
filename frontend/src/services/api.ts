import {
  Detection,
  Alert,
  ModelMetrics,
  AnalyticsSummary,
  FilterState,
} from '../types/detection';
import {
  DEMO_DETECTIONS,
  DEMO_ALERTS,
  DEMO_MODEL_METRICS,
  DEMO_ANALYTICS,
} from './mockData';

const API_BASE_URL = 'http://localhost:8000/api';

// In-memory local state for reviewed items & fresh simulated detections
let localDetections: Detection[] = [...DEMO_DETECTIONS];
let localAlerts: Alert[] = [...DEMO_ALERTS];

export class IgnisApiService {
  private isDemoMode: boolean = true;
  private backendAvailable: boolean = false;

  constructor() {
    this.checkBackendHealth();
  }

  public async checkBackendHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        this.backendAvailable = true;
        return true;
      }
    } catch {
      this.backendAvailable = false;
    }
    return false;
  }

  public setDemoMode(demo: boolean) {
    this.isDemoMode = demo;
  }

  public getIsDemoMode(): boolean {
    return this.isDemoMode;
  }

  public getBackendAvailable(): boolean {
    return this.backendAvailable;
  }

  public async getDetections(filter?: Partial<FilterState>): Promise<Detection[]> {
    if (!this.isDemoMode && this.backendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/detections`);
        if (res.ok) {
          const data = await res.json();
          return this.applyClientFilter(data, filter);
        }
      } catch (err) {
        console.warn('Backend fetch failed, falling back to local demo dataset:', err);
      }
    }
    return this.applyClientFilter(localDetections, filter);
  }

  public async getDetectionById(id: string): Promise<Detection | null> {
    if (!this.isDemoMode && this.backendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/detections/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend fetch failed for id, falling back to local:', err);
      }
    }
    const found = localDetections.find((d) => d.id === id);
    return found || null;
  }

  public async getAlerts(): Promise<Alert[]> {
    if (!this.isDemoMode && this.backendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/alerts`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend alerts fetch failed:', err);
      }
    }
    return localAlerts;
  }

  public async getAnalytics(): Promise<AnalyticsSummary> {
    if (!this.isDemoMode && this.backendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/analytics`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend analytics fetch failed:', err);
      }
    }
    return DEMO_ANALYTICS;
  }

  public async getModelMetrics(): Promise<ModelMetrics[]> {
    if (!this.isDemoMode && this.backendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/model/metrics`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend metrics fetch failed:', err);
      }
    }
    return DEMO_MODEL_METRICS;
  }

  public async refreshNRT(): Promise<{ count: number; timestamp: string }> {
    if (!this.isDemoMode && this.backendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/nrt/refresh`, {
          method: 'POST',
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend NRT refresh failed:', err);
      }
    }

    // Simulate NRT arrival with fresh observation matching notebook schema
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
    const newDet: Detection = {
      id: `IGNIS-NRT-${Date.now().toString().slice(-4)}`,
      latitude: 27.25 + (Math.random() - 0.5) * 0.8,
      longitude: 75.8 + (Math.random() - 0.5) * 0.8,
      acq_datetime: formatted,
      frp: Number((15 + Math.random() * 45).toFixed(1)),
      brightness: Number((320 + Math.random() * 40).toFixed(1)),
      bright_t31: Number((292 + Math.random() * 10).toFixed(1)),
      scan: 0.42,
      track: 0.38,
      confidence: 'high',
      daynight: now.getHours() >= 6 && now.getHours() <= 18 ? 'D' : 'N',
      satellite: 'NOAA-21',
      detection_count: Math.floor(Math.random() * 18) + 1,
      distinct_days: Math.floor(Math.random() * 12) + 1,
      active_span_days: 28,
      landcover: Math.random() > 0.4 ? 50 : 40,
      osm_industrial_dist_km: Math.random() > 0.5 ? 0.0 : Number((Math.random() * 4).toFixed(2)),
      osm_inside_industrial: Math.random() > 0.5 ? 1 : 0,
      predicted_label: Math.random() > 0.4 ? 'industrial_persistent' : 'vegetation_fire',
      prediction_confidence: Number((0.91 + Math.random() * 0.08).toFixed(3)),
      review_status: 'unreviewed',
    };

    localDetections = [newDet, ...localDetections];
    return { count: 1, timestamp: formatted };
  }

  public async updateDetectionStatus(
    id: string,
    status: 'reviewed' | 'unreviewed' | 'escalated',
    notes?: string
  ): Promise<boolean> {
    const idx = localDetections.findIndex((d) => d.id === id);
    if (idx !== -1) {
      localDetections[idx] = {
        ...localDetections[idx],
        review_status: status,
        notes: notes ?? localDetections[idx].notes,
      };
      return true;
    }
    return false;
  }

  private applyClientFilter(
    data: Detection[],
    filter?: Partial<FilterState>
  ): Detection[] {
    if (!filter) return data;
    return data.filter((d) => {
      if (filter.classification && filter.classification !== 'all') {
        if (d.predicted_label !== filter.classification) return false;
      }
      if (filter.minConfidence !== undefined) {
        if (d.prediction_confidence * 100 < filter.minConfidence) return false;
      }
      if (filter.minFRP !== undefined) {
        if (d.frp < filter.minFRP) return false;
      }
      if (filter.maxFRP !== undefined) {
        if (d.frp > filter.maxFRP) return false;
      }
      if (filter.landcover !== undefined && filter.landcover !== 'all') {
        if (d.landcover !== filter.landcover) return false;
      }
      if (filter.industrialProximity && filter.industrialProximity !== 'all') {
        if (filter.industrialProximity === 'inside' && d.osm_inside_industrial !== 1) return false;
        if (filter.industrialProximity === 'lt1km' && (d.osm_industrial_dist_km === null || d.osm_industrial_dist_km >= 1.0)) return false;
        if (filter.industrialProximity === 'lt5km' && (d.osm_industrial_dist_km === null || d.osm_industrial_dist_km >= 5.0)) return false;
        if (filter.industrialProximity === 'gt5km' && (d.osm_industrial_dist_km === null || d.osm_industrial_dist_km <= 5.0)) return false;
      }
      if (filter.satellite && filter.satellite !== 'all') {
        if (!d.satellite.toLowerCase().includes(filter.satellite.toLowerCase())) return false;
      }
      if (filter.searchQuery && filter.searchQuery.trim() !== '') {
        const q = filter.searchQuery.toLowerCase();
        const matchesId = d.id.toLowerCase().includes(q);
        const matchesLabel = d.predicted_label.toLowerCase().includes(q);
        const matchesCoord = `${d.latitude},${d.longitude}`.includes(q);
        const matchesNotes = d.notes?.toLowerCase().includes(q) ?? false;
        if (!matchesId && !matchesLabel && !matchesCoord && !matchesNotes) return false;
      }
      return true;
    });
  }
}

export const apiService = new IgnisApiService();
