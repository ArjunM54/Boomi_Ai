'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Bot,
  Send,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  MapPin
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

import { fetchDashboardStats, askAssistant } from '../../lib/api';
import { DashboardStats, Alert } from '../../types';

export default function GovernmentDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // AI Assistant drawer state
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState<string | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAssistantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantQuery.trim()) return;
    setAssistantLoading(true);
    try {
      const res = await askAssistant(assistantQuery);
      setAssistantResponse(res.reply);
    } catch (err) {
      setAssistantResponse("Failed to query assistant.");
    } finally {
      setAssistantLoading(false);
    }
  };

  const landTypeData = stats ? Object.entries(stats.land_type_distribution).map(([name, value]) => ({ name, value })) : [];
  const severityData = stats ? Object.entries(stats.alerts_by_severity).map(([name, value]) => ({ name, value })) : [];
  
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const trendData = [
    { month: 'Jan', changes: 12 },
    { month: 'Feb', changes: 19 },
    { month: 'Mar', changes: 15 },
    { month: 'Apr', changes: 28 },
    { month: 'May', changes: 34 },
    { month: 'Jun', changes: 42 },
    { month: 'Jul', changes: 39 },
    { month: 'Aug', changes: 58 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Officer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bhoomi-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">Government Officer Dashboard</h1>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
              SDM Jaipur Zone
            </span>
          </div>
          <p className="text-xs text-gray-400">Real-time Land Governance Intelligence & AI Incident Monitoring</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/map"
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open GIS Map</span>
          </Link>
          <Link
            href="/ai-analysis"
            className="flex items-center space-x-1.5 bg-bhoomi-hover hover:bg-bhoomi-border text-emerald-400 text-xs font-semibold px-4 py-2 rounded-xl border border-bhoomi-border transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New AI Analysis</span>
          </Link>
        </div>
      </div>

      {/* Row 1: Primary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Total Parcels</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {stats ? stats.total_parcels.toLocaleString() : '12,450'}
          </div>
          <p className="text-[11px] text-gray-500">Monitored GIS vector boundaries</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Surveyed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {stats ? stats.surveyed_parcels.toLocaleString() : '9,820'}
          </div>
          <p className="text-[11px] text-emerald-500/80">78.8% survey completion rate</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Pending Survey</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {stats ? stats.pending_survey.toLocaleString() : '2,630'}
          </div>
          <p className="text-[11px] text-amber-500/80">Scheduled for drone field survey</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Active Alerts</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">
            {stats ? stats.active_alerts : 124}
          </div>
          <p className="text-[11px] text-rose-400/80">Requires officer verification</p>
        </div>
      </div>

      {/* Row 2: Severity Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block">High Priority</span>
            <span className="text-xl font-bold text-rose-400 font-mono">{stats ? stats.high_priority_alerts : 18}</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Medium Priority</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{stats ? stats.medium_priority_alerts : 47}</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-blue-500/30 bg-blue-950/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Under Verification</span>
            <span className="text-xl font-bold text-blue-400 font-mono">{stats ? stats.under_verification_alerts : 31}</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Resolved</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{stats ? stats.resolved_alerts : 28}</span>
          </div>
        </div>
      </div>

      {/* Row 3: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Land Type Distribution Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-4">
          <div className="flex items-center justify-between border-b border-bhoomi-border pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Land Type Classification Distribution
            </h3>
            <span className="text-[11px] text-gray-400">Total Parcels</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={landTypeData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131a2b', borderColor: '#2a364f', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Detected Land Changes Trend Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-4">
          <div className="flex items-center justify-between border-b border-bhoomi-border pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              AI Detected Changes Over Time (2026)
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">+14.2% MoM</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorChanges" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131a2b', borderColor: '#2a364f', color: '#fff', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="changes" stroke="#3B82F6" fillOpacity={1} fill="url(#colorChanges)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Alerts Table + Embedded AI Assistant Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts Table (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-4">
          <div className="flex items-center justify-between border-b border-bhoomi-border pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Recent AI Land Incidents & Alerts
              </h3>
              <p className="text-xs text-gray-400">Click any incident to open parcel detail & officer verification</p>
            </div>
            <Link href="/alerts" className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1">
              View All Alerts <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-bhoomi-border text-gray-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Survey No</th>
                  <th className="py-2.5 px-3">Detection Type</th>
                  <th className="py-2.5 px-3">Village</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bhoomi-border/50">
                {(stats?.recent_alerts || []).map((alert) => (
                  <tr key={alert.alert_id} className="hover:bg-bhoomi-hover/50 transition-colors">
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.risk_level === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {alert.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {alert.survey_number}
                      <span className="text-[10px] text-gray-500 block font-normal">{alert.parcel_id}</span>
                    </td>
                    <td className="py-3 px-3 text-gray-200">{alert.detection_type}</td>
                    <td className="py-3 px-3 text-gray-400">{alert.village}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bhoomi-dark text-blue-400 border border-bhoomi-border">
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/parcels/${alert.parcel_id}`}
                        className="text-xs bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 transition-colors font-medium"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Embedded AI Assistant Drawer (1 col) */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 border-b border-bhoomi-border pb-3">
              <Bot className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm text-white">BhoomiAI Assistant</h3>
                <p className="text-[11px] text-gray-400">Natural language land governance query</p>
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Suggested Queries:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Show high risk parcels",
                  "Which parcels had construction changes?",
                  "Show unresolved alerts",
                  "Summary of today's land changes"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAssistantQuery(q);
                    }}
                    className="text-[11px] bg-bhoomi-dark hover:bg-bhoomi-hover text-gray-300 px-2.5 py-1 rounded-lg border border-bhoomi-border transition-colors text-left"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Response Area */}
            {assistantResponse && (
              <div className="p-3.5 rounded-xl bg-bhoomi-dark border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Analysis Response:</span>
                </div>
                <p className="text-gray-200 whitespace-pre-line leading-relaxed text-[11px]">
                  {assistantResponse}
                </p>
              </div>
            )}
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleAssistantSubmit} className="pt-2 border-t border-bhoomi-border flex gap-2">
            <input
              type="text"
              value={assistantQuery}
              onChange={(e) => setAssistantQuery(e.target.value)}
              placeholder="Ask BhoomiAI (e.g. Show high-risk parcels)..."
              className="flex-1 bg-bhoomi-dark text-xs text-white placeholder-gray-500 px-3 py-2 rounded-xl border border-bhoomi-border focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={assistantLoading}
              className="bg-emerald-500 hover:bg-emerald-400 text-bhoomi-dark font-bold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
