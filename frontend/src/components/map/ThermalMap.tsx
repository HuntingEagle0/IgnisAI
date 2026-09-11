import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Detection } from '../../types/detection';
import { formatConfidence, formatCoordinates, formatFRP } from '../../utils/formatters';
import { Layers, Maximize2, ShieldAlert } from 'lucide-react';

interface ThermalMapProps {
  detections: Detection[];
  selectedDetection: Detection | null;
  onSelectDetection: (d: Detection) => void;
  centerCoords?: [number, number] | null;
  heightClass?: string;
}

type TileProvider = 'dark' | 'satellite' | 'street';

export const ThermalMap: React.FC<ThermalMapProps> = ({
  detections,
  selectedDetection,
  onSelectDetection,
  centerCoords,
  heightClass = 'h-[550px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeTile, setActiveTile] = useState<TileProvider>('dark');

  const tileUrls: Record<TileProvider, { url: string; attribution: string }> = {
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [27.25, 75.8],
        zoom: 7,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const initialTile = L.tileLayer(tileUrls[activeTile].url, {
        attribution: tileUrls[activeTile].attribution,
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = initialTile;
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when changed
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTile = L.tileLayer(tileUrls[activeTile].url, {
      attribution: tileUrls[activeTile].attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [activeTile]);

  // Center Map when requested
  useEffect(() => {
    if (!mapInstanceRef.current || !centerCoords) return;
    mapInstanceRef.current.setView(centerCoords, 11, { animate: true });
  }, [centerCoords]);

  // Render Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    detections.forEach((d) => {
      const isSelected = selectedDetection?.id === d.id;
      const isIndustrial = d.predicted_label === 'industrial_persistent';
      const isCritical = isIndustrial && d.prediction_confidence >= 0.95;

      // Marker sizing based on FRP (Fire Radiative Power)
      const radius = Math.max(5, Math.min(14, Math.sqrt(d.frp) * 1.8));

      const fillColor = isIndustrial ? '#ef4444' : '#10b981';
      const strokeColor = isSelected ? '#06b6d4' : isCritical ? '#fca5a5' : fillColor;
      const weight = isSelected ? 3 : isCritical ? 2.5 : 1.5;

      const circle = L.circleMarker([d.latitude, d.longitude], {
        radius,
        fillColor,
        color: strokeColor,
        weight,
        opacity: 1,
        fillOpacity: isSelected ? 0.95 : 0.75,
      });

      // Tooltip
      const tooltipContent = `
        <div style="font-family: inherit; font-size: 11px; padding: 4px 6px;">
          <div style="font-weight: bold; color: ${isIndustrial ? '#ef4444' : '#10b981'};">
            ${isIndustrial ? 'INDUSTRIAL PERSISTENT' : 'VEGETATION FIRE'}
          </div>
          <div style="color: #94a3b8; margin-top: 2px;">ID: ${d.id}</div>
          <div style="color: #e2e8f0;">FRP: <b>${formatFRP(d.frp)}</b> | Conf: <b>${formatConfidence(d.prediction_confidence)}</b></div>
          <div style="color: #94a3b8; font-size: 10px;">Persistence: ${d.distinct_days} days (${d.detection_count} hits)</div>
        </div>
      `;

      circle.bindTooltip(tooltipContent, {
        direction: 'top',
        className: 'ignis-leaflet-tooltip',
        offset: [0, -radius],
      });

      circle.on('click', () => {
        onSelectDetection(d);
      });

      markersLayerRef.current?.addLayer(circle);
    });
  }, [detections, selectedDetection, onSelectDetection]);

  const handleFitBounds = () => {
    if (!mapInstanceRef.current || detections.length === 0) return;
    const latLngs = detections.map((d) => [d.latitude, d.longitude] as [number, number]);
    mapInstanceRef.current.fitBounds(latLngs, { padding: [40, 40] });
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-ignis-border shadow-2xl`}>
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Top Left Tile Selector */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1 rounded-lg bg-[#0d1524]/90 p-1 border border-slate-800 backdrop-blur-md shadow-lg">
        <Layers className="h-3.5 w-3.5 text-cyan-400 ml-1.5 mr-0.5" />
        <button
          onClick={() => setActiveTile('dark')}
          className={`px-2 py-1 text-[11px] font-mono font-medium rounded transition-colors ${
            activeTile === 'dark'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Dark
        </button>
        <button
          onClick={() => setActiveTile('satellite')}
          className={`px-2 py-1 text-[11px] font-mono font-medium rounded transition-colors ${
            activeTile === 'satellite'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => setActiveTile('street')}
          className={`px-2 py-1 text-[11px] font-mono font-medium rounded transition-colors ${
            activeTile === 'street'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Street
        </button>
      </div>

      {/* Top Right Fit Bounds Button */}
      <button
        onClick={handleFitBounds}
        title="Fit Map to All Detections"
        className="absolute top-3 right-12 z-[400] flex items-center justify-center p-2 rounded-lg bg-[#0d1524]/90 border border-slate-800 text-slate-300 hover:text-cyan-400 backdrop-blur-md shadow-lg transition-colors"
      >
        <Maximize2 className="h-4 w-4" />
      </button>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-3 z-[400] rounded-lg bg-[#0d1524]/95 p-3 border border-slate-800 backdrop-blur-md shadow-xl text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Thermal Semantics</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-slate-300 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500 border border-red-300 animate-pulse" />
            <span>Industrial Persistent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-300" />
            <span>Vegetation Fire</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-cyan-400 border border-white" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
            <span>Marker Size ∝ FRP (MW)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
