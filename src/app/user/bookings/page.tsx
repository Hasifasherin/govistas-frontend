"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "../../../utils/api";
import { Tour } from "../../../types/tour";

export default function CreateBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tourId = searchParams.get("tourId");
  const date = searchParams.get("date") || "";
  const people = Number(searchParams.get("people")) || 1;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---------------- FETCH TOUR ----------------
  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) {
        setError("No tour selected");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`/tours/${tourId}`);
        setTour(res.data.tour);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch tour");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [tourId]);

  // ---------------- HANDLERS ----------------
  const handleBooking = async () => {
    if (!tourId || !date || people < 1) return;

    try {
      setSubmitting(true);
      const res = await axios.post("/bookings", {
        tourId,
        travelDate: date,
        participants: people,
      });
      alert("Booking requested successfully!");
      router.push(`/user/bookings/${res.data.booking._id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExplore = () => router.push("/"); // Home
  const handleWishlist = () => router.push("/user/wishlist"); // Wishlist

  // ---------------- UI STATES ----------------
  if (loading)
    return (
      <p className="text-center mt-20 text-gray-600 text-lg font-medium">
        Loading tour details...
      </p>
    );

  if (error || !tour)
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
        <div className="bg-white border rounded-xl shadow-lg p-10 max-w-md text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {error || "No tour selected"}
          </h2>
          <p className="text-gray-600">
            Please explore tours or view your wishlist to book your favorite experiences.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleExplore}
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Explore Tours
            </button>
            <button
              onClick={handleWishlist}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
            >
              View Wishlist
            </button>
          </div>
        </div>
      </div>
    );

  // ---------------- BOOKING CARD ----------------
  const totalPrice = tour.price * people;

  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-12 text-center">Confirm Your Booking</h1>

      <div className="flex flex-col lg:flex-row gap-12 justify-center items-start">
        {/* ---------------- TOUR PREVIEW ---------------- */}
        <div className="border rounded-xl overflow-hidden shadow-lg max-w-md w-full">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{tour.title}</h2>
            <p className="text-gray-600 mb-1">{tour.location}</p>
            <p className="text-gray-800 font-semibold text-lg">${tour.price} / person</p>
          </div>
        </div>

        {/* ---------------- BOOKING SUMMARY ---------------- */}
        <div className="border rounded-xl p-6 shadow-lg max-w-md w-full flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

            <div className="space-y-3 text-gray-700 mb-6">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Participants:</span>
                <span>{people}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 text-lg">
                <span>Total Price:</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleBooking}
              disabled={submitting}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Request Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
