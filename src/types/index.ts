// Base User Interface
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dob: string;
  password?: string; // Only for forms, not from API
  role: "user" | "operator" | "admin";
  wishlist?: string[]; // Array of tour IDs
  isBlocked?: boolean;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tour Interface (from your backend Tour model)
export interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  duration: number; // in hours
  maxGroupSize: number;
  availableDates: string[];
  image: string;
  createdBy: string | User; // Can be ID or populated user
  averageRating: number;
  reviewsCount: number;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Booking Interface (from your backend Booking model)
export interface Booking {
  _id: string;
  tourId: string | Tour;
  userId: string | User;
  bookingDate: string;
  participants: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// Review Interface
export interface Review {
  _id: string;
  tourId: string | Tour;
  userId: string | User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Interface
export interface Notification {
  _id: string;
  user: string | User;
  title: string;
  message: string;
  type: "booking" | "payment" | "system";
  isRead: boolean;
  createdAt: string;
}

// Message Interface
export interface Message {
  _id: string;
  sender: string | User;
  receiver: string | User;
  message: string;
  read: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  page?: number;
  total?: number;
}

// Operator Specific Types
export interface OperatorStats {
  totalTours: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  activeTours: number;
  cancelledBookings: number;
}

// Form Types
export interface TourFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  duration: number;
  maxGroupSize: number;
  availableDates: string[];
  image: File | string;
}

export interface BookingStatusUpdate {
  status: "accepted" | "rejected";
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone: string;
  gender: "male" | "female";
  dob: string;
  role?: "user" | "operator";
}

// Payment Types
export interface PaymentIntent {
  clientSecret: string;
}