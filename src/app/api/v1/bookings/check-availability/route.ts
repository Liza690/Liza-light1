import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import Booking from "@/lib/models/Booking";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");
    const date = searchParams.get("date");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    if (!providerId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: 400 }
      );
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const dayOfWeek = new Date(date).getDay();

    const slot = await AvailabilitySlot.findOne({
      tenantId,
      providerId,
      dayOfWeek,
      startTime,
      endTime,
      isBooked: false,
    });

    if (!slot) {
      return NextResponse.json({ available: false });
    }

    const existingBooking = await Booking.findOne({
      tenantId,
      providerId,
      date: new Date(date),
      startTime,
      status: { $ne: "cancelled" },
    });

    return NextResponse.json({ available: !existingBooking });
  } catch (error) {
    console.error("Check availability error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
