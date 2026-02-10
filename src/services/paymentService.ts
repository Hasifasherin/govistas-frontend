import { apiRequest } from "../utils/api";
import { Booking } from "../types/booking";

// Operator payments come from bookings
export const getOperatorPayments = async (): Promise<Booking[]> => {
  const data = await apiRequest<{ bookings: Booking[] }>(
    "GET",
    "/operator/bookings"
  );

  return data.bookings;
};

export const refundPayment = async (bookingId: string, reason?: string) => {
  return apiRequest("POST", "/payments/refund", {
    bookingId,
    reason
  });
};
