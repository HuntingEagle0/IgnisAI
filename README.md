# IGNIS AI
### AI-Based Detection and Classification of Industrial Fires & Persistent Thermal Sources

[![Smart India Hackathon](https://img.shields.io/badge/SIH-2026-cyan.svg)](https://sih.gov.in)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2%2B-orange.svg)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-emerald.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 1. Executive Summary

**IGNIS AI** is an operational satellite intelligence and geospatial AI monitoring platform developed for the **Smart India Hackathon (SIH)**. The platform solves the persistent false-positive alarm challenge in satellite fire monitoring by using multi-modal AI to distinguish genuine wildland/crop-residue fires from stationary industrial emitters (refinery flares, brick kilns, steel furnaces, and power plants).

### The Operational Challenge
Conventional thermal anomaly feeds (such as NASA FIRMS) alert whenever surface temperature or Fire Radiative Power (FRP) crosses a radiometric threshold. In industrialized and peri-urban corridors, stationary industrial processes produce repeated false fire alarms, exhausting disaster response teams and skewing forestry fire statistics.

### The IGNIS AI Solution
IGNIS AI combines four distinct evidence streams:
1. **NASA FIRMS VIIRS 375 m** satellite thermal observations (Archive ground-truth + NRT stream)
2. **ESA WorldCover 10 m** high-resolution land-cover classification
3. **OpenStreetMap (OSM)** industrial infrastructure proximity analysis (Overpass API)
4. **Engineered Thermal Persistence** spatial grid clustering (~1.1 km cells)

The system passes these fused signals into a class-weighted **PyTorch Deep Neural Network (FireMLP)** and baseline ensemble classifiers (**Random Forest** and **XGBoost**) to produce automated, explainable verdicts with calibrated confidence scores.

---

## 2. Machine Learning Architecture

```text
┌─────────────────────────┐   ┌───────────────────────────┐   ┌──────────────────────────────┐
│  NASA FIRMS VIIRS 375m  │   │   ESA WorldCover 10m      │   │  OpenStreetMap (OSM)         │
│  Brightness, FRP, Scan, │   │   GeoTIFF Sampling        │   │  Industrial, Quarry, Plants, │
│  Day/Night, Sat Sensor  │   │   Built-up, Crop, Forest  │   │  Kilns Proximity (km)        │
└───────────┬─────────────┘   └─────────────┬─────────────┘   └──────────────┬───────────────┘
            │                               │                                │
            └───────────────────────┬───────┴────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   Spatial Persistence Engine  │
                    │   ~0.01° Grid Binning (~1.1km)│
                    │   • distinct_days             │
                    │   • detection_count           │
                    │   • active_span_days          │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    Preprocessing Pipeline     │
                    │  • SimpleImputer (Median/MF)  │
                    │  • StandardScaler (Numerical) │
                    │  • OneHotEncoder (Categorical)│
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │      AI Classification        │
                    │                               │
                    │  1. PyTorch FireMLP (Core DL) │
                    │     Linear(128)→BN→ReLU→Drop  │
                    │     Linear(64) →BN→ReLU→Drop  │
                    │     Linear(32) →BN→ReLU→Drop  │
                    │     Linear(2)  → Softmax      │
                    │                               │
                    │  2. Random Forest Baseline    │
                    │  3. XGBoost Baseline          │
                    └───────────────┬───────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
        ┌─────────────────────────┐   ┌─────────────────────────┐
        │  vegetation_fire        │   │  industrial_persistent  │
        │  Wildland/Crop Burning  │   │  Static High-Heat Plant │
        └─────────────────────────┘   └─────────────────────────┘
```

### Feature Schema

| Feature Group | Features | Description |
| :--- | :--- | :--- |
| **Thermal Radiative** | `brightness`, `frp`, `bright_t31`, `scan`, `track` | VIIRS I-4 brightness temp (K), Fire Radiative Power (MW), I-5 channel, and pixel geometry |
| **Spatial Persistence** | `distinct_days`, `detection_count`, `active_span_days` | Number of distinct calendar dates active, cumulative hit frequency, and time span in ~1.1 km cell |
| **Geospatial & Land** | `landcover`, `osm_industrial_dist_km`, `osm_inside_industrial` | ESA WorldCover 10m code (50=Built-up, 40=Crop, 10=Forest), distance in km to nearest plant/kiln, inside-polygon flag |
| **Observation Context** | `confidence`, `daynight`, `satellite` | FIRMS sensor confidence flag, Day (D) vs Night (N) overpass, satellite platform (SNPP / NOAA-20 / NOAA-21) |

### Saved Artifacts (as trained in notebook)
* `preprocessor.joblib`: Scikit-Learn `ColumnTransformer` (Imputer + Scaler + OneHotEncoder)
* `label_encoder.joblib`: Target mapping (`vegetation_fire` = 0, `industrial_persistent` = 1)
* `fire_mlp.pt`: PyTorch state dictionary for the 4-layer MLP
* `random_forest.joblib`: Random Forest baseline model (400 estimators, balanced weights)
* `xgboost_model.json`: XGBoost baseline model (`scale_pos_weight` tuned for class imbalance)
* `nrt_classified.csv`: Classified NRT detection stream output

---

## 3. Technology Stack

* **Frontend**:
  * **Framework**: React 19 with TypeScript
  * **Build Tool**: Vite 8
  * **Styling**: Tailwind CSS with dark command-center theme
  * **Geospatial Map**: Leaflet with custom CartoDB Dark Matter, Esri World Imagery Satellite, and OSM layers
  * **Data Visualization**: Recharts (Pie/Donut, Temporal Line, Scatter Persistence, and Bar distributions)
  * **Icons**: Lucide React
* **Backend**:
  * **API Framework**: FastAPI with Pydantic v2 schemas
  * **Server**: Uvicorn ASGI
  * **ML Runtime**: PyTorch, Scikit-Learn, Pandas, NumPy, Joblib
* **Data Ingestion**:
  * NASA FIRMS VIIRS (Archive + NRT CSVs)
  * ESA WorldCover 10 m GeoTIFF
  * OpenStreetMap Overpass (via OSMnx/GeoPandas)
  * Forest Survey of India (FSI) fire alerts (`.dbf`)

---

## 4. Application Pages & Features

1. **Overview Dashboard**:
   * Operational KPI metrics (Total Hotspots, Industrial Sources, Vegetation Fires, High Confidence Alerts, Monitored Bounding Area)
   * Live interactive Leaflet thermal intelligence map
   * Recent hotspot stream table with instant classification tags

2. **Live Detection Page**:
   * Near-Real-Time (NRT) satellite observation feed
   * Dynamic filters by classification, minimum AI confidence, sensor platform, and query text
   * "Refresh NRT Feed" button to simulate incoming VIIRS satellite passes
   * CSV Export matching the training pipeline schema

3. **Thermal Map Page**:
   * Full-screen geospatial intelligence interface
   * Floating multi-variable filter drawer (Confidence, FRP slider, WorldCover class, Industrial proximity)
   * Tile layer toggle: Dark Tactical, Satellite Imagery, Street Map
   * Dynamic bottom intel bar showing live filtered anomaly counts

4. **Analytics Page**:
   * Classification share donut chart
   * 7-day temporal trend line comparing stationary industrial baselines vs seasonal fire surges
   * Confidence histogram (softmax probabilities)
   * Persistence scatter analysis (Distinct days vs total hits)
   * ESA WorldCover ground distribution bar chart

5. **Model Insights Page**:
   * Visual end-to-end pipeline diagram
   * Exact feature group breakdown matching the notebook
   * Deep learning architecture specifications (PyTorch FireMLP)
   * Model comparison table with scientific integrity disclaimers (no fabricated metrics)

6. **Industrial Site Intelligence**:
   * Surveillance of stationary high-heat industrial emitters, brick kilns, and refinery flares
   * Persistence ranking table sorted by cumulative distinct observation days
   * Historical thermal activity timeline (First Seen → Repeated Observations → Active Span → Latest Detection)

7. **Detection Detail Drawer**:
   * 10-second SIH presentation verdict card
   * Calibrated confidence meter
   * Corroborating evidence bullet generator driven dynamically by actual feature values
   * Action buttons: Locate on Map, Mark as Reviewed, Export Dossier

8. **Alert Command Center**:
   * Operational triage modal categorized by Critical, High, Medium, and Informational severities

---

## 5. Quickstart & Installation

### Prerequisites
* **Node.js**: v18+ (Tested on v24)
* **npm**: v9+ (Tested on v11)
* **Python**: 3.10+ (Tested on 3.13)

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
The dashboard will start on `http://localhost:5173`.

### Running the FastAPI Backend (Optional)
The frontend works out-of-the-box in **Demo Mode** with realistic satellite observations. To connect the live FastAPI server:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Then click the **"DEMO DATA"** button in the top navigation bar to toggle to **"BACKEND LIVE"**.

---

## 6. Scientific Accuracy & Integrity Disclosures

In strict accordance with academic and hackathon evaluation standards:
* **Tabular VIIRS Radiance**: The system processes NASA FIRMS 375m tabular detections, not direct computer vision on raw satellite imagery.
* **No Fabricated Metrics**: Evaluation scores (Accuracy, ROC-AUC, F1) are displayed as pending until the user runs model training on their specific dataset split.
* **Corroborating Evidence**: Explanations in the AI Decision Dossier are synthesized purely from available feature values (`distinct_days`, `osm_industrial_dist_km`, `landcover`, `frp`).

---

## 7. Project Structure

```text
ignis/
├── industrial_fire_detection_updated.ipynb   # Original ML pipeline notebook
├── README.md                                 # Project documentation
├── .gitignore                                # Git ignore rules
│
├── frontend/                                 # React + TypeScript + Vite Dashboard
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.tsx                           # Master dashboard container
│       ├── types/detection.ts                # TypeScript schemas
│       ├── services/
│       │   ├── api.ts                        # API abstraction & live/demo switch
│       │   ├── mockData.ts                   # Realistic satellite observations
│       │   └── evidenceEngine.ts             # Dynamic reasoning generator
│       ├── components/
│       │   ├── layout/Navbar.tsx
│       │   ├── map/ThermalMap.tsx            # Leaflet interactive map
│       │   ├── map/MapFilterBar.tsx          # Floating filter panel
│       │   ├── detail/DetectionDetailDrawer.tsx
│       │   ├── detail/EvidenceSummary.tsx    # Hackathon AI verdict card
│       │   ├── detail/ConfidenceMeter.tsx
│       │   ├── kpi/KpiCard.tsx
│       │   └── alerts/AlertCenterModal.tsx
│       ├── pages/
│       │   ├── OverviewPage.tsx
│       │   ├── LiveDetectionPage.tsx
│       │   ├── ThermalMapPage.tsx
│       │   ├── AnalyticsPage.tsx
│       │   ├── ModelInsightsPage.tsx
│       │   ├── IndustrialSitesPage.tsx
│       │   └── AboutPage.tsx
│       └── utils/
│           ├── formatters.ts
│           └── exportCsv.ts
│
└── backend/                                  # FastAPI Backend Service
    ├── main.py                               # FastAPI application & endpoints
    ├── requirements.txt
    ├── models/
    │   ├── schemas.py                        # Pydantic models
    │   └── mlp.py                            # PyTorch FireMLP class
    └── services/
        ├── data_loader.py                    # Ingestion & storage
        ├── inference.py                      # Artifact loader & predictor
        └── persistence.py                    # Grid persistence calculator
```

---

## 8. License
Developed for the **Smart India Hackathon (SIH)**. Distributed under the MIT License.
