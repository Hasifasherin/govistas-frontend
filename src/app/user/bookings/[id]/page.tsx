"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "../../../../utils/api";
import { Booking } from "../../../../types/booking";
import { FiCalendar, FiUsers, FiMapPin } from "react-icons/fi";

export default function BookingDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`/user/bookings/${id}`);
        setBooking(res.data.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handlePayment = async () => {
    if (!booking) return;

    try {
      await axios.post(`/payments/user/${booking._id}`);
      alert("Payment successful!");
      // ✅ Update paymentStatus, not status
      setBooking({ ...booking, paymentStatus: "paid" });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading booking details...</p>;
  if (!booking) return <p className="text-center mt-10">Booking not found</p>;

  const pricePerPerson = booking.tourId?.price ?? 0;
  const totalPrice = pricePerPerson * booking.participants;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>

      <div className="border rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-2">{booking.tourId?.title ?? "Tour"}</h2>

        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <FiCalendar />{" "}
          {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}
          <FiUsers /> {booking.participants} {booking.participants > 1 ? "people" : "person"}
          <FiMapPin /> {booking.tourId?.location ?? "Unknown"}
        </div>

        <p className="mb-2 text-gray-600">Price per person: ${pricePerPerson}</p>
        <p className="mb-4 text-gray-600">Total: ${totalPrice}</p>

        <p className="text-gray-600 mb-2">
          Booking Status:{" "}
          <span
            className={`font-semibold ${
              booking.status === "accepted"
                ? "text-green-600"
                : booking.status === "rejected"
                ? "text-red-600"
                : booking.status === "pending"
                ? "text-yellow-600"
                : booking.status === "cancelled"
                ? "text-gray-500"
                : "text-blue-600"
            }`}
          >
            {booking.status.toUpperCase()}
          </span>
        </p>

        <p className="text-gray-600 mb-4">
          Payment Status:{" "}
          <span
            className={`font-semibold ${
              booking.paymentStatus === "paid"
                ? "text-blue-600"
                : booking.paymentStatus === "refunded"
                ? "text-purple-600"
                : "text-red-600"
            }`}
          >
            {booking.paymentStatus.toUpperCase()}
          </span>
        </p>

        {/* Pay Button only for accepted bookings that are unpaid */}
        {booking.status === "accepted" && booking.paymentStatus === "unpaid" && (
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
}
