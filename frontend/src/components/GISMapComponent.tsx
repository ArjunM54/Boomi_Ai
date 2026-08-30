'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
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
  Shield,
  RefreshCw
} from 'lucide-react';

import { fetchParcels } from '../lib/api';
import { Parcel } from '../types';
import LandParcelProfilePanel from './LandParcelProfilePanel';

// Helper component for smooth map pan and zoom transitions
function MapFlyTo({ coords, zoom }: { coords: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] !== 0) {
      map.flyTo(coords, zoom, { animate: true, duration: 1.2 });
    }
  }, [coords, zoom, map]);
  return null;
}

const TN_DISTRICTS = [
  'ALL',
  'Coimbatore',
  'Chennai',
  'Madurai',
  'Salem',
  'Tiruchirappalli',
  'Tirunelveli',
  'Erode',
  'Vellore',
  'Thanjavur',
  'Kanchipuram'
];

export default function GISMapComponent() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [geojson, setGeojson] = useState<any>(null);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Default map view centered over Tamil Nadu
  const TN_CENTER: [number, number] = [11.0168, 76.9558];
  const [flyCoords, setFlyCoords] = useState<[number, number]>(TN_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(14);

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedLandType, setSelectedLandType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapLayer, setMapLayer] = useState<'OSM' | 'SATELLITE'>('SATELLITE');

  useEffect(() => {
    setIsLoading(true);
    fetchParcels()
      .then(data => {
        setParcels(data);
        // Auto-select Tamil Nadu Demo target parcel P-00102 on load
        const demo = data.find(p => p.parcel_id === 'P-00102' || p.ulpin === 'TN-CBE-123456789') || data[0];
        if (demo) {
          setSelectedParcel(demo);
          setFlyCoords([demo.latitude, demo.longitude]);
          setMapZoom(16);
        }
      })
      .finally(() => setIsLoading(false));

    // Load 1,000 Tamil Nadu GeoJSON boundary polygons
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/parcels.geojson`)
      .then(res => {
        if (!res.ok) return fetch(`${basePath}/api/map/geojson`).then(r => r.json());
        return res.json();
      })
      .then(data => setGeojson(data))
      .catch(err => console.error('Error loading GeoJSON boundaries:', err));
  }, []);

  // Filter parcels
  const filteredParcels = parcels.filter(p => {
    if (selectedDistrict !== 'ALL' && p.district !== selectedDistrict) return false;
    if (selectedRisk !== 'ALL' && p.risk_level !== selectedRisk) return false;
    if (selectedLandType !== 'ALL' && p.land_type !== selectedLandType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.survey_number.toLowerCase().includes(q) ||
        p.parcel_id.toLowerCase().includes(q) ||
        (p.ulpin && p.ulpin.toLowerCase().includes(q)) ||
        p.village.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Dynamic polygon styling with white border highlight for selected parcel
  const getParcelStyle = (feature: any) => {
    const props = feature.properties;
    const isTarget = props.parcel_id === 'P-00102' || props.ulpin === 'TN-CBE-123456789';
    const isSelected = selectedParcel?.parcel_id === props.parcel_id || (selectedParcel?.ulpin && selectedParcel.ulpin === props.ulpin);

    let color = '#10B981'; // Emerald Green
    if (props.risk_level === 'HIGH') color = '#EF4444'; // Red
    else if (props.risk_level === 'MEDIUM') color = '#F59E0B'; // Amber
    else if (props.land_type === 'Government') color = '#3B82F6'; // Blue

    return {
      fillColor: color,
      weight: isSelected ? 4 : (isTarget ? 3 : 1.8),
      opacity: 0.95,
      color: isSelected ? '#FFFFFF' : (isTarget ? '#EF4444' : color),
      fillOpacity: isSelected ? 0.75 : (isTarget ? 0.60 : 0.40),
      dashArray: props.status === 'Pending Survey' ? '4, 4' : undefined
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    layer.on({
      click: () => {
        setSelectedParcel(props);
        setFlyCoords([props.latitude, props.longitude]);
        setMapZoom(16);
      }
    });
  };

  const handleResetSelection = () => {
    setSelectedParcel(null);
    setFlyCoords([10.8, 78.7]); // Center over full Tamil Nadu
    setMapZoom(8);
  };

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] rounded-2xl overflow-hidden border border-bhoomi-border shadow-2xl flex">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2 bg-bhoomi-card/90 backdrop-blur-md p-2.5 rounded-xl border border-bhoomi-border shadow-2xl max-w-full">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search ULPIN / Survey / District..."
            className="bg-bhoomi-dark text-xs text-white placeholder-gray-500 pl-8 pr-3 py-1.5 rounded-lg border border-bhoomi-border focus:border-emerald-500 focus:outline-none w-52"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2" />
        </div>

        {/* District Filter */}
        <select
          value={selectedDistrict}
          onChange={e => setSelectedDistrict(e.target.value)}
          className="bg-bhoomi-dark text-xs text-gray-200 px-2.5 py-1.5 rounded-lg border border-bhoomi-border focus:outline-none font-medium"
        >
          {TN_DISTRICTS.map(d => (
            <option key={d} value={d}>
              {d === 'ALL' ? 'All TN Districts' : d}
            </option>
          ))}
        </select>

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

        {/* Map Layer Switcher */}
        <button
          onClick={() => setMapLayer(mapLayer === 'OSM' ? 'SATELLITE' : 'OSM')}
          className="flex items-center space-x-1.5 bg-bhoomi-dark hover:bg-bhoomi-hover text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-bhoomi-border transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{mapLayer === 'OSM' ? 'Satellite View' : 'Map Vector'}</span>
        </button>

        {/* Reset Selection */}
        <button
          onClick={handleResetSelection}
          className="flex items-center space-x-1 bg-bhoomi-dark hover:bg-bhoomi-hover text-gray-300 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-bhoomi-border transition-colors"
          title="Reset Map View & Selection"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
          <span>Reset</span>
        </button>

        {/* Target Demo Quick Jump */}
        <button
          onClick={() => {
            const demo = parcels.find(p => p.parcel_id === 'P-00102' || p.ulpin === 'TN-CBE-123456789');
            if (demo) {
              setSelectedParcel(demo);
              setFlyCoords([demo.latitude, demo.longitude]);
              setMapZoom(16);
            }
          }}
          className="flex items-center space-x-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-500/40 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>TN Demo 124/2A</span>
        </button>
      </div>

      {/* Main Leaflet Map */}
      <div className="flex-1 h-full relative z-0">
        <MapContainer
          center={flyCoords}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapFlyTo coords={flyCoords} zoom={mapZoom} />

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
      </div>

      {/* Interactive Land Parcel Details Panel (Desktop: Right-Side Panel / Mobile: Bottom Sheet Drawer) */}
      {selectedParcel && (
        <div className="w-full md:max-w-md lg:max-w-lg h-full absolute md:relative right-0 bottom-0 z-[1100]">
          <LandParcelProfilePanel
            parcel={selectedParcel}
            onClose={() => setSelectedParcel(null)}
            onResetSelection={handleResetSelection}
            onViewBoundary={() => {
              setFlyCoords([selectedParcel.latitude, selectedParcel.longitude]);
              setMapZoom(18);
            }}
          />
        </div>
      )}
    </div>
  );
}
