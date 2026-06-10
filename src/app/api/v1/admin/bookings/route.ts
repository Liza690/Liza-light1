import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const providerId = searchParams.get("providerId");

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const filter: Record<string, unknown> = { tenantId };
    if (status) filter.status = status;
    if (providerId) filter.providerId = providerId;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("userId", "name email phone")
        .populate("providerId", "name city")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    return NextResponse.json({
      bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin list bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
