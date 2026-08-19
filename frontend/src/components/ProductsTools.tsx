'use client';

import React from 'react';
import { Megaphone, Layers, BarChart2, Cpu, ArrowUpRight } from 'lucide-react';

export interface ProductToolItem {
  id: string;
  name: string;
  badge?: string;
  badgeVariant?: 'green' | 'blue';
  icon: React.ReactNode;
}

const products: ProductToolItem[] = [
  {
    id: 'ipo',
    name: 'IPO',
    badge: '9 open',
    badgeVariant: 'green',
    icon: <Megaphone className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: 'bonds',
    name: 'Bonds',
    badge: '17 open',
    badgeVariant: 'green',
    icon: <Layers className="w-5 h-5 text-teal-600" />,
  },
  {
    id: 'etfs',
    name: 'ETFs',
    icon: <BarChart2 className="w-5 h-5 text-blue-600" />,
  },
  {
    id: 'screener',
    name: 'AI Intraday Screener',
    badge: 'AI Signals',
    badgeVariant: 'blue',
    icon: <Cpu className="w-5 h-5 text-indigo-600" />,
  },
];

export default function ProductsTools() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Products & Tools</h2>

      <div className="divide-y divide-slate-100">
        {products.map((item) => (
          <div
            key={item.id}
            className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/80 group-hover:border-blue-300 transition">
                {item.icon}
              </div>
              <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition">
                {item.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {item.badge && (
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    item.badgeVariant === 'blue'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
