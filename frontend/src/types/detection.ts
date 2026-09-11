export type ClassificationType = 'vegetation_fire' | 'industrial_persistent';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'informational';

export interface Detection {
  id: string;
  latitude: number;
  longitude: number;
  acq_datetime: string;
  frp: number;
  brightness: number;
  bright_t31: number | null;
  scan: number;
  track: number;
  confidence: string; // 'l' | 'n' | 'h' or percentage string
  daynight: 'D' | 'N';
  satellite: string; // 'SNPP' | 'NOAA-20' | 'NOAA-21'
  detection_count: number;
  distinct_days: number;
  active_span_days: number;
  first_seen?: string;
  last_seen?: string;
  landcover: number | null; // 10=Tree, 20=Shrubland, 30=Grassland, 40=Cropland, 50=Built-up, 60=Bare, 80=Water
  osm_industrial_dist_km: number | null;
  osm_inside_industrial: number; // 0 or 1
  predicted_label: ClassificationType;
  prediction_confidence: number; // 0.0 to 1.0
  review_status?: 'unreviewed' | 'reviewed' | 'escalated';
  notes?: string;
}

export interface ThermalFeatures {
  brightness: number;
  frp: number;
  bright_t31: number | null;
}

export interface PersistenceFeatures {
  detection_count: number;
  distinct_days: number;
  active_span_days: number;
  first_seen?: string;
  last_seen?: string;
}

export interface GeospatialFeatures {
  landcover: number | null;
  landcover_label: string;
  osm_industrial_dist_km: number | null;
  osm_inside_industrial: boolean;
}

export interface Alert {
  id: string;
  detection_id: string;
  location: {
    lat: number;
    lon: number;
    region?: string;
  };
  timestamp: string;
  classification: ClassificationType;
  confidence: number;
  frp: number;
  severity: AlertSeverity;
  reason: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface ModelMetrics {
  name: string;
  type: 'deep_learning' | 'ensemble' | 'gradient_boosting';
  status: 'evaluated' | 'pending';
  accuracy: number | null;
  roc_auc: number | null;
  precision: {
    vegetation_fire: number | null;
    industrial_persistent: number | null;
  };
  recall: {
    vegetation_fire: number | null;
    industrial_persistent: number | null;
  };
  f1_score: {
    vegetation_fire: number | null;
    industrial_persistent: number | null;
  };
  feature_importances?: { feature: string; importance: number }[];
  evaluation_message?: string;
}

export interface AnalyticsSummary {
  total_detections: number;
  industrial_persistent_count: number;
  vegetation_fire_count: number;
  high_confidence_alerts: number;
  avg_frp_industrial: number;
  avg_frp_vegetation: number;
  avg_persistence_days_industrial: number;
  avg_persistence_days_vegetation: number;
  landcover_breakdown: { name: string; code: number; count: number; industrial_pct: number }[];
  satellite_breakdown: { satellite: string; count: number }[];
  confidence_histogram: { range: string; vegetation: number; industrial: number }[];
  temporal_trend: { date: string; vegetation: number; industrial: number }[];
}

export interface FilterState {
  classification: 'all' | ClassificationType;
  minConfidence: number;
  minFRP: number;
  maxFRP: number;
  timeRange: 'all' | '24h' | '7d' | '30d';
  landcover: number | 'all';
  industrialProximity: 'all' | 'inside' | 'lt1km' | 'lt5km' | 'gt5km';
  satellite: 'all' | string;
  searchQuery: string;
}
