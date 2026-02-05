import API from "../utils/api";
import { AdminBooking } from "../types/booking";

export const getAdminBookings = async (month: string) => {
  const res = await API.get(`/admin/bookings?month=${month}`);
  return res.data.bookings as AdminBooking[];
};
