import { Detection } from '../types/detection';

export const WORLDCOVER_MAP: Record<number, string> = {
  10: 'Tree Cover / Forest',
  20: 'Shrubland',
  30: 'Grassland',
  40: 'Cropland / Agriculture',
  50: 'Built-up / Industrial',
  60: 'Bare / Sparse Vegetation',
  80: 'Permanent Water Body',
};

export function getLandcoverLabel(code: number | null): string {
  if (code === null || code === undefined || isNaN(code)) {
    return 'Outside Tile Coverage (Imputed)';
  }
  return WORLDCOVER_MAP[code] || `WorldCover Code ${code}`;
}

export interface GeneratedEvidence {
  primaryVerdict: string;
  confidenceScorePercent: number;
  bullets: string[];
  narrative: string;
  persistenceSeverity: 'high' | 'moderate' | 'transient';
  proximitySeverity: 'inside' | 'near' | 'distant' | 'unknown';
  landcoverLabel: string;
}

export function generateEvidenceSummary(d: Detection): GeneratedEvidence {
  const bullets: string[] = [];
  const isIndustrial = d.predicted_label === 'industrial_persistent';
  const confidencePercent = Math.round(d.prediction_confidence * 1000) / 10;
  const landLabel = getLandcoverLabel(d.landcover);

  // 1. Persistence Evidence
  let persistSeverity: 'high' | 'moderate' | 'transient' = 'transient';
  if (d.distinct_days >= 7 || d.detection_count >= 15) {
    persistSeverity = 'high';
    bullets.push(
      `Strong persistence: ${d.detection_count} hotspot detections across ${d.distinct_days} distinct days (${d.active_span_days} days span)`
    );
  } else if (d.distinct_days >= 3) {
    persistSeverity = 'moderate';
    bullets.push(
      `Recurring thermal signature: ${d.distinct_days} distinct observation days (${d.detection_count} total hits)`
    );
  } else {
    persistSeverity = 'transient';
    bullets.push(
      `Transient signature: ${d.distinct_days} observation day (${d.detection_count} detection), typical of non-static fires`
    );
  }

  // 2. Geospatial & Proximity Evidence
  let proxSeverity: 'inside' | 'near' | 'distant' | 'unknown' = 'unknown';
  if (d.osm_inside_industrial === 1) {
    proxSeverity = 'inside';
    bullets.push('Direct spatial match: Located within OSM-mapped industrial / power / mining perimeter');
  } else if (d.osm_industrial_dist_km !== null && d.osm_industrial_dist_km < 1.0) {
    proxSeverity = 'near';
    bullets.push(`High industrial proximity: ${d.osm_industrial_dist_km.toFixed(2)} km from nearest mapped industrial facility`);
  } else if (d.osm_industrial_dist_km !== null && d.osm_industrial_dist_km < 5.0) {
    proxSeverity = 'near';
    bullets.push(`Moderate proximity: ${d.osm_industrial_dist_km.toFixed(1)} km to industrial infrastructure`);
  } else if (d.osm_industrial_dist_km !== null) {
    proxSeverity = 'distant';
    bullets.push(`Isolated from industrial grid: ${d.osm_industrial_dist_km.toFixed(1)} km to nearest mapped industrial area`);
  }

  // 3. Land Cover Evidence
  if (d.landcover === 50) {
    bullets.push('ESA WorldCover 10m confirms Built-up / Urban / Industrial ground class');
  } else if (d.landcover === 40) {
    bullets.push('ESA WorldCover 10m confirms Cropland (consistent with seasonal crop residue burning)');
  } else if (d.landcover === 10) {
    bullets.push('ESA WorldCover 10m indicates Tree Cover / Forest terrain');
  } else if (d.landcover !== null) {
    bullets.push(`ESA WorldCover 10m: ${landLabel}`);
  }

  // 4. Thermal Power Signature
  bullets.push(`Thermal Radiative Power (FRP): ${d.frp.toFixed(1)} MW at ${d.brightness.toFixed(1)} K`);

  // Narrative generation based on actual features
  let narrative = '';
  if (isIndustrial) {
    if (d.osm_inside_industrial === 1 && d.distinct_days >= 5) {
      narrative = `High thermal persistence across ${d.distinct_days} distinct observation days combined with exact positioning within mapped industrial infrastructure provides conclusive corroborating evidence for a stationary industrial thermal source (e.g. flare, kiln, or furnace).`;
    } else if (d.distinct_days >= 5) {
      narrative = `Repeated multi-day thermal re-emergence (${d.distinct_days} days across ${d.active_span_days} days) strongly aligns with an engineered continuous thermal process rather than transient wildland combustion.`;
    } else if (d.osm_inside_industrial === 1 || (d.osm_industrial_dist_km !== null && d.osm_industrial_dist_km < 1.5)) {
      const distStr = d.osm_inside_industrial ? 'inside perimeter' : `${d.osm_industrial_dist_km?.toFixed(2)} km`;
      narrative = `Spatial proximity (${distStr}) to recognized industrial zoning provides critical spatial weight supporting classification as an industrial emitter.`;
    } else {
      narrative = `Thermal characteristics and persistence profile meet the learned criteria for stationary or repeated industrial heat sources under the trained PyTorch MLP classifier.`;
    }
  } else {
    if (d.distinct_days <= 2 && (d.landcover === 40 || d.landcover === 10)) {
      narrative = `Transient single/dual-pass thermal anomaly detected over ${landLabel.toLowerCase()}, exhibiting the signature temporal dissipation characteristic of open-air vegetation or crop-residue fires.`;
    } else if (d.osm_industrial_dist_km !== null && d.osm_industrial_dist_km > 5) {
      narrative = `The anomaly is situated ${d.osm_industrial_dist_km.toFixed(1)} km away from mapped industrial infrastructure and lacks repeated multi-week thermal accumulation, confirming open wildland/vegetation combustion.`;
    } else {
      narrative = `Temporal and spatial footprint is consistent with genuine vegetative or biomass fire, with low persistence across observation windows.`;
    }
  }

  return {
    primaryVerdict: isIndustrial ? 'INDUSTRIAL PERSISTENT SOURCE' : 'VEGETATION / BIOMASS FIRE',
    confidenceScorePercent: confidencePercent,
    bullets,
    narrative,
    persistenceSeverity: persistSeverity,
    proximitySeverity: proxSeverity,
    landcoverLabel: landLabel,
  };
}
