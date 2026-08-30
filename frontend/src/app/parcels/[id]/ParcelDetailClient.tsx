'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  MapPin,
  ScanEye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  UserCheck,
  History,
  Sparkles,
  ArrowLeft,
  Calendar,
  Layers,
  Building
} from 'lucide-react';
import { fetchParcelDetail, updateAlertStatus } from '../../../lib/api';

export default function ParcelDetailClient({ id }: { id: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Before / After Slider toggle
  const [sliderPos, setSliderPos] = useState(50);
  const [officerNotes, setOfficerNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchParcelDetail(id)
      .then(res => setData(res))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-gray-400 flex items-center justify-center space-x-2">
        <Sparkles className="w-5 h-5 animate-spin text-emerald-400" />
        <span>Loading Parcel Detail for {id}...</span>
      </div>
    );
  }

  const { parcel, alerts, timeline, imagery } = data;
  const mainAlert = alerts && alerts.length > 0 ? alerts[0] : null;

  const handleOfficerAction = async (status: string) => {
    if (mainAlert) {
      await updateAlertStatus(
        mainAlert.alert_id,
        status,
        officerNotes || `Officer action: ${status} recorded on parcel ${parcel.survey_number}.`,
        'SDM Officer R. Sharma'
      );
    }
    setActionSuccess(`Parcel status updated to ${status}!`);
    parcel.status = status;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bhoomi-border pb-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/parcels"
            className="p-2 rounded-xl bg-bhoomi-card hover:bg-bhoomi-hover text-gray-300 border border-bhoomi-border transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white font-mono">Survey No: {parcel.survey_number}</h1>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                {parcel.parcel_id}
              </span>
            </div>
            <p className="text-xs text-gray-400">{parcel.village} Village, {parcel.district} District</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/map"
            className="flex items-center space-x-1.5 bg-bhoomi-hover text-emerald-400 text-xs font-semibold px-4 py-2 rounded-xl border border-bhoomi-border"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Locate on Map</span>
          </Link>
          <Link
            href="/ai-analysis"
            className="flex items-center space-x-1.5 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            <ScanEye className="w-3.5 h-3.5" />
            <span>Analyze Imagery</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="underline text-emerald-400">Dismiss</button>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Imagery Comparison & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel p-3.5 rounded-xl border border-bhoomi-border space-y-1">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Area</span>
              <span className="text-lg font-bold text-white font-mono block">{parcel.area_acres} acres</span>
            </div>

            <div className="glass-panel p-3.5 rounded-xl border border-bhoomi-border space-y-1">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Land Type</span>
              <span className="text-base font-bold text-emerald-400 block">{parcel.land_type}</span>
            </div>

            <div className="glass-panel p-3.5 rounded-xl border border-bhoomi-border space-y-1">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Current Status</span>
              <span className="text-base font-bold text-blue-400 block">{parcel.status}</span>
            </div>

            <div className="glass-panel p-3.5 rounded-xl border border-bhoomi-border space-y-1">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Risk Level</span>
              <span className={`text-base font-bold block ${
                parcel.risk_level === 'HIGH' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {parcel.risk_level} RISK
              </span>
            </div>
          </div>

          {/* Before / After Dual Aerial Imagery Slider */}
          <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-4">
            <div className="flex items-center justify-between border-b border-bhoomi-border pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Aerial Imagery Comparison (Before vs After)
                </h3>
                <p className="text-xs text-gray-400">Drag interactive slider to compare 2025 agricultural baseline vs 2026 drone survey</p>
              </div>
              <span className="text-xs bg-bhoomi-dark text-gray-300 px-2.5 py-1 rounded-lg border border-bhoomi-border font-mono">
                Slider: {sliderPos}%
              </span>
            </div>

            {/* Visual Interactive Image Slider Container */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden select-none border border-bhoomi-border">
              {/* After Image (Background) */}
              <img
                src={imagery.after}
                alt="2026 Drone Image"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-rose-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
                2026 NEW IMAGE (BUILDING DETECTED)
              </div>

              {/* Before Image (Foreground Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={imagery.before}
                  alt="2025 Drone Image"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute bottom-3 left-3 bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
                  2025 OLD IMAGE (AGRICULTURAL)
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl z-20 flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-bhoomi-dark font-bold text-xs flex items-center justify-center shadow-lg">
                  ↔
                </div>
              </div>

              {/* Input Range overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={e => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
              />
            </div>
          </div>

          {/* Change Timeline */}
          <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-bhoomi-border pb-3">
              <History className="w-4 h-4 text-blue-400" />
              Parcel Transformation History & Audit Timeline
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-bhoomi-border pl-8">
              {timeline.map((item: any, idx: number) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-bhoomi-dark" />
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">{item.year}</span>
                    <span className="text-xs font-bold text-white">— {item.status}</span>
                  </div>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): AI Findings & Officer Action Panel */}
        <div className="space-y-6">
          {/* AI Findings Box */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-3">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> AI Detection Findings
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded border border-rose-500/30">
                PROTOTYPE RISK: 88.5/100
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Detection Category:</span>
                <span className="font-bold text-white">Unauthorized Construction</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>AI Confidence:</span>
                <span className="font-mono font-bold text-emerald-400">94.0%</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Affected Area:</span>
                <span className="font-mono text-gray-200">~420 sqm (14.5%)</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Matched Location:</span>
                <span className="font-mono text-gray-200">11.0168 N, 76.9558 E</span>
              </div>
            </div>
          </div>

          {/* Officer Verification Action Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-4">
            <div className="border-b border-bhoomi-border pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Government Officer Audit Panel
              </h3>
              <p className="text-xs text-gray-400">Record officer verification notes and sign off parcel status</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-semibold block">Officer Verification Notes:</label>
              <textarea
                value={officerNotes}
                onChange={e => setOfficerNotes(e.target.value)}
                placeholder="Enter field inspection notes or verification permit reference..."
                className="w-full h-24 bg-bhoomi-dark text-xs text-white placeholder-gray-500 p-3 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleOfficerAction('VERIFIED')}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Incident (Mark Valid)</span>
              </button>

              <button
                onClick={() => handleOfficerAction('ASSIGNED_INSPECTION')}
                className="w-full flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-500 text-bhoomi-dark font-bold text-xs py-2.5 rounded-xl shadow transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Assign Field Inspection</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOfficerAction('REJECTED')}
                  className="flex items-center justify-center space-x-1 bg-bhoomi-dark hover:bg-bhoomi-hover text-rose-400 font-semibold text-xs py-2 rounded-xl border border-bhoomi-border transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Incident</span>
                </button>

                <button
                  onClick={() => handleOfficerAction('RESOLVED')}
                  className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 rounded-xl transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
