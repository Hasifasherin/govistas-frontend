import { AdminBooking } from "../../../types/booking";

interface Props {
  bookings: AdminBooking[];
}

export default function BookingTable({ bookings }: Props) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Tour</th>
            <th className="p-3 text-left">People</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Payment</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            // Operator display: firstName + lastName or email
            let operatorDisplay = "N/A";
            if (b.operatorId) {
              const first = b.operatorId.firstName?.trim();
              const last = b.operatorId.lastName?.trim();
              if (first || last) {
                operatorDisplay = `${first || ""} ${last || ""}`.trim();
              } else if ((b.operatorId as any).email) {
                operatorDisplay = (b.operatorId as any).email;
              }
            }

            return (
              <tr key={b._id} className="border-t">
                <td className="p-3">
                  {b.travelDate
                    ? new Date(b.travelDate).toDateString()
                    : b.bookingDate
                    ? new Date(b.bookingDate).toDateString()
                    : "N/A"}
                </td>
                <td className="p-3">{b.tourId?.title || "N/A"}</td>
                <td className="p-3">{b.participants || 0}</td>
                <td className="p-3 capitalize">{b.status}</td>
                <td className="p-3 capitalize">{b.paymentStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <p className="p-4 text-center text-gray-500">No bookings found</p>
      )}
    </div>
  );
}
