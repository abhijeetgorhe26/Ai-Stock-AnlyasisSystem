'use client';

import React, { useState } from 'react';
import {
  Table as TableIcon,
  Code,
  Copy,
  Check,
  Search,
  Key,
  ShieldCheck,
  Clock,
  User,
  Sparkles,
  Lock,
} from 'lucide-react';
import { formatJwtClaims, JWTPayloadClaim } from '../auth/jwt';

interface PayloadTableProps {
  payload: Record<string, any> | null;
  rawToken?: string | null;
}

export default function PayloadTable({ payload, rawToken }: PayloadTableProps) {
  const [activeTab, setActiveTab] = useState<'table' | 'raw'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const claims: JWTPayloadClaim[] = formatJwtClaims(payload);

  const filteredClaims = claims.filter(
    (c) =>
      c.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.formattedValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string, type: 'token' | 'json') => {
    navigator.clipboard.writeText(text);
    if (type === 'token') {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  if (!payload) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
        <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Active JWT Payload</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          Please log in to inspect your session payload claims and security tokens.
        </p>
      </div>
    );
  }

  // Calculate session expiry countdown if `exp` claim exists
  const expClaim = payload.exp;
  let remainingTimeStr = 'N/A';
  if (typeof expClaim === 'number') {
    const diffSec = Math.max(0, expClaim - Math.floor(Date.now() / 1000));
    const mins = Math.floor(diffSec / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      remainingTimeStr = `${hours}h ${mins % 60}m remaining`;
    } else {
      remainingTimeStr = `${mins}m ${diffSec % 60}s remaining`;
    }
  }

  return (
    <div className="space-y-6">
      {/* ─── Top Stats Bar ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Claims */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Claims</span>
            <div className="text-2xl font-black text-slate-900">{claims.length} fields</div>
          </div>
        </div>

        {/* Card 2: User Subject */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="truncate">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Authenticated Email</span>
            <div className="text-base font-bold text-slate-900 truncate">
              {payload.email || payload.sub || 'User Session'}
            </div>
          </div>
        </div>

        {/* Card 3: Session Expiry */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Token Duration</span>
            <div className="text-base font-bold text-emerald-700">{remainingTimeStr}</div>
          </div>
        </div>

        {/* Card 4: Security Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Auth Mechanism</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                JWT Cookie Auth
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Container Card ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Header toolbar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Decoded JWT Payload Claims</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspecting active authentication payload keys and session attributes
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            {activeTab === 'table' && (
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter payload claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
              </div>
            )}

            {/* View Mode Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/70 text-slate-600 text-xs font-medium">
              <button
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'table' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Structured Table</span>
              </button>

              <button
                onClick={() => setActiveTab('raw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'raw' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── TAB 1: Structured Table View ──────────────────────────────────── */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Claim Key</th>
                  <th className="py-3.5 px-6">Decoded Value</th>
                  <th className="py-3.5 px-6">Data Type</th>
                  <th className="py-3.5 px-6">Category & Description</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {filteredClaims.length > 0 ? (
                  filteredClaims.map((claim) => (
                    <tr key={claim.key} className="hover:bg-blue-50/30 transition">
                      {/* Claim Key */}
                      <td className="py-4 px-6 font-mono font-bold text-slate-900 text-sm">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 text-slate-800">
                          <span>{claim.key}</span>
                        </div>
                      </td>

                      {/* Decoded Value */}
                      <td className="py-4 px-6 max-w-xs font-mono font-medium text-slate-800 break-all">
                        {claim.formattedValue}
                      </td>

                      {/* Data Type */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {claim.type}
                        </span>
                      </td>

                      {/* Category & Description */}
                      <td className="py-4 px-6 max-w-sm">
                        <div className="text-slate-900 font-medium text-xs mb-0.5">{claim.category}</div>
                        <div className="text-slate-500 text-[11px] leading-snug">{claim.description}</div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6 text-right">
                        {claim.statusBadge ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              claim.statusBadge.variant === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : claim.statusBadge.variant === 'info'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : claim.statusBadge.variant === 'warning'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : claim.statusBadge.variant === 'purple'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {claim.statusBadge.label}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                      No claims match your search term "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── TAB 2: Raw JSON View ─────────────────────────────────────────── */}
        {activeTab === 'raw' && (
          <div className="p-6 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-xs font-sans">JSON Representation</span>
              <button
                onClick={() => copyToClipboard(JSON.stringify(payload, null, 2), 'json')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="text-emerald-400 leading-relaxed overflow-x-auto p-4 rounded-xl bg-slate-900 border border-slate-800">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}

        {/* Raw Token Footer Bar */}
        {rawToken && (
          <div className="p-4 bg-slate-900 text-slate-300 text-xs font-mono border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate w-full sm:w-auto">
              <span className="text-slate-400 font-sans font-semibold shrink-0 uppercase text-[10px] tracking-wider bg-slate-800 px-2 py-0.5 rounded">
                Raw Token:
              </span>
              <span className="text-slate-400 truncate max-w-md">{rawToken}</span>
            </div>
            <button
              onClick={() => copyToClipboard(rawToken, 'token')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans shrink-0 transition"
            >
              {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedToken ? 'Copied!' : 'Copy Bearer Token'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
