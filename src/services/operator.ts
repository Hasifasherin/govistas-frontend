import api from "../utils/api";
import { OperatorTour, OperatorBooking, OperatorStats } from "../types/operator";
import { Tour } from "../types/tour";

export const operatorAPI = {
  // ================= TOURS =================
  getMyTours: (): Promise<{ success: boolean; tours: OperatorTour[]; count?: number }> =>
    api.get('/operator/tours'),

  createTour: (data: FormData): Promise<{ success: boolean; tour: Tour }> =>
    api.post('/tours', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updateTour: (id: string, data: FormData): Promise<{ success: boolean; tour: Tour }> =>
    api.put(`/tours/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  deleteTour: (id: string): Promise<{ success: boolean; message: string }> =>
    api.delete(`/tours/${id}`),

  // ================= BOOKINGS =================
  getMyBookings: (): Promise<{ success: boolean; bookings: OperatorBooking[]; count?: number }> =>
    api.get('/operator/bookings'),

  updateBookingStatus: (bookingId: string, status: 'accepted' | 'rejected'): Promise<{ success: boolean; booking: OperatorBooking }> =>
    api.put(`/operator/bookings/${bookingId}/status`, { status }),

  getBookingDetails: (bookingId: string): Promise<{ success: boolean; booking: OperatorBooking }> =>
    api.get(`/operator/bookings/${bookingId}`),

  // ================= DASHBOARD STATS =================
  getDashboardStats: (): Promise<{ success: boolean; stats: OperatorStats }> =>
    api.get('/operator/dashboard'),

  // ================= OPTIONAL: CHART DATA =================
  getBookingStatistics: (): Promise<{ success: boolean; stats: OperatorStats }> =>
    api.get('/operator/statistics'),

  // ================= PUBLIC TOURS =================
  getAllTours: (page = 1, limit = 10): Promise<{ 
    success: boolean; 
    tours: Tour[]; 
    count: number; 
    total: number; 
    page: number 
  }> =>
    api.get(`/tours?page=${page}&limit=${limit}`),

  getTour: (id: string): Promise<{ success: boolean; tour: Tour }> =>
    api.get(`/tours/${id}`),

  searchTours: (filters: any): Promise<{ success: boolean; tours: Tour[]; count: number }> =>
    api.get('/tours/search', { params: filters }),

  checkAvailability: (id: string, date: string): Promise<{ 
    success: boolean; 
    maxGroupSize: number; 
    bookedSlots: number; 
    availableSlots: number 
  }> =>
    api.get(`/tours/${id}/availability?date=${date}`),
};
