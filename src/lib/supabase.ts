import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



// Database types
export interface Profile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'restaurant' | 'society' | 'ngo' | 'admin';
  organization_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  rating: number;
  total_donations: number;
  total_collections: number;
  created_at: string;
  updated_at: string;
}

export interface FoodDonation {
  userId: string;
  id: string;
  donor_id: string;
  food_name: string;
  food_type: 'meals' | 'bakery' | 'fruits' | 'vegetables' | 'dairy' | 'other';
  quantity: number;
  unit: string;
  description: string;
  image_url?: string;
  freshness_score: number;
  expiry_time: string;
  status: 'available' | 'reserved' | 'collected' | 'expired' | 'cancelled';
  reserved_by?: string;
  reserved_at?: string;
  collected_at?: string;
  pickup_instructions?: string;
  dietary_info?: string[];
  allergen_info?: string[];
  created_at: string;
  updated_at: string;
  // Joined data
  donor?: Profile;
  reserved_ngo?: Profile;
}

export interface DonationRequest {
  id: string;
  donation_id: string;
  ngo_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'collected';
  message?: string;
  requested_quantity?: number;
  pickup_time?: string;
  special_requirements?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  donation?: FoodDonation;
  ngo?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data?: any;
  created_at: string;
}

export interface Feedback {
  id: string;
  from_user_id: string;
  to_user_id: string;
  donation_id?: string;
  rating: number;
  comment?: string;
  food_quality?: number;
  communication?: number;
  timeliness?: number;
  created_at: string;
  // Joined data
  from_user?: Profile;
  to_user?: Profile;
  donation?: FoodDonation;
}

// Auth helpers
export const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Profile helpers
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createProfile = async (profile: Omit<Profile, 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Food donation helpers
export const getFoodDonations = async (filters?: {
  status?: string;
  donor_id?: string;
  food_type?: string;
  limit?: number;
}) => {
  let query = supabase
    .from('food_donations')
    .select(`
      *,
      donor:profiles!donor_id(*),
      reserved_ngo:profiles!reserved_by(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.donor_id) {
    query = query.eq('donor_id', filters.donor_id);
  }
  
  if (filters?.food_type) {
    query = query.eq('food_type', filters.food_type);
  }
  
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as FoodDonation[];
};

export const createFoodDonation = async (donation: Omit<FoodDonation, 'id' | 'created_at' | 'updated_at' | 'donor' | 'reserved_ngo'>) => {
  const { data, error } = await supabase
    .from('food_donations')
    .insert(donation)
    .select(`
      *,
      donor:profiles!donor_id(*)
    `)
    .single();
  
  if (error) throw error;
  return data as FoodDonation;
};

export const updateFoodDonation = async (id: string, updates: Partial<FoodDonation>) => {
  const { data, error } = await supabase
    .from('food_donations')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      donor:profiles!donor_id(*),
      reserved_ngo:profiles!reserved_by(*)
    `)
    .single();
  
  if (error) throw error;
  return data as FoodDonation;
};

export const deleteFoodDonation = async (id: string) => {
  const { error } = await supabase
    .from('food_donations')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Donation request helpers
export const getDonationRequests = async (filters?: {
  ngo_id?: string;
  donation_id?: string;
  status?: string;
}) => {
  let query = supabase
    .from('donation_requests')
    .select(`
      *,
      donation:food_donations(*),
      ngo:profiles!ngo_id(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.ngo_id) {
    query = query.eq('ngo_id', filters.ngo_id);
  }
  
  if (filters?.donation_id) {
    query = query.eq('donation_id', filters.donation_id);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as DonationRequest[];
};

export const createDonationRequest = async (request: Omit<DonationRequest, 'id' | 'created_at' | 'updated_at' | 'donation' | 'ngo'>) => {
  const { data, error } = await supabase
    .from('donation_requests')
    .insert(request)
    .select(`
      *,
      donation:food_donations(*),
      ngo:profiles!ngo_id(*)
    `)
    .single();
  
  if (error) throw error;
  return data as DonationRequest;
};

export const updateDonationRequest = async (id: string, updates: Partial<DonationRequest>) => {
  const { data, error } = await supabase
    .from('donation_requests')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      donation:food_donations(*),
      ngo:profiles!ngo_id(*)
    `)
    .single();
  
  if (error) throw error;
  return data as DonationRequest;
};

// Notification helpers
export const getNotifications = async (userId: string, unreadOnly = false) => {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as Notification[];
};

export const markNotificationAsRead = async (id: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
  
  if (error) throw error;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);
  
  if (error) throw error;
};


// Analytics helpers
export const getAnalytics = async () => {
  const [
    { count: totalUsers },
    { count: totalDonations },
    { count: activeDonations },
    { count: totalRequests }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('food_donations').select('*', { count: 'exact', head: true }),
    supabase.from('food_donations').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('donation_requests').select('*', { count: 'exact', head: true })
  ]);

  return {
    totalUsers: totalUsers || 0,
    totalDonations: totalDonations || 0,
    activeDonations: activeDonations || 0,
    totalRequests: totalRequests || 0
  };
};