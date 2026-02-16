"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiRequest } from "../../../../utils/api";
import { Tour } from "../../../../types/tour";
import { FiCalendar, FiUsers, FiMapPin } from "react-icons/fi";

export default function CreateBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tourId = searchParams.get("tourId") || "";
  const selectedDate = searchParams.get("date") || "";
  const people = Number(searchParams.get("people")) || 1;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [dateError, setDateError] = useState(""); // Show error if no date selected

  // Fetch tour details
  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) return;

      try {
        const res = await apiRequest<{ tour: Tour }>("GET", `/tours/${tourId}`);
        setTour(res.tour);
      } catch (err) {
        console.error("Failed to fetch tour:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  const totalPrice = (tour?.price ?? 0) * people;

  // Handle payment
  const handlePayment = async () => {
    if (!tour) return;

    if (!selectedDate) {
      setDateError("Please select a date before payment");
      return;
    } else {
      setDateError("");
    }

    try {
      setPaymentLoading(true);

      // Make payment request to backend
      const paymentResponse = await apiRequest<{ paymentIntentId: string }>(
        "POST",
        "/payments/user",
        {
          tourId: tour._id,
          date: selectedDate,
          participants: people,
          amount: totalPrice,
        }
      );

      console.log("Payment Response:", paymentResponse);
      alert("Payment successful!");

      router.push("/user/bookings"); // redirect to user's bookings
    } catch (err: any) {
      console.error("Payment failed:", err);
      alert(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading booking details...</p>;
  if (!tour) return <p className="text-center mt-10">Tour not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 space-y-12 font-sans">
      <h1 className="text-3xl font-bold mb-6">Confirm Your Booking</h1>

      <div className="border rounded-xl p-6 shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">{tour.title}</h2>

        <div className="flex items-center gap-4 text-gray-600">
          <FiCalendar /> {selectedDate ? new Date(selectedDate).toLocaleDateString() : "No date selected"}
          <FiUsers /> {people} {people > 1 ? "people" : "person"}
          <FiMapPin /> {tour.location}
        </div>

        <p className="text-gray-600">Price per person: ${tour.price}</p>
        <p className="text-gray-600">Total: ${totalPrice}</p>

        {dateError && <p className="text-red-500 text-sm">{dateError}</p>}

        <button
          onClick={handlePayment}
          disabled={paymentLoading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {paymentLoading ? "Processing..." : "Pay & Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
