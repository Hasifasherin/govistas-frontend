export interface AdminBooking {
  _id: string;
  travelDate?: string;
    bookingDate?: string;
  participants: number;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";

  tourId: {
    title: string;
  };

  operatorId: {
    firstName: string;
    lastName: string;
  };
}
