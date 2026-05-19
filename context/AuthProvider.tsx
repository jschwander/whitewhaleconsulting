'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase/client';

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function establishServerSession(user: User) {
  const idToken = await user.getIdToken(true);
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      detail?: string;
    };
    const message = data.error ?? 'Failed to create session.';
    throw new Error(
      process.env.NODE_ENV === 'development' && data.detail
        ? `${message} (${data.detail})`
        : message
    );
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const loadProfile = useCallback(async (firebaseUser: User | null) => {
    if (!firebaseUser || !db) {
      setIsAdmin(false);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
      setIsAdmin(snap.exists() && snap.data()?.role === 'admin');
    } catch {
      setIsAdmin(false);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (!user || !isAdmin) return;
    await establishServerSession(user);
  }, [user, isAdmin]);

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setLoading(false);
      setProfileLoading(false);
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await loadProfile(firebaseUser);
      setLoading(false);
    });

    return unsub;
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth || !db) {
      throw new Error('Firebase is not configured.');
    }
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    const admin = snap.exists() && snap.data()?.role === 'admin';
    if (!admin) {
      await firebaseSignOut(auth);
      throw new Error('Access denied.');
    }
    await establishServerSession(cred.user);
    setUser(cred.user);
    setIsAdmin(true);
    setProfileLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    if (auth) await firebaseSignOut(auth);
    setUser(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      loading,
      profileLoading,
      signIn,
      signOut,
      refreshSession,
    }),
    [user, isAdmin, loading, profileLoading, signIn, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
