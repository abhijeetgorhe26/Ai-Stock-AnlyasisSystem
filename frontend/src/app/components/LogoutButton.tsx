'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { API_BASE_URL } from '../../lib/constants';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition"
    >
      <LogOut className="w-4 h-4" />
      <span>Log Out</span>
    </button>
  );
}
