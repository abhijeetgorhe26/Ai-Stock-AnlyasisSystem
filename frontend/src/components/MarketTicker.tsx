'use client';

import React, { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';
import { fetchMarketIndices, TickerData } from '../services/api';

const defaultTickers: TickerData[] = [
  { symbol: 'NIFTY', value: '24,154.90', change: '-132.75', changePercent: '-0.55%', isPositive: false },
  { symbol: 'SENSEX', value: '77,235.46', change: '-492.70', changePercent: '-0.63%', isPositive: false },
  { symbol: 'BANKNIFTY', value: '57,262.40', change: '-235.40', changePercent: '-0.41%', isPositive: false },
  { symbol: 'MIDCPNIFTY', value: '14,840.75', change: '-107.85', changePercent: '-0.72%', isPositive: false },
  { symbol: 'FINNIFTY', value: '26,108.00', change: '+85.30', changePercent: '+0.33%', isPositive: true },
];

export default function MarketTicker() {
  const [tickers, setTickers] = useState<TickerData[]>(defaultTickers);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    const liveData = await fetchMarketIndices();
    if (liveData && liveData.length > 0) {
      setTickers(liveData);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white border-b border-slate-200/80 overflow-x-auto py-2.5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 text-xs whitespace-nowrap min-w-max">
        <div className="flex items-center gap-6">
          {tickers.map((item) => (
            <div key={item.symbol} className="flex items-center gap-2 font-medium">
              <span className="font-semibold text-slate-700">{item.symbol}</span>
              <span className="text-slate-900 font-mono font-bold">{item.value}</span>
              <span
                className={`flex items-center text-[11px] font-semibold font-mono ${
                  item.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {item.isPositive ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                {item.change} ({item.changePercent})
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={loadData}
          title="Refresh Yahoo Finance Market Data"
          className="text-slate-400 hover:text-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>
    </div>
  );
}
