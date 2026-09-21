'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { signInWithEmail, signOut, getCurrentSession, supabaseUserToCRMUser } from '@/lib/auth';
import { ACTIVE_USER_STORAGE_KEY, saveCRMStore, getCRMStore } from '@/lib/crmStore';
import type { CRMUser } from '@/lib/types';

interface AuthContextValue {
  user: CRMUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
  login: async () => false,
  logout: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CRMUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync supabase auth user into crmStore as a valid user without overriding the workstation's active user selection
  const syncToCRMStore = useCallback((crmUser: CRMUser | null) => {
    if (!crmUser) return;
    const store = getCRMStore();
    // Ensure this user exists in the store's users array
    const existsIndex = store.users?.findIndex(u => u.id === crmUser.id);
    let users = store.users || [];
    if (existsIndex === -1 || existsIndex === undefined) {
      users = [crmUser, ...users];
    } else {
      users = users.map(u => u.id === crmUser.id ? { ...u, ...crmUser } : u);
    }

    // Preserve existing active user from dedicated storage key or store
    const existingActiveId = (typeof window !== 'undefined' && localStorage.getItem(ACTIVE_USER_STORAGE_KEY)) || store.activeUserId;
    const activeUserId = (existingActiveId && users.some(u => u.id === existingActiveId))
      ? existingActiveId
      : crmUser.id;

    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, activeUserId);
    }

    saveCRMStore({ ...store, users, activeUserId });
  }, []);

  // Bootstrap: check existing Supabase session
  useEffect(() => {
    let mounted = true;
    getCurrentSession().then(crmUser => {
      if (!mounted) return;
      if (crmUser) {
        syncToCRMStore(crmUser);
        setUser(crmUser);
      }
      setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    // Listen for auth state changes (tab focus, token refresh, sign out)
    const supabase = getSupabaseClient();
    let unsub: (() => void) | undefined;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          const crmUser = supabaseUserToCRMUser(session.user);
          syncToCRMStore(crmUser);
          setUser(crmUser);
        } else {
          setUser(null);
        }
      });
      unsub = data.subscription.unsubscribe;
    }

    return () => {
      mounted = false;
      unsub?.();
    };
  }, [syncToCRMStore]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    const { user: crmUser, error: err } = await signInWithEmail(email, password);
    setLoading(false);
    if (err || !crmUser) {
      setError(err || 'Login failed.');
      return false;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, crmUser.id);
    }
    syncToCRMStore(crmUser);
    setUser(crmUser);
    return true;
  }, [syncToCRMStore]);

  const logout = useCallback(async () => {
    await signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
