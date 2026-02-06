export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Tour {
  _id: string;
  title: string;
  location?: string;
  price?: number;
}

export interface Review {
  _id: string;
  tourId: Tour | null;
  userId: User | null;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
