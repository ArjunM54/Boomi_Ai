'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  FileSpreadsheet,
  ScanEye,
  AlertTriangle,
  FileText,
  History,
  Settings,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'OFFICER', 'CITIZEN'] },
    { label: 'GIS Map', href: '/map', icon: MapPin, roles: ['ADMIN', 'OFFICER', 'CITIZEN'] },
    { label: 'Parcels', href: '/parcels', icon: FileSpreadsheet, roles: ['ADMIN', 'OFFICER', 'CITIZEN'] },
    { label: 'AI Analysis', href: '/ai-analysis', icon: ScanEye, roles: ['ADMIN', 'OFFICER'] },
    { label: 'Alerts', href: '/alerts', icon: AlertTriangle, roles: ['ADMIN', 'OFFICER'], badge: '3' },
    { label: 'Reports', href: '/reports', icon: FileText, roles: ['ADMIN', 'OFFICER', 'CITIZEN'] },
    { label: 'Timeline', href: '/timeline', icon: History, roles: ['ADMIN', 'OFFICER', 'CITIZEN'] },
    { label: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN'] },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <aside className="w-64 bg-bhoomi-card border-r border-bhoomi-border h-[calc(100vh-4rem)] flex flex-col justify-between p-3 sticky top-16 hidden md:flex">
      <nav className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          Platform Navigation
        </div>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-bhoomi-hover'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Target Demo Parcel Card */}
      <div className="p-3 rounded-xl bg-gradient-to-b from-bhoomi-dark to-emerald-950/40 border border-emerald-500/20 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>Demo Focus Parcel</span>
        </div>
        <p className="text-xs text-gray-300">
          Survey No: <span className="font-mono text-white font-bold">102/3A</span> (P-00102)
        </p>
        <div className="text-[11px] text-gray-400 flex items-center justify-between">
          <span>Village: Rampur</span>
          <span className="text-rose-400 font-bold bg-rose-500/20 px-1.5 py-0.5 rounded text-[10px]">HIGH RISK</span>
        </div>
        <Link
          href="/parcels/P-00102"
          className="block text-center text-xs bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 py-1.5 rounded-lg transition-colors font-medium"
        >
          Inspect Demo Parcel →
        </Link>
      </div>
    </aside>
  );
};
