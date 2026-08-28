'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { History, Calendar, Sparkles, Layers, ArrowUpRight } from 'lucide-react';

export default function TimelinePage() {
  const [selectedYear, setSelectedYear] = useState('2026');

  const historyData = [
    {
      year: '2024',
      date: '15 Jan 2024',
      status: 'Agricultural Baseline',
      surveyNo: '102/3A (P-00102)',
      details: 'Lush green agricultural land record verified. No permanent structures observed.',
      image: '/static/imagery/demo_p00102_2025_before.png',
      badge: 'VERIFIED'
    },
    {
      year: '2025',
      date: '20 Jan 2025',
      status: 'Regular Seasonal Crop Growth',
      surveyNo: '102/3A (P-00102)',
      details: 'Annual satellite check confirmed active crop farming. No land-use violations.',
      image: '/static/imagery/demo_p00102_2025_before.png',
      badge: 'NORMAL'
    },
    {
      year: '2026',
      date: '28 Feb 2026',
      status: 'Potential Construction Flagged',
      surveyNo: '102/3A (P-00102)',
      details: 'High-res drone survey detected 420 sqm concrete building structure erected on agricultural field.',
      image: '/static/imagery/demo_p00102_2026_after.png',
      badge: 'HIGH RISK'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-bhoomi-border pb-4">
        <div className="flex items-center space-x-2">
          <History className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Historical Land Transformation Timeline</h1>
        </div>
        <p className="text-xs text-gray-400">Track multi-year aerial drone imagery changes and legal land monitoring audit trails</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Events List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {historyData.map((item, idx) => (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-2xl border transition-all ${
                selectedYear === item.year ? 'border-emerald-500/60 bg-emerald-950/10' : 'border-bhoomi-border'
              }`}
            >
              <div className="flex items-center justify-between border-b border-bhoomi-border pb-3 mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold font-mono text-emerald-400">{item.year}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  item.badge === 'HIGH RISK' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {item.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="relative h-28 rounded-xl overflow-hidden border border-bhoomi-border bg-bhoomi-dark">
                  <img src={item.image} alt={item.year} className="w-full h-full object-cover" />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <h4 className="font-bold text-sm text-white">{item.status}</h4>
                  <p className="text-xs text-gray-300">{item.details}</p>
                  <div className="pt-2">
                    <Link
                      href="/parcels/P-00102"
                      className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      Inspect Parcel 102/3A <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Summary Box */}
        <div className="glass-panel p-5 rounded-2xl border border-bhoomi-border space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-bhoomi-border pb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Land Transformation Insights
          </h3>
          <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
            <p>• Baseline 2024 aerial survey confirmed active agricultural status.</p>
            <p>• 2026 drone scan flagged unauthorized building foundation without recorded revenue conversion permit.</p>
            <p>• Audit history permanently recorded for SDM office verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
