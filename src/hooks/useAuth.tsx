import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '@/integrations/api/client';
import { AuthContextType, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('auth_token')
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        try {
          const userData = await authAPI.me();

          const normalizedUser = {
            ...userData,
            role: userData.role?.toLowerCase(),
          };

          setUser(normalizedUser);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);

      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        setToken(response.access_token);
      }

      const normalizedUser = {
        ...response.user,
        role: response.user.role?.toLowerCase(),
      };

      setUser(normalizedUser);
      return { user: normalizedUser };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await authAPI.register(email, password);

      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        setToken(response.access_token);
      }

      const normalizedUser = {
        ...response.user,
        role: response.user.role?.toLowerCase(),
      };

      setUser(normalizedUser);
      return { user: normalizedUser };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  };

  const refreshSession = async () => {
    try {
      const userData = await authAPI.me();
      const normalizedUser = {
        ...userData,
        role: userData.role?.toLowerCase(),
      };
      setUser(normalizedUser);
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,         // ✅ Expose token here
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
