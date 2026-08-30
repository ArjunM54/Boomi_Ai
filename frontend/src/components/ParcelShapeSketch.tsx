'use client';

import React from 'react';
import { Compass, Maximize2, MapPin } from 'lucide-react';
import { ParcelGeometry } from '../types';

interface Props {
  geometry: ParcelGeometry;
  surveyNumber: string;
  areaAcres: number;
  ulpin: string;
  riskLevel?: string;
  onViewBoundary?: () => void;
}

export default function ParcelShapeSketch({ geometry, surveyNumber, areaAcres, ulpin, riskLevel, onViewBoundary }: Props) {
  const coords = geometry?.coordinates?.[0] || [];

  if (coords.length === 0) {
    return (
      <div className="w-full h-44 bg-bhoomi-dark/90 rounded-xl border border-bhoomi-border flex items-center justify-center text-xs text-gray-500">
        No geometry shape coordinates available
      </div>
    );
  }

  // Calculate bounding box for SVG projection
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  coords.forEach(([lng, lat]) => {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  });

  const svgWidth = 320;
  const svgHeight = 180;
  const padding = 35;

  const lngSpan = maxLng - minLng || 0.0001;
  const latSpan = maxLat - minLat || 0.0001;

  // Project lat/lng to SVG x/y
  const projectedPoints = coords.map(([lng, lat]) => {
    const x = padding + ((lng - minLng) / lngSpan) * (svgWidth - 2 * padding);
    const y = svgHeight - (padding + ((lat - minLat) / latSpan) * (svgHeight - 2 * padding));
    return { x, y, lng, lat };
  });

  const pointsString = projectedPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  let strokeColor = '#10B981'; // Green
  let fillColor = 'rgba(16, 185, 129, 0.18)';
  if (riskLevel === 'HIGH') {
    strokeColor = '#EF4444'; // Red
    fillColor = 'rgba(239, 68, 68, 0.22)';
  } else if (riskLevel === 'MEDIUM') {
    strokeColor = '#F59E0B'; // Amber
    fillColor = 'rgba(245, 158, 11, 0.20)';
  }

  // Center coordinate for label
  const centerX = projectedPoints.reduce((acc, p) => acc + p.x, 0) / projectedPoints.length;
  const centerY = projectedPoints.reduce((acc, p) => acc + p.y, 0) / projectedPoints.length;

  return (
    <div className="w-full bg-bhoomi-dark/95 border border-bhoomi-border rounded-xl p-3.5 space-y-2 relative overflow-hidden shadow-inner">
      <div className="flex items-center justify-between border-b border-bhoomi-border/60 pb-2 text-xs">
        <div className="flex items-center space-x-1.5 font-bold text-emerald-400">
          <MapPin className="w-3.5 h-3.5" />
          <span>Cadastral Boundary Geometry</span>
        </div>

        {onViewBoundary && (
          <button
            onClick={onViewBoundary}
            className="flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Focus Main Map</span>
          </button>
        )}
      </div>

      {/* Interactive Cadastral SVG Shape Canvas */}
      <div className="relative w-full h-44 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
        {/* Subtle Grid Background Lines */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800/40 opacity-40 pointer-events-none" width="100%" height="100%">
          <defs>
            <pattern id="cadastralGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cadastralGrid)" />
        </svg>

        {/* Compass Rosette Indicator */}
        <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur px-2 py-1 rounded border border-slate-700/60 flex items-center space-x-1 text-[10px] text-emerald-400 font-mono">
          <Compass className="w-3 h-3 text-emerald-400" />
          <span>N</span>
        </div>

        {/* Main Polygon SVG */}
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full z-10 drop-shadow-md">
          {/* Drawn Parcel Polygon */}
          <polygon
            points={pointsString}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeDasharray={riskLevel === 'HIGH' ? '6,3' : undefined}
          />

          {/* Vertex Control Nodes & Labels */}
          {projectedPoints.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke={strokeColor} strokeWidth="2" />
              <text
                x={pt.x + (pt.x > centerX ? 6 : -14)}
                y={pt.y + (pt.y > centerY ? 10 : -6)}
                fill="#94A3B8"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
              >
                P{i + 1}
              </text>
            </g>
          ))}

          {/* Center Label */}
          <g transform={`translate(${centerX}, ${centerY})`}>
            <rect x="-42" y="-12" width="84" height="24" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke={strokeColor} strokeWidth="1" />
            <text x="0" y="-1" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {surveyNumber}
            </text>
            <text x="0" y="8" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {areaAcres} Acres
            </text>
          </g>
        </svg>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-0.5">
        <span>Nodes: {coords.length - 1} Boundary Vertices</span>
        <span className="text-emerald-400">Verified GeoJSON Polygon</span>
      </div>
    </div>
  );
}
