import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'verified' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Green Garden Restaurant',
    email: 'restaurant@demo.com',
    phone: '+1234567890',
    role: 'restaurant',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, New York, NY' },
    verified: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Helping Hands NGO',
    email: 'ngo@demo.com',
    phone: '+1234567891',
    role: 'ngo',
    location: { lat: 40.7589, lng: -73.9851, address: '456 Helper Ave, New York, NY' },
    verified: true,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Sunset Society',
    email: 'society@demo.com',
    phone: '+1234567892',
    role: 'society',
    location: { lat: 40.7505, lng: -73.9934, address: '789 Community Rd, New York, NY' },
    verified: true,
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    name: 'System Admin',
    email: 'admin@demo.com',
    phone: '+1234567893',
    role: 'admin',
    location: { lat: 40.7420, lng: -74.0020, address: 'Admin Office, New York, NY' },
    verified: true,
    createdAt: '2024-01-01'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('resqfood_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('resqfood_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'verified' | 'createdAt'>): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      verified: false,
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('resqfood_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resqfood_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('resqfood_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};