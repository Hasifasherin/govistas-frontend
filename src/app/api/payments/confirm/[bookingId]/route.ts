import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBookingPaymentStatus } from "../../../../../services/adminBookingService";

// Optional: explicitly type the POST handler for Next.js 13+
export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
): Promise<NextResponse> {
  const { bookingId } = params;

  if (!bookingId) {
    return NextResponse.json(
      { error: "Booking ID is required" },
      { status: 400 }
    );
  }

  try {
    //  Fetch the booking
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    //  Check operator approval
    if (booking.status !== "accepted") {
      return NextResponse.json(
        { error: "Booking not yet accepted by operator" },
        { status: 400 }
      );
    }

    //  Check if already paid
    if (booking.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Booking already paid" },
        { status: 400 }
      );
    }

    //  Update payment status
    const updatedBooking = await updateBookingPaymentStatus(
      bookingId,
      "paid"
    );

    //  Respond success
    return NextResponse.json({
      message: "Payment confirmed",
      booking: updatedBooking,
    });

  } catch (err: any) {
    console.error("Payment confirm error:", err);
    return NextResponse.json(
      { error: "Payment failed. Please try again later." },
      { status: 500 }
    );
  }
}
