'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  MapPin,
  ScanEye,
  AlertTriangle,
  FileCheck,
  Users,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  ChevronRight,
  Database,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-bhoomi-card via-bhoomi-card/80 to-bhoomi-dark border border-bhoomi-border p-8 md:p-12 overflow-hidden shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart India Hackathon 2026 Prototype — Problem SIH26014</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Bhoomi<span className="text-emerald-400">AI</span>
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold text-emerald-300">
            AI-Powered GIS Intelligence for Smarter Land Governance
          </h2>

          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            An integrated GIS platform that combines land parcel intelligence, aerial imagery and AI-powered change detection to help authorities monitor land, identify potential issues and make faster evidence-based decisions.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-bhoomi-dark font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/map"
              className="flex items-center space-x-2 bg-bhoomi-hover hover:bg-bhoomi-border text-white font-semibold px-6 py-3 rounded-xl border border-bhoomi-border transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>View GIS Map</span>
            </Link>

            <Link
              href="/ai-analysis"
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-600/30 to-orange-600/30 hover:from-amber-600/50 hover:to-orange-600/50 text-amber-300 font-semibold px-6 py-3 rounded-xl border border-amber-500/40 transition-all"
            >
              <ScanEye className="w-4 h-4 text-amber-400" />
              <span>Test AI Detection</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture Flowchart Visualization */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Platform Flowchart</h3>
          <h2 className="text-2xl font-bold text-white">How BhoomiAI Transforms Land Governance</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-bhoomi-border space-y-3 relative text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto font-bold text-xl">
              1
            </div>
            <h4 className="font-bold text-lg text-white">GIS + Aerial Imagery + AI</h4>
            <p className="text-xs text-gray-400">
              Integrates vector GeoJSON parcel boundaries with satellite & drone imagery and computer vision diffing algorithms.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-bhoomi-border space-y-3 relative text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto font-bold text-xl">
              2
            </div>
            <h4 className="font-bold text-lg text-white">Land Intelligence Engine</h4>
            <p className="text-xs text-gray-400">
              Automated spatial Point-in-Polygon matching & transparent multi-factor risk scoring (Confidence + Land Type + Magnitude).
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-bhoomi-border space-y-3 relative text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto font-bold text-xl">
              3
            </div>
            <h4 className="font-bold text-lg text-white">Smart Evidence Governance</h4>
            <p className="text-xs text-gray-400">
              Instant officer alert generation, digital audit sign-off workflow, citizen issue reporting, and historical change tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Core Demo Story Flow Diagram */}
      <section className="glass-panel p-8 rounded-3xl border border-bhoomi-border space-y-6">
        <div className="flex items-center justify-between border-b border-bhoomi-border pb-4">
          <div>
            <h3 className="font-bold text-xl text-white">Core Hackathon Demo Story</h3>
            <p className="text-xs text-gray-400">End-to-End Decision Support Pipeline (Fully Interactive in UI)</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Target Parcel: P-00102 (Survey 102/3A)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 text-center text-xs">
          {[
            { step: '1', title: 'Drone Image', color: 'border-blue-500/40 text-blue-400' },
            { step: '2', title: 'AI Analysis', color: 'border-cyan-500/40 text-cyan-400' },
            { step: '3', title: 'Change Diff', color: 'border-teal-500/40 text-teal-400' },
            { step: '4', title: 'Building Detection', color: 'border-emerald-500/40 text-emerald-400' },
            { step: '5', title: 'Geo Location', color: 'border-green-500/40 text-green-400' },
            { step: '6', title: 'Parcel Match', color: 'border-amber-500/40 text-amber-400' },
            { step: '7', title: 'Risk Score', color: 'border-orange-500/40 text-orange-400' },
            { step: '8', title: 'Officer Alert', color: 'border-rose-500/40 text-rose-400' },
            { step: '9', title: 'Verification', color: 'border-purple-500/40 text-purple-400' },
            { step: '10', title: 'Status Update', color: 'border-indigo-500/40 text-indigo-400' },
          ].map((item, idx) => (
            <div key={idx} className={`p-2.5 rounded-xl border bg-bhoomi-dark ${item.color} flex flex-col justify-between items-center space-y-1`}>
              <span className="text-[10px] font-mono opacity-70">STEP {item.step}</span>
              <span className="font-bold text-[11px] leading-tight">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Capabilities Grid */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Key Features</h3>
          <h2 className="text-2xl font-bold text-white">Platform Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-white">GIS Land Intelligence</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Interactive Leaflet GeoJSON viewer with 100+ Indian land parcels, survey numbers, risk levels, and land-type filters.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ScanEye className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-white">AI Change Detection</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              OpenCV computer vision difference algorithm detecting new building construction, land clearing, and structural footprints.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-white">Smart Alerts & Risk Engine</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Transparent 0-100 weighted risk engine scoring incidents into LOW, MEDIUM, and HIGH priorities with audit rationale.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-white">Officer Verification Workflow</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Authorized officials inspect before/after imagery, record field audit notes, assign inspections, and sign off incidents.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-white">Citizen Reporting Portal</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Allows citizens to submit potential land encroachment reports with survey numbers and evidence for officer investigation.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-white">Historical Transformation Timeline</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Track land-use changes over multiple years (2024–2026) to maintain complete legal audit history.
            </p>
          </div>
        </div>
      </section>

      {/* Role-based Quick Demo Login Cards */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Demo Access</h3>
          <h2 className="text-2xl font-bold text-white">Select Demo User Role</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-bhoomi-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">ADMIN ROLE</span>
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-bold text-lg text-white">Full System Administrator</h4>
            <p className="text-xs text-gray-400">Complete access to all dashboards, analytics, GIS parameters, and system settings.</p>
            <Link href="/dashboard" className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 rounded-xl transition-colors">
              Enter as Admin →
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-bhoomi-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded">OFFICER ROLE</span>
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-bold text-lg text-white">Sub-Divisional Magistrate / Officer</h4>
            <p className="text-xs text-gray-400">Inspect alerts, run AI image analysis, verify field incidents, and sign off status updates.</p>
            <Link href="/dashboard" className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 rounded-xl transition-colors">
              Enter as Revenue Officer →
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-bhoomi-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded">CITIZEN ROLE</span>
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="font-bold text-lg text-white">Public Citizen Portal</h4>
            <p className="text-xs text-gray-400">Search permitted public land survey records and submit land issue reports.</p>
            <Link href="/reports" className="block text-center bg-amber-600 hover:bg-amber-500 text-bhoomi-dark font-semibold text-xs py-2 rounded-xl transition-colors">
              Enter Citizen Portal →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer / Prototype Disclaimer */}
      <footer className="border-t border-bhoomi-border pt-8 text-center text-xs text-gray-500 space-y-2">
        <p className="font-mono text-gray-400">BhoomiAI — Smart India Hackathon 2026 Prototype (SIH26014)</p>
        <p className="text-[11px] text-gray-500">
          Disclaimer: Prototype AI decision-support platform using synthetic demo land records. Final decisions remain with authorized government officials.
        </p>
      </footer>
    </div>
  );
}
