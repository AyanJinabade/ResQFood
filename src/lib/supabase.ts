
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing ENV:", { supabaseUrl, supabaseAnonKey });
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
const handleError = (error: any, message: string) => {
  console.error(message, error);
  throw new Error(error?.message || message);
};
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

  donor?: Profile;
  reserved_ngo?: Profile;
}
export const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userData }
  });

  if (error) handleError(error, "Signup failed");
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) handleError(error, "Login failed");
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) handleError(error, "Logout failed");
};
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn("Profile not found:", userId);
    return null;
  }

  return data;
};

export const createProfile = async (profile: Omit<Profile, 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) handleError(error, "Create profile failed");
  return data;
};
export const createFoodDonation = async (
  donation: Omit<FoodDonation, 'id' | 'created_at' | 'updated_at' | 'donor' | 'reserved_ngo'>
) => {
  const { data, error } = await supabase
    .from('food_donations')
    .insert(donation)
    .select(`*, donor:profiles!donor_id(*)`)
    .single();

  if (error) handleError(error, "Create donation failed");
  return data;
};

export const getFoodDonations = async () => {
  const { data, error } = await supabase
    .from('food_donations')
    .select(`
      *,
      donor:profiles!donor_id(*),
      reserved_ngo:profiles!reserved_by(*)
    `)
    .order('created_at', { ascending: false });

  if (error) handleError(error, "Fetch donations failed");
  return data || [];
};
export const getAnalytics = async () => {
  try {
    const [
      users,
      donations,
      active,
      requests
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('food_donations').select('*', { count: 'exact', head: true }),
      supabase.from('food_donations').select('*', { count: 'exact', head: true }).eq('status', 'available'),
      supabase.from('donation_requests').select('*', { count: 'exact', head: true })
    ]);

    return {
      totalUsers: users.count || 0,
      totalDonations: donations.count || 0,
      activeDonations: active.count || 0,
      totalRequests: requests.count || 0
    };

  } catch (err) {
    console.error("Analytics error:", err);
    return {
      totalUsers: 0,
      totalDonations: 0,
      activeDonations: 0,
      totalRequests: 0
    };
  }
};
