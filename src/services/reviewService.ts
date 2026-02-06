import axios from "axios";

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  tourId?: {
    _id: string;
    title: string;
    location?: string;
    price?: number;
  } | null;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { _id: number; count: number }[];
}

export interface AdminReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { _id: number; count: number }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAdminReviews = async (): Promise<AdminReviewsResponse> => {
  const token = localStorage.getItem("adminToken");
  const { data } = await axios.get<AdminReviewsResponse>(`${API_URL}/admin/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteAdminReview = async (id: string): Promise<void> => {
  const token = localStorage.getItem("adminToken");
  await axios.delete(`${API_URL}/admin/reviews/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
