
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { STUDENT_EMAIL_DOMAIN } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (studentId: string, email: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (studentId: string, email: string, name: string) => {
    setIsLoading(true);
    setError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email.endsWith(`@${STUDENT_EMAIL_DOMAIN}`)) {
      setError(`Email must end with @${STUDENT_EMAIL_DOMAIN}`);
      setIsLoading(false);
      return;
    }
    if (!studentId.trim() || !name.trim()) {
      setError("Student ID and Name are required.");
      setIsLoading(false);
      return;
    }

    const mockUser: User = {
      id: studentId, // Using studentId as unique ID
      studentId,
      email,
      name,
    };
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
