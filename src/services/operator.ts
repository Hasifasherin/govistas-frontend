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
  
  // Update booking status
  updateBookingStatus: (bookingId: string, status: 'accepted' | 'rejected'): Promise<{ success: boolean; booking: OperatorBooking }> =>
    api.put(`/bookings/${bookingId}/status`, { status }),

  // ================= DASHBOARD STATS =================
  getDashboardStats: async (): Promise<OperatorStats> => {
    try {
      const [toursResponse, bookingsResponse] = await Promise.all([
        operatorAPI.getMyTours(),
        operatorAPI.getMyBookings()
      ]);

      const tours = toursResponse.success ? toursResponse.tours : [];
      const bookings = bookingsResponse.success ? bookingsResponse.bookings : [];

      const totalTours = tours.length;
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const activeTours = tours.filter(t => t.status === 'approved' && t.isActive).length;

      // Revenue
      let totalRevenue = 0;
      bookings.forEach(b => {
        if (b.status === 'accepted' && b.tourId) {
          const tour = tours.find(t => t._id === (b.tourId as any)._id);
          if (tour) totalRevenue += tour.price * b.participants;
        }
      });

      // Last 6 months
      const months = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toLocaleString('default', { month: 'short', year: 'numeric' });
      }).reverse();

      const monthlyRevenue = months.map(month => {
        const amount = bookings
          .filter(b => b.status === 'accepted')
          .filter(b => {
            const bDate = new Date(b.bookingDate);
            const bMonth = bDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            return bMonth === month;
          })
          .reduce((sum, b) => {
            const tour = tours.find(t => t._id === (b.tourId as any)._id);
            return tour ? sum + tour.price * b.participants : sum;
          }, 0);
        return { month, amount };
      });

      const monthlyBookings = months.map(month => {
        const count = bookings.filter(b => {
          const bMonth = new Date(b.bookingDate).toLocaleString('default', { month: 'short', year: 'numeric' });
          return bMonth === month;
        }).length;
        return { month, count };
      });

      // Tour categories
      const tourCategories: { category: string; count: number }[] = [];
      tours.forEach(t => {
        const idx = tourCategories.findIndex(c => c.category === t.category);
        if (idx >= 0) tourCategories[idx].count += 1;
        else tourCategories.push({ category: t.category, count: 1 });
      });

      return {
        totalTours,
        totalBookings,
        pendingBookings,
        totalRevenue,
        activeTours,
        monthlyRevenue,
        monthlyBookings,
        tourCategories
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalTours: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0,
        activeTours: 0,
        monthlyRevenue: [],
        monthlyBookings: [],
        tourCategories: []
      };
    }
  }
};
