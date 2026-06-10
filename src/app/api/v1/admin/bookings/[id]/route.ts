import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import ServiceProvider from "@/lib/models/ServiceProvider";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { BOOKING_STATUSES } from "@/lib/constants";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body.status || !Object.values(BOOKING_STATUSES).includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const booking = await Booking.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: { status: body.status } },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (body.status === "completed") {
      await ServiceProvider.findByIdAndUpdate(booking.providerId, {
        $inc: { totalBookings: 1 },
      });
    }

    // When a booking is cancelled, free the slot back up so it can be rebooked
    if (body.status === "cancelled") {
      const dayOfWeek = new Date(booking.date).getDay();
      await AvailabilitySlot.findOneAndUpdate(
        {
          tenantId,
          providerId: booking.providerId,
          dayOfWeek,
          startTime: booking.startTime,
          isBooked: true,
        },
        { $set: { isBooked: false } }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Admin update booking status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
