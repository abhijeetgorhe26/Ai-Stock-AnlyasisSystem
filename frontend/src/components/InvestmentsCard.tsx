'use client';

import React from 'react';
import { Wallet, PieChart, Plus } from 'lucide-react';

export default function InvestmentsCard() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Your investments</h2>
      </div>

      {/* Empty State / Paper Trading Summary */}
      <div className="py-8 px-4 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50 flex flex-col items-center justify-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
          <Wallet className="w-8 h-8 stroke-[1.8]" />
        </div>

        <div>
          <h3 className="font-bold text-slate-800 text-sm">You haven't invested yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            Start paper trading with ₹10,00,000 virtual capital to build your portfolio.
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition active:scale-95">
          <Plus className="w-4 h-4" />
          <span>Explore Stocks to Invest</span>
        </button>
      </div>
    </div>
  );
}
