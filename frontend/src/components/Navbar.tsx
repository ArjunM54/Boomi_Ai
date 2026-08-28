'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Search, UserCheck, Play, Bell, Layers, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onStartDemoWizard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange, onStartDemoWizard }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/parcels?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-bhoomi-card border-b border-bhoomi-border px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Emblem */}
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-bhoomi-dark rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-white font-mono">Bhoomi<span className="text-emerald-400">AI</span></span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-medium rounded border border-emerald-500/30">SIH26014</span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">AI-Powered GIS Intelligence for Smarter Land Governance</p>
          </div>
        </Link>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-xs w-full relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Survey No (e.g. 102/3A) or Parcel ID..."
          className="w-full bg-bhoomi-dark text-sm text-gray-200 placeholder-gray-500 pl-9 pr-4 py-1.5 rounded-lg border border-bhoomi-border focus:border-emerald-500 focus:outline-none transition-colors"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
      </form>

      {/* Action Controls & Role Switcher */}
      <div className="flex items-center space-x-3">
        {/* Presentation Demo Mode CTA */}
        <button
          onClick={onStartDemoWizard}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg shadow-orange-500/20 transition-all transform hover:scale-105 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Hackathon Demo Mode</span>
        </button>

        {/* Role Selector */}
        <div className="hidden lg:flex items-center bg-bhoomi-dark p-1 rounded-lg border border-bhoomi-border text-xs">
          <span className="px-2 text-gray-400 font-medium flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Role:
          </span>
          {(['ADMIN', 'OFFICER', 'CITIZEN'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                currentRole === r
                  ? 'bg-emerald-500 text-bhoomi-dark shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
