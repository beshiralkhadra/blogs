'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface ProjectContextType {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | undefined }>;
  logout: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType>({
  authenticated: false,
  setAuthenticated: () => {},
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  login: async () => ({
    success: false,
    error: undefined as string | undefined,
  }),
  logout: async () => {},
});

function UserProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error: string | undefined }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || 'Login failed' };
      }
      
      const data = await res.json();
      if (data.ok) {
        setAuthenticated(true);
        const userRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }
        return { success: true, error: undefined };
      }
      
      return { success: false, error: 'Login failed' };
    } catch {
      setAuthenticated(false);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      console.error('Logout error');
    }
    setAuthenticated(false);
  };

  
useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setAuthenticated(true)
        } else {
          setAuthenticated(false);
          setUser(null);
        }
      } catch {
        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

  fetchUser();
  }, []);

  
  const value = {
    authenticated,
    loading,
    user,
    setAuthenticated,
    setUser,
    setLoading,
    login,
    logout,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export { ProjectContext, UserProvider };

export const useAuth = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useBlogs must be used within a BlogsProvider');
  }
  return context;
};
