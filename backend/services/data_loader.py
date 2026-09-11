import json
import os
from typing import List, Dict, Any, Optional

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "detections.json")

# In-memory storage seeded from initial dataset
_DETECTIONS_STORE: List[Dict[str, Any]] = [
    {
        "id": "IGNIS-DET-2024-001",
        "latitude": 27.1824,
        "longitude": 75.8341,
        "acq_datetime": "2024-05-18 13:42:00",
        "frp": 38.6,
        "brightness": 346.2,
        "bright_t31": 298.4,
        "scan": 0.42,
        "track": 0.38,
        "confidence": "nominal",
        "daynight": "D",
        "satellite": "SNPP",
        "detection_count": 24,
        "distinct_days": 14,
        "active_span_days": 42,
        "first_seen": "2024-04-06",
        "last_seen": "2024-05-18",
        "landcover": 50,
        "osm_industrial_dist_km": 0.0,
        "osm_inside_industrial": 1,
        "predicted_label": "industrial_persistent",
        "prediction_confidence": 0.964,
        "review_status": "reviewed",
        "notes": "Confirmed brick kiln cluster in Jaipur industrial corridor"
    },
    {
        "id": "IGNIS-DET-2024-002",
        "latitude": 27.3195,
        "longitude": 75.9812,
        "acq_datetime": "2024-05-18 13:42:00",
        "frp": 52.1,
        "brightness": 358.7,
        "bright_t31": 301.2,
        "scan": 0.41,
        "track": 0.37,
        "confidence": "high",
        "daynight": "D",
        "satellite": "SNPP",
        "detection_count": 31,
        "distinct_days": 19,
        "active_span_days": 56,
        "first_seen": "2024-03-23",
        "last_seen": "2024-05-18",
        "landcover": 50,
        "osm_industrial_dist_km": 0.18,
        "osm_inside_industrial": 0,
        "predicted_label": "industrial_persistent",
        "prediction_confidence": 0.948,
        "review_status": "unreviewed",
        "notes": "Persistent high-heat source adjacent to industrial zone"
    },
    {
        "id": "IGNIS-DET-2024-003",
        "latitude": 26.8912,
        "longitude": 75.7104,
        "acq_datetime": "2024-05-18 01:25:00",
        "frp": 14.8,
        "brightness": 318.5,
        "bright_t31": 292.1,
        "scan": 0.45,
        "track": 0.40,
        "confidence": "nominal",
        "daynight": "N",
        "satellite": "NOAA-20",
        "detection_count": 1,
        "distinct_days": 1,
        "active_span_days": 1,
        "first_seen": "2024-05-18",
        "last_seen": "2024-05-18",
        "landcover": 40,
        "osm_industrial_dist_km": 7.84,
        "osm_inside_industrial": 0,
        "predicted_label": "vegetation_fire",
        "prediction_confidence": 0.932,
        "review_status": "unreviewed",
        "notes": "Transient night-time agricultural residue burn in cropland"
    },
    {
        "id": "IGNIS-DET-2024-004",
        "latitude": 27.5401,
        "longitude": 76.2208,
        "acq_datetime": "2024-05-18 01:25:00",
        "frp": 22.4,
        "brightness": 326.8,
        "bright_t31": 294.0,
        "scan": 0.39,
        "track": 0.36,
        "confidence": "high",
        "daynight": "N",
        "satellite": "NOAA-20",
        "detection_count": 2,
        "distinct_days": 2,
        "active_span_days": 2,
        "first_seen": "2024-05-17",
        "last_seen": "2024-05-18",
        "landcover": 10,
        "osm_industrial_dist_km": 12.3,
        "osm_inside_industrial": 0,
        "predicted_label": "vegetation_fire",
        "prediction_confidence": 0.957,
        "review_status": "unreviewed",
        "notes": "Open forest ground fire detected along ridge"
    },
    {
        "id": "IGNIS-DET-2024-005",
        "latitude": 27.0456,
        "longitude": 75.4891,
        "acq_datetime": "2024-05-18 12:10:00",
        "frp": 44.9,
        "brightness": 351.0,
        "bright_t31": 299.5,
        "scan": 0.40,
        "track": 0.37,
        "confidence": "high",
        "daynight": "D",
        "satellite": "NOAA-21",
        "detection_count": 18,
        "distinct_days": 11,
        "active_span_days": 35,
        "first_seen": "2024-04-13",
        "last_seen": "2024-05-18",
        "landcover": 50,
        "osm_industrial_dist_km": 0.0,
        "osm_inside_industrial": 1,
        "predicted_label": "industrial_persistent",
        "prediction_confidence": 0.971,
        "review_status": "reviewed",
        "notes": "Steel re-rolling mill furnace with steady thermal emissions"
    }
]

def get_all_detections() -> List[Dict[str, Any]]:
    return _DETECTIONS_STORE

def get_detection_by_id(det_id: str) -> Optional[Dict[str, Any]]:
    for d in _DETECTIONS_STORE:
        if d["id"] == det_id:
            return d
    return None

def update_detection_review(det_id: str, status: str, notes: Optional[str] = None) -> bool:
    for d in _DETECTIONS_STORE:
        if d["id"] == det_id:
            d["review_status"] = status
            if notes:
                d["notes"] = notes
            return True
    return False

def add_nrt_detection(new_det: Dict[str, Any]):
    _DETECTIONS_STORE.insert(0, new_det)
