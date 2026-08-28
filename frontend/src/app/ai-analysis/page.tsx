'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ScanEye,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  FileCheck
} from 'lucide-react';
import { runAIAnalysis } from '../../lib/api';
import { AIAnalysisResult } from '../../types';

export default function AIAnalysisPage() {
  const [oldFile, setOldFile] = useState<File | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (oldFile) formData.append('old_file', oldFile);
      if (newFile) formData.append('new_file', newFile);
      formData.append('parcel_id', 'P-00102');

      const res = await runAIAnalysis(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="border-b border-bhoomi-border pb-4">
        <div className="flex items-center space-x-2">
          <ScanEye className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">AI Aerial Image Analysis & Change Studio</h1>
        </div>
        <p className="text-xs text-gray-400">
          Upload satellite/drone imagery or use built-in demo presets for OpenCV computer vision difference analysis
        </p>
      </div>

      {/* Main Upload / Preset Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OLD IMAGE CARD */}
        <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
              OLD IMAGE (BASELINE 2025)
            </span>
            <span className="text-xs text-gray-400 font-mono">Agricultural Field</span>
          </div>

          <div className="relative h-56 rounded-xl overflow-hidden border border-bhoomi-border bg-bhoomi-dark flex flex-col items-center justify-center p-4">
            {oldFile ? (
              <img src={URL.createObjectURL(oldFile)} alt="Old" className="w-full h-full object-cover" />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src="/static/imagery/demo_p00102_2025_before.png"
                  alt="Demo Old Image"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-bhoomi-dark/40 flex items-center justify-center">
                  <span className="text-xs bg-bhoomi-dark/90 text-white font-mono px-3 py-1.5 rounded-lg border border-bhoomi-border">
                    Preset Demo Imagery (Jan 2025)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-xs bg-bhoomi-dark hover:bg-bhoomi-hover text-gray-300 px-3.5 py-2 rounded-xl border border-bhoomi-border flex items-center space-x-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Baseline Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files && setOldFile(e.target.files[0])}
                className="hidden"
              />
            </label>
            {oldFile && <span className="text-xs text-emerald-400 font-mono">{oldFile.name}</span>}
          </div>
        </div>

        {/* NEW IMAGE CARD */}
        <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded">
              NEW IMAGE (CURRENT 2026)
            </span>
            <span className="text-xs text-gray-400 font-mono">Drone Survey</span>
          </div>

          <div className="relative h-56 rounded-xl overflow-hidden border border-bhoomi-border bg-bhoomi-dark flex flex-col items-center justify-center p-4">
            {newFile ? (
              <img src={URL.createObjectURL(newFile)} alt="New" className="w-full h-full object-cover" />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src="/static/imagery/demo_p00102_2026_after.png"
                  alt="Demo New Image"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-bhoomi-dark/40 flex items-center justify-center">
                  <span className="text-xs bg-bhoomi-dark/90 text-white font-mono px-3 py-1.5 rounded-lg border border-bhoomi-border">
                    Preset Demo Imagery (Feb 2026)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-xs bg-bhoomi-dark hover:bg-bhoomi-hover text-gray-300 px-3.5 py-2 rounded-xl border border-bhoomi-border flex items-center space-x-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Survey Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files && setNewFile(e.target.files[0])}
                className="hidden"
              />
            </label>
            {newFile && <span className="text-xs text-emerald-400 font-mono">{newFile.name}</span>}
          </div>
        </div>
      </div>

      {/* Trigger AI Run CTA Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-bhoomi-dark font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Processing OpenCV Computer Vision Pipeline...' : 'ANALYZE AERIAL CHANGES & MATCH PARCEL'}</span>
        </button>
      </div>

      {/* AI Analysis Results Panel */}
      {result && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bhoomi-border pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">AI Detection & Risk Assessment Results</h2>
                <span className="text-xs font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                  {result.risk_level} RISK ({result.risk_score}/100)
                </span>
              </div>
              <p className="text-xs text-amber-400 font-medium mt-1">⚠️ {result.disclaimer}</p>
            </div>

            {result.matched_parcel_id && (
              <Link
                href={`/parcels/${result.matched_parcel_id}`}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                <span>View Matched Parcel ({result.matched_survey_number})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detection Summary Cards (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-bhoomi-dark border border-bhoomi-border space-y-0.5">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Violation Type</span>
                  <span className="text-sm font-bold text-rose-400 block">{result.detection_type}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-bhoomi-dark border border-bhoomi-border space-y-0.5">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Matched Parcel</span>
                  <span className="text-sm font-bold text-white font-mono block">{result.matched_survey_number}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-bhoomi-dark border border-bhoomi-border space-y-0.5">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">AI Confidence Score</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono block">{(result.confidence_score * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Annotated OpenCV Red Difference Overlay Image */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white block">Computer Vision Difference Overlay:</span>
                <div className="relative h-72 rounded-xl overflow-hidden border border-rose-500/40 bg-bhoomi-dark">
                  <img
                    src={result.overlay_image_url}
                    alt="AI Difference Overlay"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-rose-600/90 text-white font-bold text-[10px] px-2.5 py-1 rounded shadow flex items-center gap-1">
                    <ScanEye className="w-3.5 h-3.5" /> Bounding Box Detected
                  </div>
                </div>
              </div>
            </div>

            {/* Transparent Risk Rationale List (1 col) */}
            <div className="p-4 rounded-2xl bg-bhoomi-dark border border-bhoomi-border space-y-3">
              <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" /> Transparent Risk Engine Rationale
              </h4>

              <div className="space-y-2 text-xs">
                {result.rationale.map((line, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border text-gray-300">
                    {line}
                  </div>
                ))}
              </div>

              {result.alert_created && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold space-y-1">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Incident Alert Automatically Created!
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono">Alert ID: {result.alert_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
