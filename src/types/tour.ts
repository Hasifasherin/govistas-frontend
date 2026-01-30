// types/tour.ts
export interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  duration: number;
  maxGroupSize: number;
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

// types/operator.ts - UPDATE THIS
export interface OperatorTour extends Tour {
  bookingsCount: number;
}