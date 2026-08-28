'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const GISMapComponent = dynamic(() => import('../../components/GISMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-6rem)] bg-bhoomi-card rounded-2xl border border-bhoomi-border flex items-center justify-center space-x-3 text-emerald-400">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="text-sm font-semibold">Initializing Interactive GIS Map & Parcel Layer...</span>
    </div>
  )
});

export default function GISMapPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">GIS Land Map & Boundary Intelligence</h1>
          <p className="text-xs text-gray-400">Vector GeoJSON parcels with risk overlays, land-type filters, and satellite layers</p>
        </div>
      </div>
      <GISMapComponent />
    </div>
  );
}
