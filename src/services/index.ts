import api, { apiRequest } from '../utils/api';
import {
  Tour,
  Booking,
  Review,
  Notification,
  Message,
  OperatorStats,
  TourFormData,
  BookingStatusUpdate,
  PaymentIntent,
  User,
} from '../types';

// Auth Service
export const authService = {
  login: (email: string, password: string) =>
    apiRequest('POST', '/auth/login', { email, password }),
  
  register: (data: any) =>
    apiRequest('POST', '/auth/register', data),
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
    }
  },
  
  getProfile: () =>
    apiRequest('GET', '/auth/profile'),
};

// Tour Service (Operator & Public)
export const tourService = {
  // Operator-only: Create tour
  createTour: (data: FormData) =>
    api.post('/tours', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // Operator-only: Update tour
  updateTour: (id: string, data: FormData) =>
    api.put(`/tours/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // Operator-only: Delete tour
  deleteTour: (id: string) =>
    apiRequest('DELETE', `/tours/${id}`),
  
  // Public: Get all tours
  getTours: (page = 1, limit = 12) =>
    apiRequest('GET', `/tours?page=${page}&limit=${limit}`),
  
  // Public: Get single tour
  getTourById: (id: string) =>
    apiRequest('GET', `/tours/${id}`),
  
  // Public: Search tours
  searchTours: (filters: {
    title?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    date?: string;
  }) =>
    apiRequest('GET', '/tours/search', null, { params: filters }),
  
  // Public: Check availability
  checkAvailability: (tourId: string, date: string) =>
    apiRequest('GET', `/tours/${tourId}/availability?date=${date}`),
};

// Booking Service
export const bookingService = {
  // User: Create booking
  createBooking: (tourId: string, bookingDate: string, participants: number) =>
    apiRequest('POST', '/bookings', { tourId, bookingDate, participants }),
  
  // User: Get my bookings
  getUserBookings: () =>
    apiRequest('GET', '/bookings/my-bookings'),
  
  // Operator: Get operator bookings
  getOperatorBookings: () =>
    apiRequest('GET', '/bookings/operator'),
  
  // Operator: Update booking status
  updateBookingStatus: (bookingId: string, status: 'accepted' | 'rejected') =>
    apiRequest('PUT', `/bookings/${bookingId}/status`, { status }),
  
  // User: Cancel booking
  cancelBooking: (bookingId: string) =>
    apiRequest('PUT', `/bookings/${bookingId}/cancel`),
};

// Operator Service
export const operatorService = {
  // Get operator's tours
  getMyTours: () =>
    apiRequest('GET', '/operator/tours'),
  
  // Get operator's bookings (same as bookingService but specific endpoint)
  getMyBookings: () =>
    apiRequest('GET', '/operator/bookings'),
  
  // Get operator dashboard stats
  getDashboardStats: async (): Promise<OperatorStats> => {
    try {
      // Fetch both tours and bookings in parallel
      const [toursResponse, bookingsResponse] = await Promise.all([
        operatorService.getMyTours(),
        operatorService.getMyBookings(),
      ]);
      
      const tours = toursResponse.data || [];
      const bookings = bookingsResponse.data || [];
      
      // Calculate statistics
      const totalTours = tours.length;
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(
        (b: Booking) => b.status === 'pending'
      ).length;
      const activeTours = tours.filter(
        (t: Tour) => t.isActive && t.status === 'approved'
      ).length;
      const cancelledBookings = bookings.filter(
        (b: Booking) => b.status === 'cancelled'
      ).length;
      
      // Calculate revenue from accepted bookings
      let totalRevenue = 0;
      bookings.forEach((booking: Booking) => {
        if (booking.status === 'accepted' && typeof booking.tourId !== 'string') {
          const tour = booking.tourId as Tour;
          totalRevenue += tour.price * booking.participants;
        }
      });
      
      return {
        totalTours,
        totalBookings,
        pendingBookings,
        totalRevenue,
        activeTours,
        cancelledBookings,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalTours: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0,
        activeTours: 0,
        cancelledBookings: 0,
      };
    }
  },
  
  // Operator: Update booking status (alias for bookingService.updateBookingStatus)
  updateBookingStatus: (bookingId: string, status: 'accepted' | 'rejected') =>
    bookingService.updateBookingStatus(bookingId, status),
};

// Notification Service
export const notificationService = {
  getMyNotifications: () =>
    apiRequest('GET', '/notifications'),
  
  markAsRead: (notificationId: string) =>
    apiRequest('PUT', `/notifications/${notificationId}/read`),
};

// Message Service
export const messageService = {
  sendMessage: (receiverId: string, message: string) =>
    apiRequest('POST', '/messages', { receiverId, message }),
  
  getConversation: (otherUserId: string) =>
    apiRequest('GET', `/messages/${otherUserId}`),
};

// Review Service
export const reviewService = {
  createReview: (tourId: string, rating: number, comment: string) =>
    apiRequest('POST', '/reviews', { tourId, rating, comment }),
  
  getTourReviews: (tourId: string) =>
    apiRequest('GET', `/reviews/${tourId}`),
  
  updateReview: (reviewId: string, rating: number, comment: string) =>
    apiRequest('PUT', `/reviews/${reviewId}`, { rating, comment }),
  
  deleteReview: (reviewId: string) =>
    apiRequest('DELETE', `/reviews/${reviewId}`),
};

// Payment Service
export const paymentService = {
  createPaymentIntent: (bookingId: string) =>
    apiRequest('POST', '/payments/create-intent', { bookingId }),
};

// User Service
export const userService = {
  updateProfile: (data: Partial<User>) =>
    apiRequest('PUT', '/users/profile', data),
  
  addToWishlist: (tourId: string) =>
    apiRequest('POST', '/users/wishlist', { tourId }),
  
  removeFromWishlist: (tourId: string) =>
    apiRequest('DELETE', `/users/wishlist/${tourId}`),
  
  getWishlist: () =>
    apiRequest('GET', '/users/wishlist'),
  
  getBookingHistory: () =>
    apiRequest('GET', '/users/bookings'),
};

export {
  api,
  apiRequest,
};