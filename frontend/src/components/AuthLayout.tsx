import React from 'react';
import { Cpu, ShieldCheck, TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* ─── LEFT COLUMN: Brand Hero & Value Proposition ────────────────────── */}
      <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 relative overflow-hidden">
        {/* Subtle background glow decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            AITrade<span className="text-blue-600">.</span>
          </span>
        </div>

        {/* Hero Copy & Features */}
        <div className="my-12 lg:my-auto max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
            Invest smartly with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              AI-driven insights.
            </span>
          </h1>

          <p className="text-lg text-slate-600 font-normal leading-relaxed mb-10">
            Join the next generation of traders to ahead better traders and grading analytics with automated real-time signals.
          </p>

          {/* Feature Highlights List */}
          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 border border-slate-200/60">
                <Cpu className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-0.5">
                  AI Pattern Detection
                </h3>
                <p className="text-sm text-slate-500 leading-snug">
                  Analyzes complex data to deliver AI pattern results and predictive market experiences.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 border border-slate-200/60">
                <ShieldCheck className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="font-bold text-slate-900 text-base">
                    Risk-Free Paper Trading
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-200/80 text-slate-800 border border-slate-300/50">
                    ₹10,00,000
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-snug">
                  Simulated virtual capital to test and optimize strategies without financial risk.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer copyright */}
        <div className="pt-6 border-t border-slate-200/60 text-xs text-slate-400 font-medium">
          © 2026 AITrade Platform in active development. All rights reserved.
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Form Card Section ──────────────────────────────── */}
      <div className="lg:col-span-5 bg-[#F9F8F3] flex items-center justify-center p-6 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-200/70">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
