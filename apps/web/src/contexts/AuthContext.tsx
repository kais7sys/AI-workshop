import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Profile, UserRole } from '../types/index.js';
import { api } from '../lib/api.js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (fullName: string, email: string, phone: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '00000000-0000-0000-0000-000000000001',
    fullName: 'Ramesh Kumar',
    email: 'ramesh.farmer@agri.gov.in',
    role: 'FARMER',
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const storedToken = localStorage.getItem('agri_token');
        if (!storedToken) {
          localStorage.setItem('agri_token', 'demo-farmer-token');
        }
        const data = await api.get<{ user: User; profile: Profile }>('/api/auth/me');
        setUser(data.user);
        setProfile(data.profile);
      } catch (err) {
        console.warn('Using demo session defaults', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    try {
      if (email.includes('officer')) {
        switchDemoRole('OFFICER');
      } else if (email.includes('admin')) {
        switchDemoRole('ADMIN');
      } else {
        switchDemoRole('FARMER');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, email: string, phone: string, role: UserRole = 'FARMER') => {
    setLoading(true);
    try {
      setUser({
        id: crypto.randomUUID(),
        fullName,
        email,
        role,
      });
      localStorage.setItem('agri_token', 'demo-farmer-token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('agri_token');
    setUser(null);
    setProfile(null);
  };

  const switchDemoRole = (role: UserRole) => {
    if (role === 'FARMER') {
      localStorage.setItem('agri_token', 'demo-farmer-token');
      setUser({
        id: '00000000-0000-0000-0000-000000000001',
        fullName: 'Ramesh Kumar',
        email: 'ramesh.farmer@agri.gov.in',
        role: 'FARMER',
      });
    } else if (role === 'OFFICER') {
      localStorage.setItem('agri_token', 'demo-officer-token');
      setUser({
        id: '00000000-0000-0000-0000-000000000002',
        fullName: 'Dr. Ananya Sharma',
        email: 'ananya.officer@agri.gov.in',
        role: 'OFFICER',
      });
    } else if (role === 'ADMIN') {
      localStorage.setItem('agri_token', 'demo-admin-token');
      setUser({
        id: '00000000-0000-0000-0000-000000000003',
        fullName: 'Vikram Patel',
        email: 'vikram.admin@agri.gov.in',
        role: 'ADMIN',
      });
    }
    // Refresh user profile
    api.get<{ user: User; profile: Profile }>('/api/auth/me')
      .then((data) => {
        setProfile(data.profile);
      })
      .catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
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
