"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "../../utils/api";
import type { User } from "../../types/user";
import { useAppDispatch } from "../../hooks/useAdminRedux";
import { setAdminUser, logout as adminLogout } from "../../redux/slices/adminSlice";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem("token") || localStorage.getItem("adminToken");
        const storedUser = localStorage.getItem("user");
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // If admin token exists, set in Redux
          if (localStorage.getItem("adminToken")) {
            dispatch(setAdminUser(JSON.parse(storedUser)));
          }
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [dispatch]);

  const register = async (data: any) => {
    const res = await axios.post("/auth/register", data);
    const userData = {
      _id: res.data.user._id,
      firstName: res.data.user.firstName,
      lastName: res.data.user.lastName,
      email: res.data.user.email,
      role: res.data.user.role,
    };
    
    setUser(userData);
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const login = async (email: string, password: string): Promise<User> => {
    const res = await axios.post("/auth/login", { email, password });
    const loggedInUser: User = {
      _id: res.data.user._id,
      firstName: res.data.user.firstName,
      lastName: res.data.user.lastName,
      email: res.data.user.email,
      role: res.data.user.role,
    };
    
    setUser(loggedInUser);
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const adminLogin = async (email: string, password: string): Promise<User> => {
    const res = await axios.post("/admin/login", { email, password });
    const adminUser: User = {
      _id: "admin-id",
      firstName: "Admin",
      lastName: "User",
      email: res.data.user.email || email,
      role: "admin",
    };
    
    setUser(adminUser);
    setToken(res.data.token);
    dispatch(setAdminUser(adminUser));
    localStorage.setItem("adminToken", res.data.token);
    localStorage.setItem("user", JSON.stringify(adminUser));
    return adminUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    dispatch(adminLogout());
    
    // Redirect to home page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      loading,
      register, 
      login, 
      adminLogin, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};