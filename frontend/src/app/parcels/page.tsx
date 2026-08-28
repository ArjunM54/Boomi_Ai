'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, FileSpreadsheet, MapPin, ArrowUpRight, Shield } from 'lucide-react';
import { fetchParcels } from '../../lib/api';
import { Parcel } from '../../types';

export default function ParcelsExplorerPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [selectedLandType, setSelectedLandType] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');

  useEffect(() => {
    fetchParcels()
      .then(data => setParcels(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = parcels.filter(p => {
    if (selectedVillage !== 'ALL' && p.village !== selectedVillage) return false;
    if (selectedLandType !== 'ALL' && p.land_type !== selectedLandType) return false;
    if (selectedRisk !== 'ALL' && p.risk_level !== selectedRisk) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.survey_number.toLowerCase().includes(q) ||
        p.parcel_id.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const villages = Array.from(new Set(parcels.map(p => p.village)));
  const landTypes = Array.from(new Set(parcels.map(p => p.land_type)));

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bhoomi-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Parcel Explorer</h1>
          <p className="text-xs text-gray-400">Search and filter 100+ synthetic land records and survey numbers</p>
        </div>

        <div className="text-xs text-gray-400 bg-bhoomi-card px-3 py-1.5 rounded-xl border border-bhoomi-border font-mono">
          Showing <span className="text-emerald-400 font-bold">{filtered.length}</span> of {parcels.length} parcels
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-bhoomi-border flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Survey No (e.g. 102/3A), Village, District..."
            className="w-full bg-bhoomi-dark text-xs text-white placeholder-gray-500 pl-9 pr-3 py-2 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
        </div>

        {/* Village Filter */}
        <select
          value={selectedVillage}
          onChange={e => setSelectedVillage(e.target.value)}
          className="bg-bhoomi-dark text-xs text-gray-200 px-3 py-2 rounded-xl border border-bhoomi-border focus:outline-none font-medium"
        >
          <option value="ALL">All Villages</option>
          {villages.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        {/* Land Type Filter */}
        <select
          value={selectedLandType}
          onChange={e => setSelectedLandType(e.target.value)}
          className="bg-bhoomi-dark text-xs text-gray-200 px-3 py-2 rounded-xl border border-bhoomi-border focus:outline-none font-medium"
        >
          <option value="ALL">All Land Types</option>
          {landTypes.map(lt => (
            <option key={lt} value={lt}>{lt}</option>
          ))}
        </select>

        {/* Risk Level Filter */}
        <select
          value={selectedRisk}
          onChange={e => setSelectedRisk(e.target.value)}
          className="bg-bhoomi-dark text-xs text-gray-200 px-3 py-2 rounded-xl border border-bhoomi-border focus:outline-none font-medium"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="HIGH">HIGH Risk</option>
          <option value="MEDIUM">MEDIUM Risk</option>
          <option value="LOW">LOW Risk</option>
        </select>
      </div>

      {/* Parcel Table */}
      <div className="glass-panel rounded-2xl border border-bhoomi-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-bhoomi-border text-gray-400 font-semibold uppercase text-[10px] bg-bhoomi-dark/50">
                <th className="py-3 px-4">Parcel ID</th>
                <th className="py-3 px-4">Survey Number</th>
                <th className="py-3 px-4">Village / District</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Land Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bhoomi-border/50">
              {filtered.map(p => (
                <tr key={p.parcel_id} className={`hover:bg-bhoomi-hover/50 transition-colors ${p.is_demo_target ? 'bg-emerald-950/20' : ''}`}>
                  <td className="py-3 px-4 font-mono font-bold text-white flex items-center space-x-1.5">
                    {p.is_demo_target && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                    <span>{p.parcel_id}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{p.survey_number}</td>
                  <td className="py-3 px-4 text-gray-300">{p.village}, <span className="text-gray-500">{p.district}</span></td>
                  <td className="py-3 px-4 text-gray-200 font-mono">{p.area_acres} acres</td>
                  <td className="py-3 px-4 text-gray-300">{p.land_type}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-bhoomi-dark text-blue-400 border border-bhoomi-border text-[10px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.risk_level === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : (p.risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30')
                    }`}>
                      {p.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/parcels/${p.parcel_id}`}
                      className="inline-flex items-center space-x-1 bg-emerald-600/30 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1 rounded-lg border border-emerald-500/30 transition-colors"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
