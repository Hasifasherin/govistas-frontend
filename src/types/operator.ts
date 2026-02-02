export interface OperatorTour {
  _id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  category: string;
  availableDates: string[];
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  bookingsCount: number;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  averageRating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorBooking {
  _id: string;
  tourId: {
    _id: string;
    title: string;
  };
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  bookingDate: string;
  participants: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
}

export interface OperatorStats {
  totalTours: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  activeTours: number;
  cancelledBookings?: number;
  monthlyRevenue: { month: string; amount: number }[];
  monthlyBookings: { month: string; count: number }[];
  tourCategories: { category: string; count: number }[];
}
