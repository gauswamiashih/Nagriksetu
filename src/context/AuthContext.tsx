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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = getStoredUsers();
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const loggedInUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        phone: foundUser.phone,
        role: foundUser.role,
        createdAt: new Date(foundUser.createdAt)
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
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = getStoredUsers();
      
      if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      const newUser: StoredUser = {
        id: `user_${Date.now()}`,
        email,
        password,
        name,
        role: email === ADMIN_EMAIL ? 'admin' : 'citizen',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      const loggedInUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: new Date(newUser.createdAt)
      };

      setUser(loggedInUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
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

  const isAdmin = user?.role === 'admin' || user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin }}>
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
