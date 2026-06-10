import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ServiceProvider from "@/lib/models/ServiceProvider";
import Service from "@/lib/models/Service";
import Review from "@/lib/models/Review";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import Booking from "@/lib/models/Booking";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const tenantId = await resolveTenant(request);

    const provider = await ServiceProvider.findOne({
      _id: id,
      tenantId,
    }).lean();

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    const [services, reviews, availability, rawBookings] = await Promise.all([
      Service.find({ tenantId, providerId: id, isActive: true }).lean(),
      Review.find({ tenantId, providerId: id })
        .populate("userId", "name avatar")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      AvailabilitySlot.find({ tenantId, providerId: id })
        .sort({ specificDate: 1, dayOfWeek: 1, startTime: 1 })
        .lean(),
      Booking.find({
        tenantId,
        providerId: id,
        status: { $ne: "cancelled" },
      })
        .select("date startTime")
        .lean() as unknown as { date: Date; startTime: string }[],
    ]);

    // Build a Set of "YYYY-MM-DD|startTime" for all existing bookings
    // so the frontend can quickly check if any occurrence is taken
    const bookedSlots = new Set<string>();
    for (const b of rawBookings) {
      const ds = new Date(b.date).toISOString().split("T")[0];
      bookedSlots.add(`${ds}|${b.startTime}`);
    }

    return NextResponse.json({
      ...provider,
      services,
      reviews,
      availability,
      bookedSlots: Array.from(bookedSlots),
    });
  } catch (error: any) {
    if (error?.name === "CastError") {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }
    console.error("Get provider error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
