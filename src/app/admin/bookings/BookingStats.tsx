import { AdminBooking } from "../../../types/booking";

interface Props {
  bookings: AdminBooking[];
}

export default function BookingStats({ bookings }: Props) {
  const total = bookings.length;
  const accepted = bookings.filter(b => b.status === "accepted").length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const revenue = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.participants, 0);

  const Card = ({ title, value }: { title: string; value: number }) => (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card title="Total Bookings" value={total} />
      <Card title="Accepted" value={accepted} />
      <Card title="Pending" value={pending} />
      <Card title="Paid Participants" value={revenue} />
    </div>
  );
}
