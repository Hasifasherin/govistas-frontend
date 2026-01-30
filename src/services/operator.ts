// services/operator.ts - COMPLETE VERSION
import api from '../utils/api';
import { OperatorTour, OperatorBooking, OperatorStats } from '../types/operator';
import { Tour } from '../types/tour';

export const operatorAPI = {
  // Get operator's tours
  getMyTours: (): Promise<{ success: boolean; tours: OperatorTour[]; count?: number }> =>
    api.get('/operator/tours'),
  
  // Get operator's bookings
  getMyBookings: (): Promise<{ success: boolean; bookings: OperatorBooking[]; count?: number }> =>
    api.get('/operator/bookings'),
  
  // Get all tours (public)
  getAllTours: (page = 1, limit = 10): Promise<{ 
    success: boolean; 
    tours: Tour[]; 
    count: number; 
    total: number; 
    page: number 
  }> =>
    api.get(`/tours?page=${page}&limit=${limit}`),
  
  // Get single tour
  getTour: (id: string): Promise<{ success: boolean; tour: Tour }> =>
    api.get(`/tours/${id}`),
  
  // Create tour
  createTour: (data: FormData): Promise<{ success: boolean; tour: Tour }> =>
    api.post('/tours', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Update tour
  updateTour: (id: string, data: FormData): Promise<{ success: boolean; tour: Tour }> =>
    api.put(`/tours/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Delete tour
  deleteTour: (id: string): Promise<{ success: boolean; message: string }> =>
    api.delete(`/tours/${id}`),
  
  // Search tours
  searchTours: (filters: any): Promise<{ success: boolean; tours: Tour[]; count: number }> =>
    api.get('/tours/search', { params: filters }),
  
  // Check availability
  checkAvailability: (id: string, date: string): Promise<{ 
    success: boolean; 
    maxGroupSize: number; 
    bookedSlots: number; 
    availableSlots: number 
  }> =>
    api.get(`/tours/${id}/availability?date=${date}`),
  
  // Calculate dashboard stats
  getDashboardStats: async (): Promise<OperatorStats> => {
    try {
      const [toursResponse, bookingsResponse] = await Promise.all([
        operatorAPI.getMyTours(),
        operatorAPI.getMyBookings()
      ]);
      
      const tours = toursResponse.success ? toursResponse.tours : [];
      const bookings = bookingsResponse.success ? bookingsResponse.bookings : [];
      
      // Calculate stats
      const totalTours = tours.length;
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      
      // Calculate revenue (sum of accepted bookings * tour price)
      let totalRevenue = 0;
      bookings.forEach(booking => {
        if (booking.status === 'accepted' && booking.tourId) {
          const tour = tours.find(t => t._id === (booking.tourId as any)._id);
          if (tour) {
            totalRevenue += tour.price * booking.participants;
          }
        }
      });
      
      return {
        totalTours,
        totalBookings,
        pendingBookings,
        totalRevenue
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalTours: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0
      };
    }
  },
  
  // Update booking status
  updateBookingStatus: (bookingId: string, status: 'accepted' | 'rejected'): Promise<{ success: boolean; booking: OperatorBooking }> =>
    api.put(`/bookings/${bookingId}/status`, { status })
};