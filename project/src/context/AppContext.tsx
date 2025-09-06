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
