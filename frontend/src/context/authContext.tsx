'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { AuthService } from '@/services/auth';

interface User {
  sub: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      try {
        const decoded: User = jwtDecode(savedToken);
        setUser(decoded);
        setToken(savedToken);
      } catch {
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  function login(newToken: string) {
    try {
      const decoded: User = jwtDecode(newToken);
      localStorage.setItem('access_token', newToken);
      setUser(decoded);
      setToken(newToken);
      router.push('/chat');
    } catch {
      message.error('Token inválido');
    }
  }

  async function logout() {
    try {
      const refresh_token = localStorage.getItem('refresh_token');

      if (refresh_token) {
        await AuthService.logout(refresh_token);
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setToken(null);

      router.push('/');
    } catch (err) {
      console.error('Erro ao deslogar:', err);
    }
  }



  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
