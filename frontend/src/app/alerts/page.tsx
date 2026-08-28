'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldCheck, CheckCircle2, UserCheck, ArrowUpRight, Flame } from 'lucide-react';
import { fetchAlerts, updateAlertStatus } from '../../lib/api';
import { Alert } from '../../types';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    fetchAlerts()
      .then(data => setAlerts(data))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (alertId: string, newStatus: string) => {
    await updateAlertStatus(alertId, newStatus, `Officer signed off status as ${newStatus}`, 'SDM Officer R. Sharma');
    setAlerts(prev => prev.map(a => a.alert_id === alertId ? { ...a, status: newStatus } : a));
  };

  const filtered = alerts.filter(a => {
    if (selectedSeverity !== 'ALL' && a.risk_level !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && a.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bhoomi-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts & Incident Management</h1>
          <p className="text-xs text-gray-400">Government officer verification queue for AI-flagged land changes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-bhoomi-border flex items-center gap-4">
        <select
          value={selectedSeverity}
          onChange={e => setSelectedSeverity(e.target.value)}
          className="bg-bhoomi-dark text-xs text-gray-200 px-3 py-2 rounded-xl border border-bhoomi-border focus:outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="HIGH">HIGH Priority</option>
          <option value="MEDIUM">MEDIUM Priority</option>
          <option value="LOW">LOW Priority</option>
        </select>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="bg-bhoomi-dark text-xs text-gray-200 px-3 py-2 rounded-xl border border-bhoomi-border focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="NEW">NEW</option>
          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      {/* Alerts Table */}
      <div className="glass-panel rounded-2xl border border-bhoomi-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-bhoomi-border text-gray-400 font-semibold uppercase text-[10px] bg-bhoomi-dark/50">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Survey No</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Violation Type</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Officer Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bhoomi-border/50">
              {filtered.map(a => (
                <tr key={a.alert_id} className="hover:bg-bhoomi-hover/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{a.alert_id}</td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{a.survey_number}</td>
                  <td className="py-3 px-4 text-gray-300">{a.village}</td>
                  <td className="py-3 px-4 text-gray-200">{a.detection_type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.risk_level === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {a.risk_score}/100 ({a.risk_level})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-bhoomi-dark text-blue-400 border border-bhoomi-border font-mono text-[10px]">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleStatusChange(a.alert_id, 'VERIFIED')}
                      className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-500 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30 transition-colors"
                    >
                      Verify
                    </button>
                    <Link
                      href={`/parcels/${a.parcel_id}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-bhoomi-hover hover:bg-bhoomi-border text-white text-[11px] transition-colors"
                    >
                      <span>Inspect</span>
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
