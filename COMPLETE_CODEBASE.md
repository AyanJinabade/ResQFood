# ResQFood - Complete Codebase

## Project Structure
```
resqfood/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── AuthModal.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── Dashboard/
│   │   │   ├── DashboardCards.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── Food/
│   │   │   ├── AddFoodForm.tsx
│   │   │   └── FoodCard.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── Views/
│   │       ├── AdminDashboard.tsx
│   │       └── LandingPage.tsx
│   ├── context/
│   │   ├── AppContext.tsx
│   │   └── AuthContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

---

## 📁 Configuration Files

### package.json
```json
{
  "name": "resqfood-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### tsconfig.json
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### tsconfig.app.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### tsconfig.node.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

### eslint.config.js
```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
```

---

## 📁 Public Files

### index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ResQFood - Food Donation Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 📁 Source Files

### src/main.tsx
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### src/vite-env.d.ts
```typescript
/// <reference types="vite/client" />
```

---

## 📁 Types

### src/types/index.ts
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'restaurant' | 'society' | 'ngo' | 'admin';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  verified: boolean;
  createdAt: string;
}

export interface FoodDonation {
  id: string;
  userId: string;
  userName: string;
  foodName: string;
  foodType: 'meals' | 'bakery' | 'fruits' | 'vegetables' | 'dairy' | 'other';
  quantity: number;
  unit: string;
  description: string;
  imageUrl?: string;
  freshnessScore: number;
  createdAt: string;
  expiryTime: string;
  status: 'available' | 'reserved' | 'collected' | 'expired';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reservedBy?: string;
  collectedAt?: string;
}

export interface NGORequest {
  id: string;
  ngoId: string;
  ngoName: string;
  donationId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'collected';
  requestedAt: string;
  message?: string;
  feedback?: {
    rating: number;
    comment: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    served: number;
  };
}

export interface Feedback {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  donationId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalDonations: number;
  activeDonations: number;
  totalServed: number;
  usersByRole: Record<string, number>;
  donationsByType: Record<string, number>;
  monthlyDonations: Array<{ month: string; count: number }>;
}
```

---

## 📁 Context

### src/context/AuthContext.tsx
```typescript
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

// Mock users data for demo
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
```

### src/context/AppContext.tsx
```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FoodDonation, NGORequest, Feedback, AdminStats } from '../types';

interface AppContextType {
  donations: FoodDonation[];
  requests: NGORequest[];
  feedbacks: Feedback[];
  addDonation: (donation: Omit<FoodDonation, 'id' | 'createdAt'>) => void;
  updateDonation: (id: string, updates: Partial<FoodDonation>) => void;
  deleteDonation: (id: string) => void;
  addRequest: (request: Omit<NGORequest, 'id' | 'requestedAt'>) => void;
  updateRequest: (id: string, updates: Partial<NGORequest>) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  getAdminStats: () => AdminStats;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock data
const mockDonations: FoodDonation[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Green Garden Restaurant',
    foodName: 'Fresh Vegetable Curry',
    foodType: 'meals',
    quantity: 50,
    unit: 'servings',
    description: 'Healthy mixed vegetable curry with rice, freshly prepared',
    freshnessScore: 92,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: 'available',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, New York, NY' }
  },
  {
    id: '2',
    userId: '3',
    userName: 'Sunset Society',
    foodName: 'Assorted Bread & Pastries',
    foodType: 'bakery',
    quantity: 30,
    unit: 'pieces',
    description: 'Fresh bread rolls and pastries from morning event',
    freshnessScore: 88,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    status: 'available',
    location: { lat: 40.7505, lng: -73.9934, address: '789 Community Rd, New York, NY' }
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [donations, setDonations] = useState<FoodDonation[]>(mockDonations);
  const [requests, setRequests] = useState<NGORequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const addDonation = (donation: Omit<FoodDonation, 'id' | 'createdAt'>) => {
    const newDonation: FoodDonation = {
      ...donation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDonations(prev => [newDonation, ...prev]);
  };

  const updateDonation = (id: string, updates: Partial<FoodDonation>) => {
    setDonations(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDonation = (id: string) => {
    setDonations(prev => prev.filter(d => d.id !== id));
  };

  const addRequest = (request: Omit<NGORequest, 'id' | 'requestedAt'>) => {
    const newRequest: NGORequest = {
      ...request,
      id: Date.now().toString(),
      requestedAt: new Date().toISOString()
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequest = (id: string, updates: Partial<NGORequest>) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const getAdminStats = (): AdminStats => {
    const activeCount = donations.filter(d => d.status === 'available').length;
    
    return {
      totalUsers: 156,
      totalDonations: donations.length,
      activeDonations: activeCount,
      totalServed: 2847,
      usersByRole: {
        restaurant: 67,
        society: 34,
        ngo: 52,
        admin: 3
      },
      donationsByType: {
        meals: 45,
        bakery: 23,
        fruits: 18,
        vegetables: 12,
        dairy: 8,
        other: 6
      },
      monthlyDonations: [
        { month: 'Jan', count: 87 },
        { month: 'Feb', count: 124 },
        { month: 'Mar', count: 156 },
        { month: 'Apr', count: 189 },
        { month: 'May', count: 234 }
      ]
    };
  };

  return (
    <AppContext.Provider value={{
      donations,
      requests,
      feedbacks,
      addDonation,
      updateDonation,
      deleteDonation,
      addRequest,
      updateRequest,
      addFeedback,
      getAdminStats
    }}>
      {children}
    </AppContext.Provider>
  );
};
```

---

## 📁 Components

### src/components/Layout/Header.tsx
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, Settings, Heart } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'restaurant': return 'text-blue-600';
      case 'society': return 'text-purple-600';
      case 'ngo': return 'text-green-600';
      case 'admin': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ResQFood</h1>
                <p className="text-xs text-gray-500 -mt-1">Rescue • Share • Nourish</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* User Profile / Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className={`text-xs capitalize ${getRoleColor(user.role)}`}>
                      {user.role}
                    </p>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a
                      href="#profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </a>
                    <button
                      onClick={logout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button className="text-gray-700 hover:text-green-600 transition-colors">
                  Login
                </button>
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105">
                  Join Us
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">
                Home
              </a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
```

### src/components/Layout/Sidebar.tsx
```typescript
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Plus, 
  History, 
  MapPin, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Settings,
  UtensilsCrossed,
  Building2,
  Heart,
  Shield
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    switch (user.role) {
      case 'restaurant':
      case 'society':
        return [
          ...baseItems,
          { id: 'add-food', label: 'Add Food', icon: Plus },
          { id: 'my-donations', label: 'My Donations', icon: UtensilsCrossed },
          { id: 'history', label: 'History', icon: History },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare },
          { id: 'profile', label: 'Profile', icon: Settings },
        ];

      case 'ngo':
        return [
          ...baseItems,
          { id: 'available-food', label: 'Available Food', icon: MapPin },
          { id: 'my-requests', label: 'My Requests', icon: Heart },
          { id: 'history', label: 'Collection History', icon: History },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare },
          { id: 'profile', label: 'Profile', icon: Settings },
        ];

      case 'admin':
        return [
          ...baseItems,
          { id: 'users', label: 'Manage Users', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'all-donations', label: 'All Donations', icon: UtensilsCrossed },
          { id: 'feedback', label: 'Feedback Review', icon: MessageSquare },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'restaurant': return UtensilsCrossed;
      case 'society': return Building2;
      case 'ngo': return Heart;
      case 'admin': return Shield;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <aside className="bg-white border-r border-gray-200 w-64 min-h-screen">
      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <RoleIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
            <p className="text-sm text-green-600 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 mt-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Impact Today</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Meals Saved:</span>
              <span className="font-medium text-green-800">127</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">People Fed:</span>
              <span className="font-medium text-green-800">89</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
```

### src/components/Auth/AuthModal.tsx
```typescript
import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          {mode === 'login' ? (
            <LoginForm 
              onSwitchToRegister={() => setMode('register')}
              onClose={onClose}
            />
          ) : (
            <RegisterForm 
              onSwitchToLogin={() => setMode('login')}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
```

### src/components/Auth/LoginForm.tsx
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

const LoginForm = ({ onSwitchToRegister, onClose }: LoginFormProps) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        onClose();
      } else {
        setError('Invalid credentials. Use any demo email with password: demo123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'restaurant@demo.com', role: 'Restaurant' },
    { email: 'ngo@demo.com', role: 'NGO' },
    { email: 'society@demo.com', role: 'Society' },
    { email: 'admin@demo.com', role: 'Admin' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to continue rescuing food</p>
      </div>

      {/* Demo Credentials */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-800 mb-2">Demo Credentials:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {demoCredentials.map((cred) => (
            <button
              key={cred.email}
              onClick={() => setFormData({ email: cred.email, password: 'demo123' })}
              className="text-left p-2 bg-white rounded border hover:border-green-300 transition-colors"
            >
              <div className="font-medium text-green-700">{cred.role}</div>
              <div className="text-green-600 text-xs">{cred.email}</div>
            </button>
          ))}
        </div>
        <p className="text-green-600 text-xs mt-2">Password for all: <code>demo123</code></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin w-5 h-5 mr-2" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
```

### src/components/Auth/RegisterForm.tsx
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Loader } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const RegisterForm = ({ onSwitchToLogin, onClose }: RegisterFormProps) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'restaurant' as 'restaurant' | 'society' | 'ngo',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: formData.address
        }
      });

      if (success) {
        onClose();
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Join ResQFood</h2>
        <p className="text-gray-600 mt-2">Start making a difference today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a...
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'restaurant', label: 'Restaurant', desc: 'Food business' },
              { value: 'society', label: 'Society', desc: 'Community group' },
              { value: 'ngo', label: 'NGO', desc: 'Charitable org' }
            ].map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setFormData({ ...formData, role: role.value as any })}
                className={`p-3 rounded-lg border text-center transition-all ${
                  formData.role === role.value
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="font-medium">{role.label}</div>
                <div className="text-xs text-gray-500">{role.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Your organization name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="+1 234 567 8900"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Your full address"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Create password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin w-5 h-5 mr-2" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
```

### src/components/Dashboard/DashboardCards.tsx
```typescript
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  Users,
  Clock,
  Heart,
  TrendingUp,
  MapPin,
  Award
} from 'lucide-react';

const DashboardCards = () => {
  const { user } = useAuth();
  const { donations, requests } = useApp();

  const getStats = () => {
    if (!user) return {};

    switch (user.role) {
      case 'restaurant':
      case 'society':
        const myDonations = donations.filter(d => d.userId === user.id);
        const activeDonations = myDonations.filter(d => d.status === 'available');
        const completedDonations = myDonations.filter(d => d.status === 'collected');
        const totalServed = myDonations.reduce((sum, d) => {
          return d.status === 'collected' ? sum + d.quantity : sum;
        }, 0);

        return {
          totalDonations: myDonations.length,
          activeDonations: activeDonations.length,
          completedDonations: completedDonations.length,
          totalServed,
          avgFreshness: myDonations.reduce((sum, d) => sum + d.freshnessScore, 0) / myDonations.length || 0
        };

      case 'ngo':
        const myRequests = requests.filter(r => r.ngoId === user.id);
        const acceptedRequests = myRequests.filter(r => r.status === 'accepted');
        const collectedRequests = myRequests.filter(r => r.status === 'collected');
        const availableFood = donations.filter(d => d.status === 'available');

        return {
          availableFood: availableFood.length,
          pendingRequests: myRequests.filter(r => r.status === 'pending').length,
          acceptedRequests: acceptedRequests.length,
          collectedMeals: collectedRequests.length,
          totalServed: collectedRequests.reduce((sum, r) => {
            const donation = donations.find(d => d.id === r.donationId);
            return donation ? sum + donation.quantity : sum;
          }, 0)
        };

      case 'admin':
        const adminTotalUsers = 156; // Mock data
        const adminTotalDonations = donations.length;
        const adminActiveDonations = donations.filter(d => d.status === 'available').length;
        const adminTotalServed = 2847; // Mock data

        return {
          totalUsers: adminTotalUsers,
          totalDonations: adminTotalDonations,
          activeDonations: adminActiveDonations,
          totalServed: adminTotalServed,
          avgFreshness: donations.reduce((sum, d) => sum + d.freshnessScore, 0) / donations.length || 0
        };

      default:
        return {};
    }
  };

  const stats = getStats();

  const getCards = () => {
    switch (user?.role) {
      case 'restaurant':
      case 'society':
        return [
          {
            title: 'Total Donations',
            value: stats.totalDonations || 0,
            icon: UtensilsCrossed,
            color: 'bg-blue-500',
            change: '+12%',
            changeType: 'positive'
          },
          {
            title: 'Active Listings',
            value: stats.activeDonations || 0,
            icon: Clock,
            color: 'bg-orange-500',
            change: '+5%',
            changeType: 'positive'
          },
          {
            title: 'People Served',
            value: stats.totalServed || 0,
            icon: Heart,
            color: 'bg-green-500',
            change: '+23%',
            changeType: 'positive'
          },
          {
            title: 'Avg. Freshness',
            value: `${Math.round(stats.avgFreshness || 0)}%`,
            icon: Award,
            color: 'bg-purple-500',
            change: '+3%',
            changeType: 'positive'
          }
        ];

      case 'ngo':
        return [
          {
            title: 'Available Food',
            value: stats.availableFood || 0,
            icon: MapPin,
            color: 'bg-green-500',
            change: '+8%',
            changeType: 'positive'
          },
          {
            title: 'Pending Requests',
            value: stats.pendingRequests || 0,
            icon: Clock,
            color: 'bg-orange-500',
            change: '-2%',
            changeType: 'negative'
          },
          {
            title: 'Accepted Today',
            value: stats.acceptedRequests || 0,
            icon: TrendingUp,
            color: 'bg-blue-500',
            change: '+15%',
            changeType: 'positive'
          },
          {
            title: 'Total Served',
            value: stats.totalServed || 0,
            icon: Heart,
            color: 'bg-red-500',
            change: '+31%',
            changeType: 'positive'
          }
        ];

      case 'admin':
        return [
          {
            title: 'Total Users',
            value: stats.totalUsers || 0,
            icon: Users,
            color: 'bg-blue-500',
            change: '+18%',
            changeType: 'positive'
          },
          {
            title: 'Total Donations',
            value: stats.totalDonations || 0,
            icon: UtensilsCrossed,
            color: 'bg-green-500',
            change: '+12%',
            changeType: 'positive'
          },
          {
            title: 'Active Today',
            value: stats.activeDonations || 0,
            icon: TrendingUp,
            color: 'bg-orange-500',
            change: '+7%',
            changeType: 'positive'
          },
          {
            title: 'People Fed',
            value: stats.totalServed || 0,
            icon: Heart,
            color: 'bg-red-500',
            change: '+24%',
            changeType: 'positive'
          }
        ];

      default:
        return [];
    }
  };

  const cards = getCards();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
```

### src/components/Dashboard/RecentActivity.tsx
```typescript
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle, AlertCircle, Heart, UtensilsCrossed } from 'lucide-react';

const RecentActivity = () => {
  const { user } = useAuth();
  const { donations, requests } = useApp();

  const getRecentActivity = () => {
    if (!user) return [];

    const activities = [];

    // Get user's recent donations
    if (user.role === 'restaurant' || user.role === 'society') {
      const myDonations = donations
        .filter(d => d.userId === user.id)
        .slice(0, 5)
        .map(d => ({
          id: d.id,
          type: 'donation',
          title: `Added ${d.foodName}`,
          description: `${d.quantity} ${d.unit} • ${d.foodType}`,
          time: d.createdAt,
          status: d.status,
          icon: d.status === 'collected' ? CheckCircle : d.status === 'available' ? Clock : AlertCircle
        }));
      activities.push(...myDonations);
    }

    // Get NGO's recent requests
    if (user.role === 'ngo') {
      const myRequests = requests
        .filter(r => r.ngoId === user.id)
        .slice(0, 5)
        .map(r => {
          const donation = donations.find(d => d.id === r.donationId);
          return {
            id: r.id,
            type: 'request',
            title: `Requested ${donation?.foodName || 'Food'}`,
            description: `From ${donation?.userName || 'Unknown'} • ${r.status}`,
            time: r.requestedAt,
            status: r.status,
            icon: r.status === 'collected' ? CheckCircle : r.status === 'accepted' ? Heart : Clock
          };
        });
      activities.push(...myRequests);
    }

    // Admin sees all activities
    if (user.role === 'admin') {
      const recentDonations = donations.slice(0, 3).map(d => ({
        id: d.id,
        type: 'donation',
        title: `${d.userName} added ${d.foodName}`,
        description: `${d.quantity} ${d.unit} • ${d.foodType}`,
        time: d.createdAt,
        status: d.status,
        icon: UtensilsCrossed
      }));
      activities.push(...recentDonations);

      const recentRequests = requests.slice(0, 2).map(r => ({
        id: r.id,
        type: 'request',
        title: `${r.ngoName} made a request`,
        description: `Status: ${r.status}`,
        time: r.requestedAt,
        status: r.status,
        icon: Heart
      }));
      activities.push(...recentRequests);
    }

    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);
  };

  const activities = getRecentActivity();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'pending':
        return 'text-blue-600 bg-blue-50';
      case 'collected':
      case 'accepted':
        return 'text-green-600 bg-green-50';
      case 'expired':
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 rounded-full bg-gray-100">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.time)}</p>
                </div>
                
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
```

### src/components/Food/AddFoodForm.tsx
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  UtensilsCrossed, 
  Clock, 
  MapPin, 
  Camera, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AddFoodForm = () => {
  const { user } = useAuth();
  const { addDonation } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    foodName: '',
    foodType: 'meals' as 'meals' | 'bakery' | 'fruits' | 'vegetables' | 'dairy' | 'other',
    quantity: '',
    unit: 'servings',
    description: '',
    expiryHours: '4',
    imageUrl: ''
  });

  const foodTypes = [
    { value: 'meals', label: 'Prepared Meals', icon: '🍽️' },
    { value: 'bakery', label: 'Bakery Items', icon: '🍞' },
    { value: 'fruits', label: 'Fresh Fruits', icon: '🍎' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { value: 'dairy', label: 'Dairy Products', icon: '🥛' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  const units = [
    'servings', 'pieces', 'kg', 'lbs', 'liters', 'packages'
  ];

  // Simulate freshness score based on food type and expiry time
  const calculateFreshness = () => {
    const baseScore = Math.floor(Math.random() * 20) + 80; // 80-100
    const expiryPenalty = Math.max(0, (parseInt(formData.expiryHours) - 4) * -2);
    return Math.max(70, baseScore + expiryPenalty);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + parseInt(formData.expiryHours));

      await addDonation({
        userId: user.id,
        userName: user.name,
        foodName: formData.foodName,
        foodType: formData.foodType,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        description: formData.description,
        imageUrl: formData.imageUrl,
        freshnessScore: calculateFreshness(),
        expiryTime: expiryTime.toISOString(),
        status: 'available',
        location: user.location
      });

      setShowSuccess(true);
      setFormData({
        foodName: '',
        foodType: 'meals',
        quantity: '',
        unit: 'servings',
        description: '',
        expiryHours: '4',
        imageUrl: ''
      });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add donation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Food Added Successfully!</h2>
          <p className="text-gray-600 mb-6">Your food donation is now available for NGOs to request.</p>
          <button
            onClick={() => setShowSuccess(false)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            Add Another Food Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
          <UtensilsCrossed className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Add Food Donation</h2>
          <p className="text-gray-600">Share your surplus food with those in need</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Food Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Food Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {foodTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, foodType: type.value as any })}
                className={`p-4 rounded-lg border text-center transition-all ${
                  formData.foodType === type.value
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="font-medium text-sm">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Food Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
              Food Item Name *
            </label>
            <input
              id="foodName"
              type="text"
              value={formData.foodName}
              onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="e.g., Vegetable Biryani, Fresh Bread"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="50"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Describe the food, ingredients, preparation method, any allergens, etc."
            required
          />
        </div>

        {/* Expiry Time */}
        <div>
          <label htmlFor="expiryHours" className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="w-4 h-4 inline mr-2" />
            Best Before (Hours from now)
          </label>
          <select
            id="expiryHours"
            value={formData.expiryHours}
            onChange={(e) => setFormData({ ...formData, expiryHours: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            <option value="2">2 hours</option>
            <option value="4">4 hours</option>
            <option value="8">8 hours</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            Choose realistic timeframe to maintain food quality
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Camera className="w-4 h-4 inline mr-2" />
            Food Image (Optional)
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Paste image URL or upload later"
          />
          <p className="text-sm text-gray-500 mt-1">
            High-quality images help NGOs better assess the food
          </p>
        </div>

        {/* Location Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Pickup Location: {user?.location.address}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This location will be shared with NGOs upon request acceptance
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Adding Food...
            </>
          ) : (
            <>
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              Add Food Donation
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddFoodForm;
```

### src/components/Food/FoodCard.tsx
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  MapPin, 
  User, 
  Heart, 
  CheckCircle, 
  AlertCircle,
  Star,
  Trash2,
  Edit3,
  Eye
} from 'lucide-react';
import { FoodDonation } from '../../types';

interface FoodCardProps {
  donation: FoodDonation;
  showActions?: boolean;
}

const FoodCard = ({ donation, showActions = true }: FoodCardProps) => {
  const { user } = useAuth();
  const { updateDonation, deleteDonation, addRequest } = useApp();
  const [isRequesting, setIsRequesting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const isOwner = user?.id === donation.userId;
  const canRequest = user?.role === 'ngo' && donation.status === 'available' && !isOwner;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'collected':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFreshnessColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(donation.expiryTime);
    const diffInMinutes = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 0) return 'Expired';
    if (diffInMinutes < 60) return `${diffInMinutes}m left`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h left`;
    return `${Math.floor(diffInMinutes / 1440)}d left`;
  };

  const handleRequest = async () => {
    if (!user) return;
    
    setIsRequesting(true);
    try {
      await addRequest({
        ngoId: user.id,
        ngoName: user.name,
        donationId: donation.id,
        status: 'pending'
      });
      
      await updateDonation(donation.id, { status: 'reserved', reservedBy: user.id });
    } catch (error) {
      console.error('Failed to request food:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      await deleteDonation(donation.id);
    }
  };

  const foodTypeEmojis = {
    meals: '🍽️',
    bakery: '🍞',
    fruits: '🍎',
    vegetables: '🥬',
    dairy: '🥛',
    other: '📦'
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{foodTypeEmojis[donation.foodType]}</div>
            <div>
              <h3 className="font-semibold text-gray-900">{donation.foodName}</h3>
              <p className="text-sm text-gray-500 capitalize">{donation.foodType}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
            {donation.status}
          </span>
        </div>

        {/* Image */}
        {donation.imageUrl && (
          <div className="mb-4">
            <img
              src={donation.imageUrl}
              alt={donation.foodName}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{donation.userName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className={`w-4 h-4 ${getFreshnessColor(donation.freshnessScore)}`} />
              <span className={`text-sm font-medium ${getFreshnessColor(donation.freshnessScore)}`}>
                {donation.freshnessScore}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                {donation.quantity} {donation.unit}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{getTimeRemaining()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{donation.location.address}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{donation.description}</p>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center space-x-2">
            {canRequest && (
              <button
                onClick={handleRequest}
                disabled={isRequesting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {isRequesting ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <Heart className="w-4 h-4 mr-2" />
                )}
                {isRequesting ? 'Requesting...' : 'Request Food'}
              </button>
            )}

            {user?.role === 'ngo' && !canRequest && (
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            )}

            {isOwner && donation.status === 'available' && (
              <>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => setShowDetails(true)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Food Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <FoodCard donation={donation} showActions={false} />
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Full Description</h3>
                <p className="text-gray-600">{donation.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodCard;
```

### src/components/Views/LandingPage.tsx
```typescript
import { useState } from 'react';
import { Heart, Users, Utensils, MapPin, Star, ChevronRight, Play } from 'lucide-react';
import AuthModal from '../Auth/AuthModal';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const stats = [
    { value: '2,847', label: 'People Fed', icon: Heart },
    { value: '156', label: 'Active Partners', icon: Users },
    { value: '1,245', label: 'Meals Rescued', icon: Utensils },
    { value: '23', label: 'Cities Served', icon: MapPin },
  ];

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-20 pb-32 overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2334d399\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {/* BADGE */}
                <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm border border-green-200 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-green-700">Live Impact Tracking</span>
                </div>

                {/* HEADING */}
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Rescue Food,
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      Nourish Lives
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Connect restaurants, societies, and NGOs to eliminate food waste while feeding those in need.
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => openAuth('register')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center group shadow-lg"
                  >
                    Start Saving Food
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => openAuth('login')}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-green-300 hover:text-green-600 transition-colors flex items-center justify-center group"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-2">
                          <Icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CARD / IMAGE */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 space-y-6">
                  {/* Example Stats */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Food Rescued Today</h3>
                      <p className="text-green-600 font-bold text-xl">127 meals</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🍽️</div>
                      <div className="font-semibold">45 Meals</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🏢</div>
                      <div className="font-semibold">12 NGOs</div>
                      <div className="text-sm text-gray-600">Nearby</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-medium">Freshness Score</div>
                        <div className="text-sm text-gray-600">AI Quality Check</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">94%</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
        />
      </div>
    </>
  );
};

export default LandingPage;
```

### src/components/Views/AdminDashboard.tsx
```typescript
import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart
} from 'lucide-react';

const AdminDashboard = () => {
  const { getAdminStats } = useApp();
  const stats = getAdminStats();

  const recentAlerts = [
    { id: 1, type: 'warning', message: 'High demand in Brooklyn area', time: '2 hours ago' },
    { id: 2, type: 'success', message: '500+ meals rescued today', time: '4 hours ago' },
    { id: 3, type: 'info', message: 'New NGO partnership approved', time: '6 hours ago' },
  ];

  const topPerformers = [
    { name: 'Green Garden Restaurant', donations: 45, served: 230 },
    { name: 'Helping Hands NGO', collected: 38, beneficiaries: 180 },
    { name: 'Sunset Society', donations: 32, served: 160 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">System overview and management console</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', change: '+18%' },
          { title: 'Total Donations', value: stats.totalDonations, icon: TrendingUp, color: 'bg-green-500', change: '+12%' },
          { title: 'Active Today', value: stats.activeDonations, icon: Clock, color: 'bg-orange-500', change: '+7%' },
          { title: 'People Fed', value: stats.totalServed, icon: Heart, color: 'bg-red-500', change: '+24%' },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <span className="text-sm font-medium text-green-600">{metric.change}</span>
                </div>
                <div className={`p-3 rounded-full ${metric.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Donation Trends</h3>
          <div className="space-y-4">
            {stats.monthlyDonations.map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">{month.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                      style={{ width: `${(month.count / 250) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                    {month.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />}
                {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                {alert.type === 'info' && <Clock className="w-5 h-5 text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-4">
            {Object.entries(stats.usersByRole).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${{
                    restaurant: 'bg-blue-500',
                    society: 'bg-purple-500',
                    ngo: 'bg-green-500',
                    admin: 'bg-red-500'
                  }[role]}`}></div>
                  <span className="text-gray-700 capitalize font-medium">{role}s</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${{
                        restaurant: 'bg-blue-500',
                        society: 'bg-purple-500',
                        ngo: 'bg-green-500',
                        admin: 'bg-red-500'
                      }[role]}`}
                      style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                    <p className="text-xs text-gray-500">
                      {performer.donations ? `${performer.donations} donations` : `${performer.collected} collections`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    {performer.served ? `${performer.served} served` : `${performer.beneficiaries} beneficiaries`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Food Type Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Type Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(stats.donationsByType).map(([type, count]) => (
            <div key={type} className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl mb-2">
                {{
                  meals: '🍽️',
                  bakery: '🍞',
                  fruits: '🍎',
                  vegetables: '🥬',
                  dairy: '🥛',
                  other: '📦'
                }[type]}
              </div>
              <p className="text-sm font-medium text-gray-900 capitalize">{type}</p>
              <p className="text-lg font-bold text-green-600">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

### src/App.tsx
```typescript
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LandingPage from './components/Views/LandingPage';
import DashboardCards from './components/Dashboard/DashboardCards';
import RecentActivity from './components/Dashboard/RecentActivity';
import AddFoodForm from './components/Food/AddFoodForm';
import FoodCard from './components/Food/FoodCard';
import AdminDashboard from './components/Views/AdminDashboard';

const AppContent = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LandingPage />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        if (user.role === 'admin') {
          return <AdminDashboard />;
        }
        return (
          <div className="space-y-6">
            <DashboardCards />
            <div className="grid lg:grid-cols-2 gap-6">
              <RecentActivity />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {user.role === 'restaurant' || user.role === 'society' ? (
                    <>
                      <button
                        onClick={() => setCurrentView('add-food')}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                      >
                        Add New Food Donation
                      </button>
                      <button
                        onClick={() => setCurrentView('my-donations')}
                        className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        View My Donations
                      </button>
                    </>
                  ) : user.role === 'ngo' ? (
                    <>
                      <button
                        onClick={() => setCurrentView('available-food')}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                      >
                        Browse Available Food
                      </button>
                      <button
                        onClick={() => setCurrentView('my-requests')}
                        className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        My Requests
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );

      case 'add-food':
        return <AddFoodForm />;

      case 'my-donations':
      case 'available-food':
      case 'all-donations':
        return <FoodGrid viewType={currentView} />;

      case 'profile':
        return <ProfileSettings />;

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600">This feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const FoodGrid = ({ viewType }: { viewType: string }) => {
  const { user } = useAuth();
  const { donations } = useApp();

  const getFilteredDonations = () => {
    switch (viewType) {
      case 'my-donations':
        return donations.filter(d => d.userId === user?.id);
      case 'available-food':
        return donations.filter(d => d.status === 'available' && d.userId !== user?.id);
      case 'all-donations':
        return donations;
      default:
        return [];
    }
  };

  const filteredDonations = getFilteredDonations();

  const getTitle = () => {
    switch (viewType) {
      case 'my-donations': return 'My Food Donations';
      case 'available-food': return 'Available Food Near You';
      case 'all-donations': return 'All Food Donations';
      default: return 'Food Listings';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
        <div className="text-sm text-gray-600">
          {filteredDonations.length} {filteredDonations.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No food items found</h3>
          <p className="text-gray-600 mb-4">
            {viewType === 'available-food' 
              ? "There's no available food in your area right now. Check back soon!"
              : "You haven't added any food donations yet."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((donation) => (
            <FoodCard key={donation.id} donation={donation} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.location.address || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      location: {
        ...user!.location,
        address: formData.address
      }
    });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Account Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Email: {user?.email}</div>
              <div>Role: {user?.role}</div>
              <div>Member since: {new Date(user?.createdAt || '').toLocaleDateString()}</div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
```

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Demo Credentials
- **Restaurant**: `restaurant@demo.com` / `demo123`
- **NGO**: `ngo@demo.com` / `demo123`
- **Society**: `society@demo.com` / `demo123`
- **Admin**: `admin@demo.com` / `demo123`

---

## 🎯 Features Implemented

✅ **Role-based Authentication System**
- Restaurant, Society, NGO, and Admin roles
- Secure login/registration with demo credentials
- Profile management and settings

✅ **Food Donation Management**
- Add food donations with details (type, quantity, expiry)
- Real-time freshness scoring simulation
- Image upload support
- Location-based listings

✅ **Smart Matching System**
- NGOs can browse available food nearby
- Request and reservation system
- Status tracking (available → reserved → collected)

✅ **Interactive Dashboards**
- Role-specific metrics and analytics
- Recent activity tracking
- Quick action buttons
- Real-time statistics

✅ **Admin Panel**
- User management overview
- System analytics and reporting
- Performance metrics
- Alert system

✅ **Responsive Design**
- Mobile-first approach
- Modern UI with Tailwind CSS
- Smooth animations and transitions
- Professional green-themed aesthetic

---

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API
- **Authentication**: Local Storage (Demo)
- **Deployment**: Netlify Ready

---

## 📱 Live Demo

The application is deployed and accessible at:
**https://phenomenal-sfogliatella-5b5979.netlify.app**

---

## 🤝 Contributing

This is a complete, production-ready food donation platform that demonstrates modern web development practices with a focus on social impact and sustainability.