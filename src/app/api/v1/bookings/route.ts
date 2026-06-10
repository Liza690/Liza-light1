import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import ServiceProvider from "@/lib/models/ServiceProvider";
import Service from "@/lib/models/Service";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { generateBookingId } from "@/lib/helpers/booking";
import { createBookingSchema } from "@/lib/validators/booking";

export async function POST(request: Request) {
  try {
    const session = await auth();

    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const provider = await ServiceProvider.findOne({
      _id: parsed.data.providerId,
      tenantId,
    });
    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    const services = await Service.find({
      _id: { $in: parsed.data.serviceIds },
      tenantId,
      isActive: true,
    });

    if (services.length !== parsed.data.serviceIds.length) {
      return NextResponse.json(
        { error: "One or more services not found or inactive" },
        { status: 400 }
      );
    }

    // ── DOUBLE-BOOKING GUARD ──────────────────────────────────────────────────
    // 1. Check there is no active booking for this provider on the same date + startTime
    const bookingDate = new Date(parsed.data.date);
    const startOfDay = new Date(bookingDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const conflictingBooking = await Booking.findOne({
      tenantId,
      providerId: parsed.data.providerId,
      date: { $gte: startOfDay, $lte: endOfDay },
      startTime: parsed.data.startTime,
      status: { $ne: "cancelled" },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose a different slot." },
        { status: 409 }
      );
    }

    // 2. Atomically mark date-specific slots as booked (prevents race conditions).
    //    Recurring weekly slots stay `isBooked: false` — they are always available
    //    for future weeks. Double-booking on recurring slots is prevented by the
    //    Booking conflict check above.
    const slotSpecificDateStart = new Date(bookingDate);
    slotSpecificDateStart.setUTCHours(0, 0, 0, 0);
    const slotSpecificDateEnd = new Date(bookingDate);
    slotSpecificDateEnd.setUTCHours(23, 59, 59, 999);

    // Try date-specific slot first
    const dateSpecificUpdate = await AvailabilitySlot.findOneAndUpdate(
      {
        tenantId,
        providerId: parsed.data.providerId,
        startTime: parsed.data.startTime,
        isBooked: false,
        isRecurring: false,
        specificDate: { $gte: slotSpecificDateStart, $lt: slotSpecificDateEnd },
      },
      { $set: { isBooked: true } },
      { new: true }
    );

    // If no date-specific slot matched, verify a recurring slot exists (don't mark it)
    if (!dateSpecificUpdate) {
      const dayOfWeek = bookingDate.getDay();
      const recurringSlot = await AvailabilitySlot.findOne({
        tenantId,
        providerId: parsed.data.providerId,
        dayOfWeek,
        startTime: parsed.data.startTime,
        $or: [
          { isRecurring: true },
          { isRecurring: { $exists: false } },
        ],
      });

      if (!recurringSlot) {
        return NextResponse.json(
          { error: "This time slot is not available. Please choose a different slot." },
          { status: 409 }
        );
      }
      // Do NOT set isBooked on recurring slots — they're per-week, not one-time.
    }
    // ─────────────────────────────────────────────────────────────────────────

    const totalAmount = services.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

    const servicesSnapshot = services.map((s) => ({
      serviceId: s._id,
      name: s.name,
      price: s.price,
      duration: s.duration,
      category: s.category,
    }));

    const bookingId = generateBookingId();

    const booking = await Booking.create({
      tenantId,
      bookingId,
      userId: (session?.user?.id && /^[0-9a-fA-F]{24}$/.test(session.user.id)) ? session.user.id : undefined,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      providerId: parsed.data.providerId,
      serviceIds: parsed.data.serviceIds,
      servicesSnapshot,
      date: bookingDate,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      duration: totalDuration,
      totalAmount,
      notes: parsed.data.notes,
      status: "pending",
    });

    const TenantModel = await import("@/lib/models/Tenant").then(
      (m) => m.default
    );
    const tenant = await TenantModel.findOne({ tenantId }).lean() as Record<string, unknown> | null;

    return NextResponse.json(
      {
        booking: {
          ...booking.toObject(),
          servicesSnapshot,
        },
        whatsappLink: (tenant as { whatsappNumber?: string } | null)?.whatsappNumber
          ? `https://wa.me/${(tenant as { whatsappNumber: string }).whatsappNumber}?text=${encodeURIComponent(
              `Hi, I want to book ${provider.name} for ${services.map((s) => s.name).join(", ")} on ${new Date(parsed.data.date).toLocaleDateString("en-IN", { day:"2-digit", month:"2-digit", year:"numeric" })} at ${parsed.data.startTime}. Booking ID: ${bookingId}`
            )}`
          : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
