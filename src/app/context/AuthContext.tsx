"use client"; 

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "../../utils/api"; 

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: "user" | "operator" | "admin";
}

interface AuthContextType {
  user: User | null;
  register: (data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const register = async (data: any) => {
    const res = await axios.post("/auth/register", data);
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);
  };

  const login = async (email: string, password: string): Promise<User> => {
    const res = await axios.post("/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  };

  const adminLogin = async (email: string, password: string): Promise<User> => {
    const res = await axios.post("/admin/login", { email, password });
    const adminUser: User = { email, role: "admin" };
    setUser(adminUser);
    localStorage.setItem("adminToken", res.data.token);
    return adminUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
