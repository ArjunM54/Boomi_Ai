'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import {
  MapPin,
  Filter,
  Layers,
  Search,
  AlertTriangle,
  FileText,
  ScanEye,
  History,
  Sparkles,
  X,
  CheckCircle2,
  Shield
} from 'lucide-react';

import { fetchParcels, fetchParcelsGeoJSON } from '../lib/api';
import { Parcel } from '../types';

// Helper component to fly map focus to selected parcel
function MapFlyTo({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] !== 0) {
      map.flyTo(coords, 16, { animate: true, duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

export default function GISMapComponent() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [geojson, setGeojson] = useState<any>(null);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [flyCoords, setFlyCoords] = useState<[number, number]>([26.9124, 75.7873]); // Rampur Jaipur center

  // Filter states
  const [selectedVillage, setSelectedVillage] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedLandType, setSelectedLandType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapLayer, setMapLayer] = useState<'OSM' | 'SATELLITE'>('SATELLITE');

  useEffect(() => {
    fetchParcels().then(data => {
      setParcels(data);
      // Auto select demo parcel P-00102 on load
      const demo = data.find(p => p.parcel_id === 'P-00102') || data[0];
      if (demo) {
        setSelectedParcel(demo);
        setFlyCoords([demo.latitude, demo.longitude]);
      }
    });

    fetch('/api/map/geojson')
      .then(res => res.json())
      .then(data => setGeojson(data))
      .catch(() => console.log('GeoJSON fallback active'));
  }, []);

  // Filter parcels
  const filteredParcels = parcels.filter(p => {
    if (selectedVillage !== 'ALL' && p.village !== selectedVillage) return false;
    if (selectedRisk !== 'ALL' && p.risk_level !== selectedRisk) return false;
    if (selectedLandType !== 'ALL' && p.land_type !== selectedLandType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.survey_number.toLowerCase().includes(q) || p.parcel_id.toLowerCase().includes(q) || p.village.toLowerCase().includes(q);
    }
    return true;
  });

  // Dynamic polygon styling
  const getParcelStyle = (feature: any) => {
    const props = feature.properties;
    const isTarget = props.parcel_id === 'P-00102';
    const isSelected = selectedParcel?.parcel_id === props.parcel_id;

    let color = '#10B981'; // Green
    if (props.risk_level === 'HIGH') color = '#EF4444'; // Red
    else if (props.risk_level === 'MEDIUM') color = '#F59E0B'; // Yellow
    else if (props.land_type === 'Government') color = '#3B82F6'; // Blue

    return {
      fillColor: color,
      weight: isSelected || isTarget ? 4 : 2,
      opacity: 0.9,
      color: isSelected ? '#FFFFFF' : (isTarget ? '#EF4444' : color),
      fillOpacity: isSelected ? 0.65 : (isTarget ? 0.55 : 0.35),
      dashArray: props.status === 'Pending Survey' ? '4, 4' : undefined
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    layer.on({
      click: () => {
        setSelectedParcel(props);
        setFlyCoords([props.latitude, props.longitude]);
      }
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] rounded-2xl overflow-hidden border border-bhoomi-border shadow-2xl flex">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2 bg-bhoomi-card/90 backdrop-blur-md p-2 rounded-xl border border-bhoomi-border shadow-xl">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Survey / Parcel..."
            className="bg-bhoomi-dark text-xs text-white placeholder-gray-500 pl-8 pr-3 py-1.5 rounded-lg border border-bhoomi-border focus:border-emerald-500 focus:outline-none w-44"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2" />
        </div>

        {/* Risk Filter */}
        <select
          value={selectedRisk}
          onChange={e => setSelectedRisk(e.target.value)}
          className="bg-bhoomi-dark text-xs text-gray-200 px-2.5 py-1.5 rounded-lg border border-bhoomi-border focus:outline-none font-medium"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="HIGH">HIGH Risk</option>
          <option value="MEDIUM">MEDIUM Risk</option>
          <option value="LOW">LOW Risk</option>
        </select>

        {/* Land Type Filter */}
        <select
          value={selectedLandType}
          onChange={e => setSelectedLandType(e.target.value)}
          className="bg-bhoomi-dark text-xs text-gray-200 px-2.5 py-1.5 rounded-lg border border-bhoomi-border focus:outline-none font-medium"
        >
          <option value="ALL">All Land Types</option>
          <option value="Agricultural">Agricultural</option>
          <option value="Government">Government</option>
          <option value="Residential">Residential</option>
          <option value="Forest / Green Belt">Forest</option>
        </select>

        {/* Map Layer Switcher */}
        <button
          onClick={() => setMapLayer(mapLayer === 'OSM' ? 'SATELLITE' : 'OSM')}
          className="flex items-center space-x-1.5 bg-bhoomi-dark hover:bg-bhoomi-hover text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-bhoomi-border transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{mapLayer === 'OSM' ? 'Satellite View' : 'Map Vector'}</span>
        </button>

        {/* Target Demo Quick Jump */}
        <button
          onClick={() => {
            const demo = parcels.find(p => p.parcel_id === 'P-00102');
            if (demo) {
              setSelectedParcel(demo);
              setFlyCoords([demo.latitude, demo.longitude]);
            }
          }}
          className="flex items-center space-x-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-500/40 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Demo Target 102/3A</span>
        </button>
      </div>

      {/* Main Leaflet Map */}
      <MapContainer
        center={flyCoords}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapFlyTo coords={flyCoords} />

        {mapLayer === 'SATELLITE' ? (
          <TileLayer
            attribution='&copy; ESRI World Imagery & OpenStreetMap'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {/* GeoJSON Parcels Rendering */}
        {geojson && (
          <GeoJSON
            data={geojson}
            style={getParcelStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Interactive Selected Parcel Inspection Side Panel */}
      {selectedParcel && (
        <div className="absolute top-4 right-4 z-[1000] max-w-sm w-full bg-bhoomi-card/95 backdrop-blur-md border border-bhoomi-border rounded-2xl shadow-2xl p-5 space-y-4 text-white animate-in fade-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between border-b border-bhoomi-border pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-base font-mono">Survey No: {selectedParcel.survey_number}</h3>
                <span className="text-[11px] text-gray-400">{selectedParcel.parcel_id} • {selectedParcel.village}</span>
              </div>
            </div>
            <button onClick={() => setSelectedParcel(null)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-bhoomi-dark">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-bhoomi-dark border border-bhoomi-border space-y-0.5">
              <span className="text-[10px] text-gray-400 block">Area</span>
              <span className="font-bold text-white font-mono">{selectedParcel.area_acres} acres</span>
            </div>

            <div className="p-2.5 rounded-xl bg-bhoomi-dark border border-bhoomi-border space-y-0.5">
              <span className="text-[10px] text-gray-400 block">Land Type</span>
              <span className="font-bold text-white">{selectedParcel.land_type}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-bhoomi-dark border border-bhoomi-border space-y-0.5">
              <span className="text-[10px] text-gray-400 block">Status</span>
              <span className="font-bold text-emerald-400">{selectedParcel.status}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-bhoomi-dark border border-bhoomi-border space-y-0.5">
              <span className="text-[10px] text-gray-400 block">Risk Classification</span>
              <span className={`font-bold ${
                selectedParcel.risk_level === 'HIGH' ? 'text-rose-400' : (selectedParcel.risk_level === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400')
              }`}>
                {selectedParcel.risk_level} RISK
              </span>
            </div>
          </div>

          {/* Latest AI Finding */}
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-rose-400">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Latest AI Finding
              </span>
              <span className="text-[10px] font-mono bg-rose-500/20 px-1.5 py-0.5 rounded">94% Confidence</span>
            </div>
            <p className="text-xs text-gray-200">{selectedParcel.latest_change || 'Unauthorized building construction detected.'}</p>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Link
              href={`/parcels/${selectedParcel.parcel_id}`}
              className="flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>

            <Link
              href="/ai-analysis"
              className="flex items-center justify-center space-x-1 bg-bhoomi-hover hover:bg-bhoomi-border text-amber-300 text-xs font-semibold py-2 rounded-xl border border-amber-500/30 transition-colors"
            >
              <ScanEye className="w-3.5 h-3.5" />
              <span>AI Analyze</span>
            </Link>

            <Link
              href="/timeline"
              className="flex items-center justify-center space-x-1 bg-bhoomi-dark hover:bg-bhoomi-hover text-gray-300 text-xs font-medium py-2 rounded-xl border border-bhoomi-border transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
