import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      const authToken = adminToken || token;
      if (authToken && config.headers) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Safe apiRequest helper
export const apiRequest = async <T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });

    // Ensure response.data exists
    if (!response || !response.data) {
      throw new Error("No data returned from API");
    }

    return response.data as T;
  } catch (error: any) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
};

export default api;
