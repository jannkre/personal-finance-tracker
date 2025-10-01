import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { useProfile } from '../hooks/useApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user has a token and fetch profile
  const token = localStorage.getItem('auth_token');
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    isSuccess: profileSuccess
  } = useProfile({ enabled: !!token });

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    if (profileError) {
      // Token is invalid, remove it
      localStorage.removeItem('auth_token');
      setIsLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    if (profileSuccess && profileData) {
      setUser(profileData);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(profileLoading);
  }, [token, profileData, profileLoading, profileError, profileSuccess]);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    setIsAuthenticated(!!newUser);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    setUser: handleSetUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};