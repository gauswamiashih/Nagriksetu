import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'gauswamiashish760@gmail.com';

// Mock user storage
const USERS_STORAGE_KEY = 'nagriksetu_users';
const CURRENT_USER_KEY = 'nagriksetu_current_user';

interface StoredUser extends Omit<User, 'createdAt'> {
  password: string;
  createdAt: string;
}

function getStoredUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        ...parsed,
        createdAt: new Date(parsed.createdAt)
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const loggedInUser: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as 'citizen' | 'admin', // Ensure role matches type
        createdAt: new Date(data.createdAt)
      };

      setUser(loggedInUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));
      toast.success(`Welcome back, ${loggedInUser.name}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const newUser: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as 'citizen' | 'admin',
        createdAt: new Date(data.createdAt)
      };

      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = getStoredUsers();
      // Check if user exists (for security, usually you don't reveal this, but for this app it's fine/helpful for demo)
      const exists = users.some(u => u.email === email);

      if (!exists && email !== ADMIN_EMAIL) {
        // Optionally throw error if you want to tell them email not found
        // For better security in real apps, we just say "If account exists..."
        // But per plan, we'll throw error to demo the failure case
        throw new Error('No account found with this email address');
      }

      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset link');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    toast.success('Logged out successfully');
  };

  // Strict Admin Email Restriction
  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, resetPassword, logout, isAdmin }}>
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
