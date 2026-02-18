import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBookingPaymentStatus } from "../../../../../services/adminBookingService";

export async function POST(
  req: NextRequest,
  context: { params: { bookingId: string } }
): Promise<NextResponse> {
  const { bookingId } = context.params;

  if (!bookingId) {
    return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
  }

  try {
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "accepted") {
      return NextResponse.json({ error: "Booking not yet accepted by operator" }, { status: 400 });
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json({ error: "Booking already paid" }, { status: 400 });
    }

    const updatedBooking = await updateBookingPaymentStatus(bookingId, "paid");

    return NextResponse.json({ message: "Payment confirmed", booking: updatedBooking });
  } catch (err: any) {
    console.error("Payment confirm error:", err);
    return NextResponse.json({ error: "Payment failed. Please try again later." }, { status: 500 });
  }
}
