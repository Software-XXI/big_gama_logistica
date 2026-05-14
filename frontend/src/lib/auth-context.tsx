'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        console.error('Login failed:', res.status, await res.text());
        return false;
      }

      const data = await res.json();
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      document.cookie = `token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      setToken(data.accessToken);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    }
  }

  async function register(email: string, password: string, name: string, role: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });

      if (!res.ok) {
        console.error('Register failed:', res.status, await res.text());
        return false;
      }
      return login(email, password);
    } catch (error) {
      console.error('Register exception:', error);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}