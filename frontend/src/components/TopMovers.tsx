'use client';

import React, { useState } from 'react';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

export interface MoverStock {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  volume: string;
  isPositive: boolean;
  type: 'gainers' | 'losers' | 'volume';
  logoText: string;
  sparklinePath: string;
}

const moversData: MoverStock[] = [
  {
    id: '1',
    name: 'Bosch Limited',
    symbol: 'BOSCHLTD',
    price: '₹48,730.00',
    change: '+1,760.00',
    changePercent: '+3.75%',
    volume: '93,891',
    isPositive: true,
    type: 'gainers',
    logoText: 'B',
    sparklinePath: 'M0 20 Q 25 15, 50 18 T 100 8 T 150 4 T 200 2',
  },
  {
    id: '2',
    name: 'Torrent Pharma',
    symbol: 'TORNTPHARM',
    price: '₹4,971.00',
    change: '+71.00',
    changePercent: '+1.45%',
    volume: '4,26,573',
    isPositive: true,
    type: 'gainers',
    logoText: 'TP',
    sparklinePath: 'M0 18 Q 30 10, 60 14 T 120 8 T 180 5 T 200 3',
  },
  {
    id: '3',
    name: 'Tata Consultancy Services',
    symbol: 'TCS',
    price: '₹4,215.50',
    change: '+84.20',
    changePercent: '+2.04%',
    volume: '12,45,890',
    isPositive: true,
    type: 'gainers',
    logoText: 'TCS',
    sparklinePath: 'M0 22 Q 40 18, 80 12 T 140 8 T 200 4',
  },
  {
    id: '4',
    name: 'Infosys Limited',
    symbol: 'INFY',
    price: '₹1,842.10',
    change: '-38.40',
    changePercent: '-2.04%',
    volume: '28,14,300',
    isPositive: false,
    type: 'losers',
    logoText: 'INF',
    sparklinePath: 'M0 4 Q 40 8, 80 14 T 140 18 T 200 24',
  },
  {
    id: '5',
    name: 'Reliance Industries',
    symbol: 'RELIANCE',
    price: '₹2,980.00',
    change: '-45.15',
    changePercent: '-1.49%',
    volume: '34,90,120',
    isPositive: false,
    type: 'losers',
    logoText: 'RIL',
    sparklinePath: 'M0 5 Q 30 12, 70 15 T 150 20 T 200 25',
  },
  {
    id: '6',
    name: 'HDFC Bank',
    symbol: 'HDFCBANK',
    price: '₹1,654.80',
    change: '+12.40',
    changePercent: '+0.75%',
    volume: '85,42,100',
    isPositive: true,
    type: 'volume',
    logoText: 'HDFC',
    sparklinePath: 'M0 16 Q 50 14, 100 10 T 160 8 T 200 6',
  },
];

export default function TopMovers() {
  const [filter, setFilter] = useState<'gainers' | 'losers' | 'volume'>('gainers');

  const filteredStocks = moversData.filter((item) => item.type === filter);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Top movers today</h2>

        {/* Filter Pills matching Groww */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('gainers')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'gainers'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            Gainers
          </button>

          <button
            onClick={() => setFilter('losers')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'losers'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            Losers
          </button>

          <button
            onClick={() => setFilter('volume')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'volume'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            Volume shockers
          </button>

          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-200/60 transition">
            <span>NIFTY 100</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Stock Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4 text-center">Trend (1D)</th>
              <th className="py-3 px-4 text-right">Market price (1D)</th>
              <th className="py-3 px-4 text-right">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStocks.map((stock) => (
              <tr key={stock.id} className="hover:bg-slate-50/80 transition cursor-pointer group">
                {/* Company info */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0 group-hover:border-blue-300 transition">
                      {stock.logoText}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                        {stock.name}
                      </div>
                      <div className="text-slate-400 text-[11px] font-mono">{stock.symbol}</div>
                    </div>
                  </div>
                </td>

                {/* SVG Sparkline chart */}
                <td className="py-4 px-4 text-center">
                  <div className="inline-block w-28 h-7">
                    <svg className="w-full h-full" viewBox="0 0 200 30" fill="none">
                      <path
                        d={stock.sparklinePath}
                        stroke={stock.isPositive ? '#10b981' : '#f43f5e'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </td>

                {/* Market Price & Change */}
                <td className="py-4 px-4 text-right font-mono">
                  <div className="font-bold text-slate-900 text-sm">{stock.price}</div>
                  <div
                    className={`text-[11px] font-semibold ${
                      stock.isPositive ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {stock.change} ({stock.changePercent})
                  </div>
                </td>

                {/* Volume */}
                <td className="py-4 px-4 text-right font-mono text-slate-600 font-medium">
                  {stock.volume}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
