"use client";

import { AdminBooking } from "../../../types/booking";

interface Props {
  bookings: AdminBooking[];
}

export default function BookingCalendar({ bookings }: Props) {
  const grouped = bookings.reduce<Record<string, AdminBooking[]>>(
    (acc, booking) => {
      const rawDate =
        booking.travelDate || booking.bookingDate;

      if (!rawDate) return acc;

      const date = new Date(rawDate).toISOString().slice(0, 10);

      acc[date] = acc[date] || [];
      acc[date].push(booking);
      return acc;
    },
    {}
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">Monthly Booking Overview</h2>

      <div className="grid grid-cols-7 gap-2 text-sm">
        {Object.entries(grouped).map(([date, items]) => (
          <div
            key={date}
            className="border rounded p-2 bg-gray-50"
          >
            <p className="font-medium">{date}</p>
            <p className="text-xs text-gray-600">
              {items.length} bookings
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
