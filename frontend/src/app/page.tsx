'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MarketTicker from '../components/MarketTicker';
import MostTradedStocks from '../components/MostTradedStocks';
import TopMovers from '../components/TopMovers';
import InvestmentsCard from '../components/InvestmentsCard';
import ProductsTools from '../components/ProductsTools';
import PayloadTable from '../components/PayloadTable';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Layers, ListFilter, FileText } from 'lucide-react';

export default function HomePage() {
  const { user, payload, rawToken } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('explore');

  const userIdentifier = user?.name || user?.email || payload?.email || payload?.sub || 'Trader';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-800 flex flex-col">
      {/* Groww Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} userIdentifier={userIdentifier} />

      {/* Live Market Indices Ticker Banner */}
      <MarketTicker />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── TAB 1: Explore Dashboard (Groww Design Reference) ───────────────── */}
        {activeTab === 'explore' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (Main Section) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Most Traded Stocks on Groww */}
              <MostTradedStocks />

              {/* Top Movers Today */}
              <TopMovers />
            </div>

            {/* Right Column (Side Panels) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Your Investments Card */}
              <InvestmentsCard />

              {/* Products & Tools */}
              <ProductsTools />
            </div>
          </div>
        )}

        {/* ─── TAB 2: JWT Payload Claims View ─────────────────────────────────── */}
        {activeTab === 'payload' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">JWT Payload Claims Table</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Inspecting active session claims stored in system cookies for user <span className="font-semibold text-slate-800">{userIdentifier}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
              >
                <span>Back to Market Explore</span>
              </button>
            </div>

            <PayloadTable payload={payload} rawToken={rawToken} />
          </div>
        )}

        {/* ─── OTHER TABS: Holdings, Positions, Orders, Watchlist ─────────────── */}
        {activeTab !== 'explore' && activeTab !== 'payload' && (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/90 shadow-sm text-center max-w-2xl mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 mx-auto flex items-center justify-center border border-slate-200">
              <Layers className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab} View</h2>
            <p className="text-xs text-slate-500">
              You currently have no active items under <span className="font-semibold capitalize text-slate-800">{activeTab}</span>. Start trading in Explore mode to build your portfolio.
            </p>
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <span>Explore Market</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
