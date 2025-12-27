import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { createProfile, getProfile, signIn, signUp, supabase } from '../lib/supabase';
import { Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (error) {
      console.error('Fetch profile error:', error.message);
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // In AuthContext.tsx
const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const { user: authUser } = await signIn(email, password);
    if (authUser) {
      const userProfile = await getProfile(authUser.id);
      setProfile(userProfile);

      // --- LOG LOGIN ---
      await supabase.from('login_logs').insert({
        user_id: authUser.id,
        email: authUser.email,
        event_type: 'login'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};



const register = async (email: string, password: string, userData: Partial<Profile>) => {
  setLoading(true);
  try {
    const { user: authUser } = await signUp(email, password, userData);

    if (authUser) {
      const profileData: Omit<Profile, 'created_at' | 'updated_at'> = {
        id: authUser.id,
        email: authUser.email!,
        name: userData.name || '',
        phone: userData.phone,
        role: userData.role || 'restaurant',
        organization_name: userData.organization_name,
        address: userData.address,
        latitude: 40.7128,
        longitude: -74.0060,
        verified: false,
        rating: 0,
        total_donations: 0,
        total_collections: 0
      };

      const newProfile = await createProfile(profileData);
      setProfile(newProfile);

      // --- LOG SIGNUP ---
      await supabase.from('login_logs').insert({
        user_id: authUser.id,
        email: authUser.email,
        event_type: 'signup'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
    if (error) throw error;
    setProfile(data);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
