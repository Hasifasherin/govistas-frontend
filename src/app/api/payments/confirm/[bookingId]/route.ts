import { NextRequest, NextResponse } from "next/server";
import { getBookingById, updateBookingPaymentStatus } from "../../../../../services/adminBookingService";

export async function POST(
    req: NextRequest,
    { params }: { params: { bookingId: string } }
) {
    const { bookingId } = params;

    if (!bookingId) {
        return NextResponse.json(
            { error: "Booking ID is required" },
            { status: 400 }
        );
    }

    try {
        // 1️⃣ Fetch the booking
        const booking = await getBookingById(bookingId);

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // 2️⃣ Check operator approval
        if (booking.status !== "accepted") {
            return NextResponse.json(
                { error: "Booking not yet accepted by operator" },
                { status: 400 }
            );
        }

        // 3️⃣ Check if already paid
        if (booking.paymentStatus === "paid") {
            return NextResponse.json(
                { error: "Booking already paid" },
                { status: 400 }
            );
        }

        // 4️⃣ Update payment status
        const updatedBooking = await updateBookingPaymentStatus(
            bookingId,
            "paid"
        );

        // 5️⃣ Respond success
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
