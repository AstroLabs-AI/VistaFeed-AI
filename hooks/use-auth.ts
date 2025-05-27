'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'demo-user',
        username: 'Demo User',
        email: 'demo@example.com'
      },
      accessToken: 'demo-token',
      isAuthenticated: true,
      isLoading: false,
      login: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      checkAuth: async () => {
        // Always return true for demo
        set({ isAuthenticated: true, isLoading: false });
        return true;
      },
      getToken: async () => {
        return get().accessToken;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);