import { API_BASE_URL, BACKEND_URL } from '../lib/constants';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  is_verified?: boolean;
  google_id?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  user?: AuthUser;
}

export interface TickerData {
  symbol: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export interface StockQuoteData {
  id: string;
  symbol: string;
  rawSymbol: string;
  name: string;
  price: string;
  rawPrice: number;
  change: string;
  changePercent: string;
  isPositive: boolean;
  volume: string;
  high?: number;
  low?: number;
  currency?: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function registerUser(email: string, password: string, name: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

export async function logoutUser(): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await response.json();
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export function getGoogleAuthUrl(): string {
  return `${BACKEND_URL}/api/auth/google`;
}

// ─── Yahoo Finance Stock APIs ─────────────────────────────────────────
export async function fetchMarketIndices(): Promise<TickerData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/stocks/indices`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch market indices', err);
    return [];
  }
}

export async function fetchStockQuotes(symbols?: string): Promise<StockQuoteData[]> {
  try {
    const query = symbols ? `?symbols=${encodeURIComponent(symbols)}` : '';
    const res = await fetch(`${API_BASE_URL}/stocks/quotes${query}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Failed to fetch stock quotes', err);
    return [];
  }
}
