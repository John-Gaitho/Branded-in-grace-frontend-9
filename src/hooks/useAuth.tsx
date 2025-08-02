import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '@/integrations/api/client';
import { AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Could add token validation here
      setUser({ id: 'user' }); // Simplified user object
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await authAPI.login(email, password);
      setUser(data.user);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await authAPI.register(email, password);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    authAPI.logout();
    setUser(null);
  };

  const refreshSession = async () => {
    try {
      await authAPI.refresh();
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}