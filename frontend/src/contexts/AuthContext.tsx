'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, fetchCurrentUser, logoutUser as logoutUserApi } from '../services/api';
import { parseJwtPayload } from '../auth/jwt';

interface AuthContextType {
  user: AuthUser | null;
  payload: Record<string, any> | null;
  rawToken: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; initialToken?: string | null }> = ({
  children,
  initialToken = null,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [rawToken, setRawToken] = useState<string | null>(initialToken);
  const [payload, setPayload] = useState<Record<string, any> | null>(() => parseJwtPayload(initialToken));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);

      // Try reading token from cookie if accessible client-side
      const tokenFromCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      const tokenToUse = tokenFromCookie || rawToken;
      if (tokenToUse) {
        setRawToken(tokenToUse);
        setPayload(parseJwtPayload(tokenToUse));
      }
    } catch (err) {
      console.error('Failed to load user session', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = async () => {
    try {
      await logoutUserApi();
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setUser(null);
      setPayload(null);
      setRawToken(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, payload, rawToken, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
