'use client';

import React from 'react';
import { ChevronRight, TrendingUp, Sparkles } from 'lucide-react';

export interface StockCardItem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  logoBg: string;
  logoText: string;
}

const stocksData: StockCardItem[] = [
  {
    id: '1',
    name: 'Jindal Drilling',
    symbol: 'JINDALDRILL',
    price: '₹651.15',
    change: '+64.95',
    changePercent: '+11.08%',
    isPositive: true,
    logoBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    logoText: 'JD',
  },
  {
    id: '2',
    name: 'Molbio Diagnostics',
    symbol: 'MOLBIO',
    price: '₹1,110.90',
    change: '+69.20',
    changePercent: '+6.64%',
    isPositive: true,
    logoBg: 'bg-rose-100 text-rose-800 border-rose-200',
    logoText: 'MD',
  },
  {
    id: '3',
    name: 'Cupid Limited',
    symbol: 'CUPID',
    price: '₹284.03',
    change: '+16.71',
    changePercent: '+6.25%',
    isPositive: true,
    logoBg: 'bg-red-100 text-red-800 border-red-200',
    logoText: 'CL',
  },
  {
    id: '4',
    name: 'Netweb Technologies',
    symbol: 'NETWEB',
    price: '₹5,354.50',
    change: '+142.10',
    changePercent: '+2.73%',
    isPositive: true,
    logoBg: 'bg-blue-100 text-blue-800 border-blue-200',
    logoText: 'NT',
  },
];

export default function MostTradedStocks() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Most traded stocks</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Live AI Tracked
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stocksData.map((stock) => (
          <div
            key={stock.id}
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition duration-200 cursor-pointer flex flex-col justify-between"
          >
            {/* Top Row: Logo Badge */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm border ${stock.logoBg}`}
              >
                {stock.logoText}
              </div>
              <Sparkles className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition" />
            </div>

            {/* Middle Row: Stock Name & Symbol */}
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition line-clamp-1">
                {stock.name}
              </h3>
              <span className="text-xs font-medium text-slate-400 font-mono">{stock.symbol}</span>
            </div>

            {/* Bottom Row: Price & % Change */}
            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-slate-900 font-mono">{stock.price}</span>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                  stock.isPositive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}
              >
                {stock.change} ({stock.changePercent})
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1">
        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition">
          <span>See more stocks</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
