from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class DetectionSchema(BaseModel):
    id: str
    latitude: float
    longitude: float
    acq_datetime: str
    frp: float
    brightness: float
    bright_t31: Optional[float] = None
    scan: float
    track: float
    confidence: str
    daynight: str
    satellite: str
    detection_count: int
    distinct_days: int
    active_span_days: int
    first_seen: Optional[str] = None
    last_seen: Optional[str] = None
    landcover: Optional[int] = None
    osm_industrial_dist_km: Optional[float] = None
    osm_inside_industrial: int
    predicted_label: str = Field(..., description="vegetation_fire or industrial_persistent")
    prediction_confidence: float
    review_status: Optional[str] = "unreviewed"
    notes: Optional[str] = None

class ReviewRequest(BaseModel):
    status: str
    notes: Optional[str] = None

class AlertSchema(BaseModel):
    id: str
    detection_id: str
    location: Dict[str, Any]
    timestamp: str
    classification: str
    confidence: float
    frp: float
    severity: str
    reason: str
    status: str

class ModelMetricsSchema(BaseModel):
    name: str
    type: str
    status: str
    accuracy: Optional[float] = None
    roc_auc: Optional[float] = None
    precision: Dict[str, Optional[float]]
    recall: Dict[str, Optional[float]]
    f1_score: Dict[str, Optional[float]]
    evaluation_message: Optional[str] = None
    feature_importances: Optional[List[Dict[str, Any]]] = None

class AnalyticsSchema(BaseModel):
    total_detections: int
    industrial_persistent_count: int
    vegetation_fire_count: int
    high_confidence_alerts: int
    avg_frp_industrial: float
    avg_frp_vegetation: float
    avg_persistence_days_industrial: float
    avg_persistence_days_vegetation: float
    landcover_breakdown: List[Dict[str, Any]]
    satellite_breakdown: List[Dict[str, Any]]
    confidence_histogram: List[Dict[str, Any]]
    temporal_trend: List[Dict[str, Any]]
