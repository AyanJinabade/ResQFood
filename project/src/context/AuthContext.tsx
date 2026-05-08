// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jziqyyevntpervtlwfys.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aXF5eWV2bnRwZXJ2dGx3ZnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxODA4OTAsImV4cCI6MjA3MDc1Njg5MH0.QOtI9vpaA0anXVIUG3K9QB0tfm48LQUVADowOVSrOHs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type UserRole = "restaurant" | "ngo" | "admin" | "society";

export interface User {
  [x: string]: ReactNode;
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  address?: string;
  lat?: number;
  lng?: number;
}

interface AuthContextType {
  user: User | null;
  register: (data: RegisterData) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  register: async () => false,
  login: async () => false,
  logout: async () => {},
  updateProfile: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("resqfood_user");
    return saved ? JSON.parse(saved) : null;
  });

  // 🔹 Register new user
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const { email, password, full_name, phone, role, address, lat, lng } = data;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !authData.user) {
        console.error("Signup failed:", authError?.message);
        return false;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            full_name,
            email,
            phone,
            role,
            address,
            lat,
            lng,
          },
        ])
        .select("*")
        .single();

      if (profileError) {
        console.error("Profile creation failed:", profileError.message);
        return false;
      }

      setUser(profile);
      localStorage.setItem("resqfood_user", JSON.stringify(profile));
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    }
  };

  // 🔹 Login existing user
  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.error("Login failed:", error?.message);
      return false;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!profile) return false;

    setUser(profile);
    localStorage.setItem("resqfood_user", JSON.stringify(profile));
    return true;
  };

  // 🔹 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("resqfood_user");
  };

  // 🔹 Update profile info
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    const { data: updated, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("Profile update failed:", error.message);
      return false;
    }

    setUser(updated);
    localStorage.setItem("resqfood_user", JSON.stringify(updated));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
