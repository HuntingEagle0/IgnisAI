import { Detection } from '../types/detection';

export function exportDetectionsToCsv(detections: Detection[], filename = 'ignis_classified_detections.csv') {
  if (!detections.length) return;

  const headers = [
    'id',
    'latitude',
    'longitude',
    'acq_datetime',
    'frp',
    'brightness',
    'bright_t31',
    'scan',
    'track',
    'confidence',
    'daynight',
    'satellite',
    'detection_count',
    'distinct_days',
    'active_span_days',
    'landcover',
    'osm_industrial_dist_km',
    'osm_inside_industrial',
    'predicted_label',
    'prediction_confidence',
    'review_status',
  ];

  const rows = detections.map((d) => [
    d.id,
    d.latitude,
    d.longitude,
    `"${d.acq_datetime}"`,
    d.frp,
    d.brightness,
    d.bright_t31 ?? '',
    d.scan,
    d.track,
    d.confidence,
    d.daynight,
    d.satellite,
    d.detection_count,
    d.distinct_days,
    d.active_span_days,
    d.landcover ?? '',
    d.osm_industrial_dist_km ?? '',
    d.osm_inside_industrial,
    d.predicted_label,
    d.prediction_confidence,
    d.review_status ?? 'unreviewed',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
