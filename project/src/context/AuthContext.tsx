// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";

interface Workspace {
  id: string;
  name: string;
  is_home: boolean;
  user_id: string;
}

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    role: "restaurant" | "society" | "ngo";
    address: string;
    lat: number;
    lng: number;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("resqfood_user");
    const savedWorkspace = localStorage.getItem("resqfood_workspace");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedWorkspace) setWorkspace(JSON.parse(savedWorkspace));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setWorkspace(data.workspace);
        localStorage.setItem("resqfood_user", JSON.stringify(data.user));
        localStorage.setItem("resqfood_workspace", JSON.stringify(data.workspace));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const register = async (userData: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    role: "restaurant" | "society" | "ngo";
    address: string;
    lat: number;
    lng: number;
  }): Promise<boolean> => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setWorkspace(data.workspace);
        localStorage.setItem("resqfood_user", JSON.stringify(data.user));
        localStorage.setItem("resqfood_workspace", JSON.stringify(data.workspace));
        return true;
      } else {
        console.error("Registration error:", data.error);
        return false;
      }
    } catch (err) {
      console.error("Registration failed:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setWorkspace(null);
    localStorage.removeItem("resqfood_user");
    localStorage.removeItem("resqfood_workspace");
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("resqfood_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, workspace, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
