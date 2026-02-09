import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../types";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Optional: timeout to avoid hanging requests
});

// Add auth token automatically (client-side only)
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

    console.debug("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        window.location.href = "/auth/login";
      }
    }
    console.error("API Response Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Safe apiRequest helper
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

    if (!response || !response.data) {
      throw new Error("No data returned from API");
    }

    return response.data as T;
  } catch (error: any) {
    // ✅ Distinguish network errors
    if (!error.response) {
      console.error(
        `Network or CORS error on ${method} ${url}. Make sure backend is running and CORS is enabled.`,
        error
      );
    } else {
      console.error(`API Error (${method} ${url}):`, error.response.data || error.message);
    }
    throw error;
  }
};

// =============================
// Booking-specific API helpers
// =============================

// Update booking status (Accept / Reject / Cancel)
export const updateBookingStatus = async (
  bookingId: string,
  status: "pending" | "accepted" | "rejected" | "cancelled"
): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>("PUT", `/operator/bookings/${bookingId}/status`, { status });
};

// =============================
// Example other helpers you might already have
// =============================

// Fetch operator bookings
export const getOperatorBookings = async (): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>("GET", "/operator/bookings");
};

// Fetch booking details
export const getBookingDetails = async (bookingId: string): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>("GET", `/operator/bookings/${bookingId}`);
};

// Fetch operator dashboard stats
export const getOperatorDashboard = async (): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>("GET", "/operator/dashboard");
};

export default api;
