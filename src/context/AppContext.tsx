import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  FoodDonation,
  DonationRequest,
  Notification,
  getFoodDonations,
  createFoodDonation,
  updateFoodDonation,
  deleteFoodDonation,
  getDonationRequests,
  createDonationRequest,
  updateDonationRequest,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getAnalytics,
} from '../lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Import the Supabase client (assuming it's exported from ../lib/supabase)
import { supabase } from '../lib/supabase';

// Define types for filters
interface DonationFilters {
  donor_id?: string;
  status?: string;
}

interface RequestFilters {
  ngo_id?: string;
  donation_id?: string;
}

// Define AdminStats for getAdminStats (from AdminDashboard.tsx)
interface AdminStats {
  totalUsers: number;
  totalDonations: number;
  activeDonations: number;
  totalServed: number;
  monthlyDonations: { month: string; count: number }[];
  usersByRole: Record<string, number>;
  donationsByType: Record<string, number>;
}

interface AppContextType {
  // Food Donations
  donations: FoodDonation[];
  loadingDonations: boolean;
  addDonation: (
    donation: Omit<FoodDonation, 'id' | 'created_at' | 'updated_at' | 'donor' | 'reserved_ngo'>
  ) => Promise<FoodDonation>;
  updateDonation: (id: string, updates: Partial<FoodDonation>) => Promise<FoodDonation>;
  removeDonation: (id: string) => Promise<void>;
  refreshDonations: () => Promise<void>;

  // Donation Requests
  requests: DonationRequest[];
  loadingRequests: boolean;
  addRequest: (
    request: Omit<DonationRequest, 'id' | 'created_at' | 'updated_at' | 'donation' | 'ngo'>
  ) => Promise<DonationRequest>;
  updateRequest: (id: string, updates: Partial<DonationRequest>) => Promise<DonationRequest>;
  refreshRequests: () => Promise<void>;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  loadingNotifications: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;

  // Analytics
  analytics: {
    totalUsers: number;
    totalDonations: number;
    activeDonations: number;
    totalRequests: number;
  };
  refreshAnalytics: () => Promise<void>;

  // Admin Stats
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

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile } = useAuth();

  // State
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(false);

  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalDonations: 0,
    activeDonations: 0,
    totalRequests: 0,
  });

  // Computed values
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Food Donations
  const refreshDonations = async () => {
    if (!user) return;

    setLoadingDonations(true);
    try {
      const filters: DonationFilters = {};

      // Filter based on user role
      if (profile?.role === 'restaurant' || profile?.role === 'society') {
        filters.donor_id = user.id;
      } else if (profile?.role === 'ngo') {
        filters.status = 'available';
      }
      // Admin sees all donations

      const data = await getFoodDonations(filters);
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoadingDonations(false);
    }
  };

  const addDonation = async (
    donation: Omit<FoodDonation, 'id' | 'created_at' | 'updated_at' | 'donor' | 'reserved_ngo'>
  ) => {
    const newDonation = await createFoodDonation(donation);
    setDonations((prev) => [newDonation, ...prev]);
    return newDonation;
  };

  const updateDonation = async (id: string, updates: Partial<FoodDonation>) => {
    const updatedDonation = await updateFoodDonation(id, updates);
    setDonations((prev) => prev.map((d) => (d.id === id ? updatedDonation : d)));
    return updatedDonation;
  };

  const removeDonation = async (id: string) => {
    await deleteFoodDonation(id);
    setDonations((prev) => prev.filter((d) => d.id !== id));
  };

  // Donation Requests
  const refreshRequests = async () => {
    if (!user || !profile) return;

    setLoadingRequests(true);
    try {
      const filters: RequestFilters = {};

      if (profile.role === 'ngo') {
        filters.ngo_id = user.id;
      } else if (profile.role === 'restaurant' || profile.role === 'society') {
        // Get requests for user's donations
        const userDonations = await getFoodDonations({ donor_id: user.id });
        const donationIds = userDonations.map((d) => d.id);

        if (donationIds.length > 0) {
          const allRequests = await getDonationRequests();
          const userRequests = allRequests.filter((r) => donationIds.includes(r.donation_id));
          setRequests(userRequests);
          setLoadingRequests(false);
          return;
        }
      }
      // Admin sees all requests

      const data = await getDonationRequests(filters);
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const addRequest = async (
    request: Omit<DonationRequest, 'id' | 'created_at' | 'updated_at' | 'donation' | 'ngo'>
  ) => {
    const newRequest = await createDonationRequest(request);
    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const updateRequest = async (id: string, updates: Partial<DonationRequest>) => {
    const updatedRequest = await updateDonationRequest(id, updates);
    setRequests((prev) => prev.map((r) => (r.id === id ? updatedRequest : r)));
    return updatedRequest;
  };

  // Notifications
  const refreshNotifications = async () => {
    if (!user) return;

    setLoadingNotifications(true);
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await markAllNotificationsAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Analytics
  const refreshAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Admin Stats (for AdminDashboard.tsx)
  const getAdminStats = (): AdminStats => {
    const monthlyDonations = donations.reduce((acc, donation) => {
      const month = new Date(donation.created_at).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const usersByRole = { restaurant: 0, society: 0, ngo: 0, admin: 0 }; // Mock data; replace with real query
    const donationsByType = donations.reduce((acc, donation) => {
      acc[donation.food_type] = (acc[donation.food_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers: analytics.totalUsers,
      totalDonations: analytics.totalDonations,
      activeDonations: analytics.activeDonations,
      totalServed: donations.reduce((sum, d) => sum + (d.quantity || 0), 0),
      monthlyDonations: Object.entries(monthlyDonations).map(([month, count]) => ({
        month,
        count,
      })),
      usersByRole,
      donationsByType,
    };
  };

  // Effects
  useEffect(() => {
    if (user && profile) {
      refreshDonations();
      refreshRequests();
      refreshNotifications();
      refreshAnalytics();
    }
  }, [user, profile]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to donations changes
    const donationsChannel = supabase
      .channel('food_donations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'food_donations' },
        (payload: RealtimePostgresChangesPayload<FoodDonation>) => {
          console.log('Donation update:', payload);
          refreshDonations();
        }
      )
      .subscribe();

    // Subscribe to requests changes
    const requestsChannel = supabase
      .channel('donation_requests_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donation_requests' },
        (payload: RealtimePostgresChangesPayload<DonationRequest>) => {
          console.log('Request update:', payload);
          refreshRequests();
        }
      )
      .subscribe();

    // Subscribe to notifications
    const notificationsChannel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Notification>) => {
          console.log('New notification:', payload);
          refreshNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(donationsChannel);
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        // Food Donations
        donations,
        loadingDonations,
        addDonation,
        updateDonation,
        removeDonation,
        refreshDonations,

        // Donation Requests
        requests,
        loadingRequests,
        addRequest,
        updateRequest,
        refreshRequests,

        // Notifications
        notifications,
        unreadCount,
        loadingNotifications,
        markAsRead,
        markAllAsRead,
        refreshNotifications,

        // Analytics
        analytics,
        refreshAnalytics,

        // Admin Stats
        getAdminStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};