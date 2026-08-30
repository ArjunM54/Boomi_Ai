'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Shield,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ScanEye,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  Layers,
  History,
  Bot,
  Download,
  Eye,
  ExternalLink,
  Info,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Sparkles,
  Compass,
  FileCheck,
  Check
} from 'lucide-react';
import { Parcel } from '../types';
import { getFullTNParcelData } from '../lib/tnParcelDataService';
import ParcelShapeSketch from './ParcelShapeSketch';

interface Props {
  parcel: Parcel;
  onClose: () => void;
  onResetSelection?: () => void;
  onViewBoundary?: () => void;
}

export default function LandParcelProfilePanel({ parcel: rawParcel, onClose, onResetSelection, onViewBoundary }: Props) {
  const p = getFullTNParcelData(rawParcel);

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEGAL' | 'SPATIAL' | 'RISK' | 'TIMELINE' | 'DOCS'>('OVERVIEW');
  const [showAiChat, setShowAiChat] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am BhoomiAI. Ask me anything about Parcel ${p.ulpin} (Survey ${p.survey_number}, ${p.village}).`
    }
  ]);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(null);

  // Handle contextual AI query strictly from parcel data
  const handleSendAiQuery = (customQuestion?: string) => {
    const q = customQuestion || aiQuery;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, text: q };
    setChatMessages(prev => [...prev, userMsg]);
    if (!customQuestion) setAiQuery('');

    const lower = q.toLowerCase();
    let reply = '';

    if (lower.includes('owner') || lower.includes('who owns')) {
      reply = `According to verified Patta records, this parcel is registered under ${p.ownership?.owner_name} (${p.ownership?.ownership_type}). Patta Status: ${p.ownership?.ror_status}.`;
    } else if (lower.includes('large') || lower.includes('area') || lower.includes('size')) {
      reply = `Parcel ${p.ulpin} spans ${p.area_acres} Acres (${p.area_hectares} Hectares) with a total boundary perimeter of ${p.spatial_data?.perimeter_meters} meters.`;
    } else if (lower.includes('residential') || lower.includes('land use') || lower.includes('zone')) {
      reply = `Current land use is classified as "${p.land_use_zoning?.current_land_use}" under "${p.land_use_zoning?.zoning_classification}". Master Plan Zone: ${p.land_use_zoning?.master_plan_zone}.`;
    } else if (lower.includes('risk') || lower.includes('threat') || lower.includes('issue')) {
      reply = `The AI Risk Assessment score is ${p.ai_risk?.risk_score}/100 (${p.ai_risk?.risk_level} RISK). Risk Factors: ${p.ai_risk?.risk_factors?.length ? p.ai_risk.risk_factors.join('; ') : 'None detected.'}`;
    } else if (lower.includes('change') || lower.includes('satellite') || lower.includes('drone')) {
      reply = `Geospatial Change Detection between ${p.change_detection?.prev_image_date} and ${p.change_detection?.curr_image_date}: ${p.change_detection?.detected_changes}. Confidence: ${p.change_detection?.confidence_score}%.`;
    } else if (lower.includes('document') || lower.includes('patta') || lower.includes('tax')) {
      reply = `Available documents include Patta Extract, Cadastral FMB Map, Registered Sale Deed, and Property Tax Receipt. Tax Status: ${p.property_tax?.tax_status}.`;
    } else {
      reply = `For Parcel ${p.ulpin} (Survey ${p.survey_number}, ${p.village}), District: ${p.district}, Area: ${p.area_acres} Acres, Land Use: ${p.land_type}, Tax Status: ${p.property_tax?.tax_status}, Risk Level: ${p.risk_level}.`;
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  return (
    <div className="w-full h-full bg-bhoomi-card/95 backdrop-blur-xl border-t md:border-t-0 md:border-l border-bhoomi-border shadow-2xl flex flex-col overflow-hidden text-white rounded-t-2xl md:rounded-none">
      {/* Mobile Drawer Pull Indicator */}
      <div className="md:hidden w-12 h-1 bg-gray-500/50 rounded-full mx-auto my-1.5 shrink-0" />

      {/* 1. Header */}
      <div className="p-3.5 border-b border-bhoomi-border bg-bhoomi-dark/60 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-sm sm:text-base tracking-wide font-mono text-emerald-400">{p.ulpin}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                p.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                p.status === 'Under Review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                ✓ {p.status}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 truncate max-w-[200px] sm:max-w-none">
              Survey No. {p.survey_number} ({p.sub_division}) • {p.village}, {p.district}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          {onResetSelection && (
            <button
              onClick={onResetSelection}
              title="Reset Selection"
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-bhoomi-hover transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-bhoomi-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Banner Notice */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-300">
        <span className="flex items-center gap-1.5 font-medium">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          Demo Data — For SIH26014 Prototype Demonstration
        </span>
        <span className="text-[10px] text-gray-400">Updated: {p.last_updated}</span>
      </div>

      {/* Tab Navigation Bar */}
      <div className="flex items-center border-b border-bhoomi-border bg-bhoomi-dark px-2 overflow-x-auto scrollbar-none shrink-0 text-xs font-semibold">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'LEGAL', label: 'Legal & Tax' },
          { id: 'SPATIAL', label: 'GIS & Satellite' },
          { id: 'RISK', label: 'AI Risk & Audit' },
          { id: 'TIMELINE', label: 'History' },
          { id: 'DOCS', label: 'Documents' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-400 text-emerald-400 font-bold bg-emerald-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {/* OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 3. Basic Information */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <div className="flex items-center justify-between border-b border-bhoomi-border/60 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Basic Information
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">ULPIN: {p.ulpin}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Survey / Sub-Div</span>
                  <span className="font-bold text-white font-mono">{p.survey_number} ({p.sub_division})</span>
                </div>

                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Total Area</span>
                  <span className="font-bold text-emerald-400">{p.area_acres} Acres <span className="text-gray-400 text-[10px]">({p.area_hectares} Ha)</span></span>
                </div>

                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">District & Taluk</span>
                  <span className="font-semibold text-gray-200">{p.district}, {p.taluk}</span>
                </div>

                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Village & Ward</span>
                  <span className="font-semibold text-gray-200">{p.village} ({p.ward})</span>
                </div>

                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Land Classification</span>
                  <span className="font-bold text-white">{p.land_type}</span>
                </div>

                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Coordinates</span>
                  <span className="font-mono text-emerald-300 text-[11px]">{p.latitude.toFixed(4)}° N, {p.longitude.toFixed(4)}° E</span>
                </div>
              </div>
            </div>

            {/* Land Shape Visual Preview */}
            <ParcelShapeSketch
              geometry={p.geometry}
              surveyNumber={p.survey_number}
              areaAcres={p.area_acres}
              ulpin={p.ulpin}
              riskLevel={p.risk_level}
              onViewBoundary={onViewBoundary}
            />

            {/* 4. Ownership & Rights */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <div className="flex items-center justify-between border-b border-bhoomi-border/60 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Ownership & Rights
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  {p.ownership?.ownership_status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-bhoomi-border/40">
                  <span className="text-gray-400">Current Owner:</span>
                  <span className="font-bold text-white">{p.ownership?.owner_name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bhoomi-border/40">
                  <span className="text-gray-400">Ownership Type:</span>
                  <span className="font-semibold text-gray-200">{p.ownership?.ownership_type} ({p.ownership?.owner_count} Owner)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bhoomi-border/40">
                  <span className="text-gray-400">Record of Rights (RoR):</span>
                  <span className="font-mono text-emerald-300">{p.ownership?.ror_status}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-400">Mutation Status:</span>
                  <span className="font-semibold text-emerald-400">✓ {p.ownership?.mutation_status}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowAiChat(true)}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg transition-all"
              >
                <Bot className="w-4 h-4 text-emerald-200" />
                <span>Ask AI About Land</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center justify-center space-x-2 bg-bhoomi-dark hover:bg-bhoomi-hover text-amber-300 text-xs font-bold py-2.5 rounded-xl border border-amber-500/30 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generate Intelligence Report</span>
              </button>
            </div>
          </div>
        )}

        {/* LEGAL & TAX TAB */}
        {activeTab === 'LEGAL' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 5. Registration Information */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-bhoomi-border/60 pb-2">
                <FileText className="w-3.5 h-3.5" /> Registration Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Registration Status</span>
                  <span className="font-bold text-emerald-400">✓ {p.registration?.reg_status}</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Registration No.</span>
                  <span className="font-mono font-bold text-white text-[11px]">{p.registration?.reg_number}</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Document Type</span>
                  <span className="font-semibold text-gray-200">{p.registration?.doc_type}</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Registration Date</span>
                  <span className="font-mono text-gray-300">{p.registration?.reg_date}</span>
                </div>
              </div>
            </div>

            {/* 6. Encumbrance / Mortgage */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-bhoomi-border/60 pb-2">
                <Shield className="w-3.5 h-3.5" /> Encumbrance & Legal Status
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-bhoomi-border/40">
                  <span className="text-gray-400">Encumbrance Status:</span>
                  <span className={`font-bold ${p.encumbrance?.encumbrance_status === 'None Detected' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {p.encumbrance?.encumbrance_status === 'None Detected' ? '✓ None Detected' : '⚠ Attention Required'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bhoomi-border/40">
                  <span className="text-gray-400">Mortgage Status:</span>
                  <span className="font-medium text-gray-200">{p.encumbrance?.mortgage_status}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-bhoomi-border/40">
                  <span className="text-gray-400">Active Bank Loan:</span>
                  <span className="font-medium text-gray-200">{p.encumbrance?.active_loan}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-400">Court / Litigation:</span>
                  <span className="font-bold text-emerald-400">✓ {p.encumbrance?.litigation_status}</span>
                </div>
              </div>
            </div>

            {/* 7. Land Use & Zoning */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-bhoomi-border/60 pb-2">
                <Layers className="w-3.5 h-3.5" /> Land Use & Planning
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Zoning Classification</span>
                  <span className="font-bold text-white">{p.land_use_zoning?.zoning_classification}</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Development Zone</span>
                  <span className="font-semibold text-emerald-300">{p.land_use_zoning?.development_zone}</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Building Permission</span>
                  <span className="font-bold text-emerald-400">{p.land_use_zoning?.building_permission}</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Master Plan Zone</span>
                  <span className="font-semibold text-gray-300">{p.land_use_zoning?.master_plan_zone}</span>
                </div>
              </div>
            </div>

            {/* 8. Property Tax */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-bhoomi-border/60 pb-2">
                <DollarSign className="w-3.5 h-3.5" /> Property Tax Information
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Tax Status</span>
                  <span className={`font-bold ${p.property_tax?.tax_status === 'Paid' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ✓ {p.property_tax?.tax_status}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Outstanding Balance</span>
                  <span className="font-bold font-mono text-white">₹{p.property_tax?.outstanding_amount}</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50 col-span-2">
                  <span className="text-[10px] text-gray-400 block">Assessment No.</span>
                  <span className="font-mono text-emerald-300">{p.property_tax?.tax_assessment_number} (Paid on {p.property_tax?.last_payment_date})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SPATIAL & SATELLITE TAB */}
        {activeTab === 'SPATIAL' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 9. GIS / Spatial Information */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <div className="flex items-center justify-between border-b border-bhoomi-border/60 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> Spatial & Boundary Intelligence
                </h3>
                {onViewBoundary && (
                  <button
                    onClick={onViewBoundary}
                    className="text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/40 flex items-center gap-1 font-bold"
                  >
                    <Eye className="w-3 h-3" /> View Boundary
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Boundary Perimeter</span>
                  <span className="font-bold font-mono text-emerald-400">{p.spatial_data?.perimeter_meters} meters</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Nearby Roads & Infrastructure</span>
                  <span className="font-semibold text-gray-200">{p.spatial_data?.nearby_roads}</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Surrounding Density</span>
                  <span className="font-semibold text-gray-200">{p.spatial_data?.nearby_buildings}</span>
                </div>
                <div className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50">
                  <span className="text-[10px] text-gray-400 block">Ecological Proximity</span>
                  <span className="font-semibold text-gray-200">{p.spatial_data?.nearby_waterbodies}</span>
                </div>
              </div>
            </div>

            {/* 10. Satellite / Drone Analysis */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <div className="flex items-center justify-between border-b border-bhoomi-border/60 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ScanEye className="w-3.5 h-3.5" /> Geospatial Change Detection
                </h3>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded">
                  {p.change_detection?.confidence_score}% Confidence
                </span>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex justify-between text-xs font-bold text-rose-300">
                  <span>Detected Change:</span>
                  <span>{p.change_detection?.detected_changes}</span>
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <p>• Baseline: {p.change_detection?.prev_image_date} vs Current: {p.change_detection?.curr_image_date}</p>
                  <p>• Structure Analysis: {p.change_detection?.building_detection}</p>
                </div>
              </div>

              <Link
                href="/ai-analysis"
                className="w-full flex items-center justify-center space-x-2 bg-bhoomi-hover hover:bg-bhoomi-border text-amber-300 text-xs font-bold py-2.5 rounded-xl border border-amber-500/30 transition-all"
              >
                <ScanEye className="w-4 h-4 text-amber-400" />
                <span>View Imagery Comparison Studio</span>
              </Link>
            </div>
          </div>
        )}

        {/* AI RISK & AUDIT TAB */}
        {activeTab === 'RISK' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 11. AI Risk Assessment */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-bhoomi-border/60 pb-2">
                <Shield className="w-3.5 h-3.5" /> AI Land Risk Assessment
              </h3>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-bhoomi-card border border-bhoomi-border">
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold font-mono text-lg ${
                  p.risk_level === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' :
                  p.risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                }`}>
                  <span>{p.ai_risk?.risk_score}</span>
                  <span className="text-[9px] text-gray-400 font-sans uppercase">{p.risk_level} RISK</span>
                </div>

                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-white">Risk Evaluation Summary</h4>
                  <p className="text-gray-300 text-[11px]">
                    {p.risk_level === 'HIGH' ? 'Requires urgent field verification due to detected spatial discrepancies.' : 'Records show high consistency across revenue and cadastral databases.'}
                  </p>
                  <span className="text-[10px] text-amber-400 font-medium block">
                    {p.ai_risk?.disclaimer}
                  </span>
                </div>
              </div>

              {/* Factors */}
              <div className="space-y-2 text-xs">
                <span className="text-gray-400 font-semibold block">Verified Positive Factors:</span>
                {p.ai_risk?.positive_factors?.map((f, i) => (
                  <div key={i} className="flex items-start space-x-2 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}

                {p.ai_risk?.risk_factors && p.ai_risk.risk_factors.length > 0 && (
                  <>
                    <span className="text-gray-400 font-semibold block pt-2">Attention Required Factors:</span>
                    {p.ai_risk.risk_factors.map((f, i) => (
                      <div key={i} className="flex items-start space-x-2 text-rose-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* 12. Record Consistency Check */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-bhoomi-border/60 pb-2">
                <FileCheck className="w-3.5 h-3.5" /> Cross-Department Verification Matrix
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(p.cross_dept_verification || {}).map(([key, val]) => (
                  <div key={key} className="p-2 rounded-lg bg-bhoomi-card border border-bhoomi-border/50 flex justify-between items-center">
                    <span className="text-gray-400 capitalize">{key.replace('_', ' ')}</span>
                    <span className={`font-bold text-[11px] ${val === 'Matched' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {val === 'Matched' ? '✓ Matched' : `⚠ ${val}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'TIMELINE' && (
          <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-4 animate-in fade-in duration-200">
            {/* 13. Timeline */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-bhoomi-border/60 pb-2">
              <History className="w-3.5 h-3.5" /> Land Parcel History Timeline
            </h3>

            <div className="relative border-l-2 border-emerald-500/30 ml-3 space-y-5 py-1">
              {p.timeline?.map((item, idx) => (
                <div key={idx} className="relative pl-6 space-y-1">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-bhoomi-dark border-2 border-emerald-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {item.year}
                    </span>
                    <span className="text-[10px] text-gray-400">{item.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'DOCS' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 14. Documents */}
            <div className="p-4 rounded-xl bg-bhoomi-dark/80 border border-bhoomi-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-bhoomi-border/60 pb-2">
                <FileText className="w-3.5 h-3.5" /> Available Documents & Certificates
              </h3>

              <div className="space-y-2">
                {p.documents?.map(doc => (
                  <div key={doc.doc_id} className="p-3 rounded-xl bg-bhoomi-card border border-bhoomi-border flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{doc.name}</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">✓ {doc.status}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{doc.type} • Issued: {doc.date}</p>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setSelectedDocPreview(doc.name)}
                        className="p-1.5 text-emerald-400 hover:text-white rounded-lg hover:bg-bhoomi-hover transition-colors"
                        title="View Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Downloading placeholder file for ${doc.name}...`)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-bhoomi-hover transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 15. Contextual AI Assistant Drawer Modal */}
      {showAiChat && (
        <div className="absolute inset-0 z-50 bg-bhoomi-dark/95 backdrop-blur-2xl p-4 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-bhoomi-border pb-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm text-white">Ask AI About Land ({p.ulpin})</h3>
                <p className="text-[10px] text-gray-400">Answers contextually based strictly on this parcel's data</p>
              </div>
            </div>
            <button onClick={() => setShowAiChat(false)} className="text-gray-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto my-3 space-y-3 p-2 bg-bhoomi-card/50 rounded-xl border border-bhoomi-border/50 text-xs">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                    : 'bg-bhoomi-dark border border-bhoomi-border text-gray-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              'Who owns this land?',
              'How large is this parcel?',
              'Is this land residential?',
              'Are there any detected risks?'
            ].map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendAiQuery(qp)}
                className="text-[10px] bg-bhoomi-dark hover:bg-bhoomi-hover text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendAiQuery()}
              placeholder="Ask AI about owner, zoning, area, risk..."
              className="flex-1 bg-bhoomi-card text-xs text-white placeholder-gray-500 px-3 py-2 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={() => handleSendAiQuery()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* 20. Land Intelligence Report Summary Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-bhoomi-card border border-bhoomi-border rounded-2xl shadow-2xl p-6 space-y-4 text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-bhoomi-border pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base font-mono">LAND PARCEL INTELLIGENCE REPORT</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-bhoomi-dark border border-bhoomi-border grid grid-cols-2 gap-2">
                <div><span className="text-gray-400 block text-[10px]">ULPIN / Parcel:</span><span className="font-bold text-emerald-400 font-mono">{p.ulpin}</span></div>
                <div><span className="text-gray-400 block text-[10px]">Survey No:</span><span className="font-bold text-white">{p.survey_number}</span></div>
                <div><span className="text-gray-400 block text-[10px]">Total Area:</span><span className="font-bold text-white">{p.area_acres} Acres</span></div>
                <div><span className="text-gray-400 block text-[10px]">Current Land Use:</span><span className="font-bold text-white">{p.land_type}</span></div>
              </div>

              <div className="p-3 rounded-xl bg-bhoomi-dark border border-bhoomi-border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Record Consistency Score:</span>
                  <span className="font-bold text-emerald-400">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Risk Assessment:</span>
                  <span className={`font-bold ${p.risk_level === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {p.risk_score} / 100 ({p.risk_level})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recent Spatial Change:</span>
                  <span className="font-semibold text-amber-300">{p.change_detection?.detected_changes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Overall Status:</span>
                  <span className="font-bold text-emerald-400">✓ Suitable for further officer verification</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300">
                ⚠ <strong>Demo / Prototype Analysis:</strong> This report is generated for SIH26014 prototype demonstration and is not an official legal certification.
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => alert(`Downloading PDF Intelligence Report for ${p.ulpin}...`)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF Summary
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 bg-bhoomi-dark hover:bg-bhoomi-hover text-gray-300 font-semibold text-xs py-2.5 rounded-xl border border-bhoomi-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Placeholder Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-bhoomi-card border border-bhoomi-border rounded-2xl shadow-2xl p-5 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-bhoomi-border pb-2">
              <h3 className="font-bold text-sm text-emerald-400">{selectedDocPreview}</h3>
              <button onClick={() => setSelectedDocPreview(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 rounded-xl bg-bhoomi-dark border border-bhoomi-border flex flex-col items-center justify-center space-y-2 text-center text-xs">
              <FileCheck className="w-10 h-10 text-emerald-400 animate-pulse" />
              <h4 className="font-bold text-white">Official Record Placeholder</h4>
              <p className="text-gray-400 text-[11px]">
                Verified under Tamil Nadu Digital Land Records System for ULPIN: <span className="font-mono text-emerald-300">{p.ulpin}</span>.
              </p>
            </div>

            <button
              onClick={() => setSelectedDocPreview(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
