import api from "../utils/api";

// Fetch operator's tours
export const getOperatorTours = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/operator/tours", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // array of tours
};

// Fetch operator's booking requests
export const getOperatorBookings = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/operator/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // array of bookings
};
