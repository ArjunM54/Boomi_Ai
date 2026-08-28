'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sliders, Database, Layers, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [demoMode, setDemoMode] = useState(true);
  const [aiTolerance, setAiTolerance] = useState(0.5);
  const [gisSource, setGisSource] = useState('ESRI_SATELLITE');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <div className="border-b border-bhoomi-border pb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Application Settings & Configuration</h1>
        </div>
        <p className="text-xs text-gray-400">Configure BhoomiAI GIS parameters, AI tolerance, and hackathon presentation mode</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Platform Settings Saved Successfully!</span>
        </div>
      )}

      <div className="glass-panel p-6 rounded-3xl border border-bhoomi-border space-y-6">
        {/* Hackathon Demo Mode Toggle */}
        <div className="flex items-center justify-between border-b border-bhoomi-border pb-4">
          <div>
            <h3 className="font-bold text-sm text-white">Hackathon Presentation Demo Mode</h3>
            <p className="text-xs text-gray-400">Uses synthetic 100+ parcel dataset & pre-generated aerial imagery for offline demo</p>
          </div>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${demoMode ? 'bg-emerald-500' : 'bg-gray-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${demoMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* AI Model Sensitivity Slider */}
        <div className="space-y-2 border-b border-bhoomi-border pb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">AI Difference Detection Sensitivity</h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">{aiTolerance}</span>
          </div>
          <p className="text-xs text-gray-400">Adjust threshold tolerance for contour change detection</p>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={aiTolerance}
            onChange={e => setAiTolerance(Number(e.target.value))}
            className="w-full h-2 bg-bhoomi-dark rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* GIS Provider Selector */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-white">GIS Map Base Layer Provider</h3>
          <select
            value={gisSource}
            onChange={e => setGisSource(e.target.value)}
            className="w-full bg-bhoomi-dark text-xs text-white p-3 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
          >
            <option value="ESRI_SATELLITE">ESRI World High-Resolution Imagery (Satellite)</option>
            <option value="OPENSTREETMAP">OpenStreetMap Standard Vector</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition-colors"
        >
          SAVE CONFIGURATION
        </button>
      </div>
    </div>
  );
}
