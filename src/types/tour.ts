export interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  duration: number;
  maxGroupSize: number;
  category: string;
  availableDates: string[];
  image: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  averageRating: number;
  reviewsCount: number;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
// in types/tour.ts
export interface TourFilters {
  title?: string;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface OperatorTour extends Tour {
  bookingsCount: number;
}