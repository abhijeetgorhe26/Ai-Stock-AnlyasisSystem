'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Bell,
  Sliders,
  LogOut,
  User,
  Shield,
  Key,
} from 'lucide-react';
import LogoutButton from '../app/components/LogoutButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userIdentifier: string;
}

export default function Navbar({ activeTab, setActiveTab, userIdentifier }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [category, setCategory] = useState<'stocks' | 'fno' | 'mf'>('stocks');

  const navItems = [
    { id: 'explore', label: 'Explore' },
    { id: 'holdings', label: 'Holdings' },
    { id: 'positions', label: 'Positions' },
    { id: 'orders', label: 'Orders' },
    { id: 'watchlist', label: 'Watchlist' },
    { id: 'payload', label: 'JWT Payload Claims', isBadge: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* ─── Top Level Navigation Bar ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Main Category Tabs */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              AITrade<span className="text-emerald-500">.</span>
            </span>
          </div>

          {/* Primary Product Tabs (Groww style) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
            <button
              onClick={() => setCategory('stocks')}
              className={`pb-1 transition ${category === 'stocks' ? 'text-slate-900 border-b-2 border-emerald-500 font-extrabold' : 'hover:text-slate-900'}`}
            >
              Stocks
            </button>
            <button
              onClick={() => setCategory('fno')}
              className={`pb-1 transition ${category === 'fno' ? 'text-slate-900 border-b-2 border-emerald-500 font-extrabold' : 'hover:text-slate-900'}`}
            >
              F&O
            </button>
            <button
              onClick={() => setCategory('mf')}
              className={`pb-1 transition ${category === 'mf' ? 'text-slate-900 border-b-2 border-emerald-500 font-extrabold' : 'hover:text-slate-900'}`}
            >
              Mutual Funds
            </button>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Groww... (e.g. NIFTY, TCS, Infosys)"
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-100/80 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-500">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Controls: Notifications & Profile */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition relative">
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 border-2 border-white" />
          </button>

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-sm transition"
            >
              {userIdentifier.slice(0, 1).toUpperCase()}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="text-sm font-bold text-slate-900 truncate">{userIdentifier}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    <span>Authenticated User</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('payload');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Key className="w-4 h-4 text-blue-600" />
                    <span>JWT Claims & Payload</span>
                  </button>
                </div>

                <div className="p-2 border-t border-slate-100">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Sub Header Sub-Navigation Tabs ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-slate-100">
        <nav className="flex items-center gap-6 overflow-x-auto text-xs font-semibold text-slate-600 py-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative py-1 transition whitespace-nowrap ${
                activeTab === item.id
                  ? 'text-slate-900 font-extrabold'
                  : 'hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {item.label}
                {item.isBadge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                    Claims
                  </span>
                )}
              </span>
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Terminal Button */}
        <div className="hidden sm:flex items-center">
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-300/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-2xs">
            <Sliders className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>
        </div>
      </div>
    </header>
  );
}
