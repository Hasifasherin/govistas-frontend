"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { getAdminBookings } from "../../../services/adminBookingService";
import { AdminBooking } from "../../../types/booking";
import BookingStats from "./BookingStats";
import BookingCalendar from "./BookingCalendar";
import BookingTable from "./BookingTable";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    loadBookings();
  }, [month]);

  const loadBookings = async () => {
    try {
      const data = await getAdminBookings(month);
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Booking Management</h1>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>

        {/* Stats */}
        <BookingStats bookings={bookings} />

        {/* Calendar */}
        <BookingCalendar bookings={bookings} />

        {/* Table */}
        <BookingTable bookings={bookings} />
      </div>
    </AdminLayout>
  );
}
