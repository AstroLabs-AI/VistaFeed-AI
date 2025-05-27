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
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true, isLoading: false });
      },
      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
          console.error('Logout error:', error);
        }
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          window.location.href = '/';
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
        const state = get();
        
        // If already authenticated, return true
        if (state.isAuthenticated && state.user && state.accessToken) {
          return true;
        }
        
        // Check for stored auth data
        const storedAuth = localStorage.getItem('auth-storage');
        if (storedAuth) {
          try {
            const parsed = JSON.parse(storedAuth);
            if (parsed.state?.user && parsed.state?.accessToken) {
              set({ 
                user: parsed.state.user, 
                accessToken: parsed.state.accessToken, 
                isAuthenticated: true,
                isLoading: false
              });
              return true;
            }
          } catch (e) {
            console.error('Failed to parse stored auth:', e);
          }
        }
        
        set({ isAuthenticated: false, isLoading: false });
        return false;
      },
      getToken: async () => {
        const state = get();
        const token = state.accessToken;
        
        // If no token, try to get one via refresh
        if (!token) {
          try {
            const response = await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include',
            });
            
            if (response.ok) {
              const data = await response.json();
              state.login(data.user, data.accessToken);
              return data.accessToken;
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
          }
        }
        
        return token;
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