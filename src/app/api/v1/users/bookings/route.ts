import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const filter: Record<string, unknown> = {
      tenantId,
      userId: session.user.id,
    };
    if (status) filter.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("providerId", "name city profileImages")
        .populate("servicesSnapshot")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Booking.countDocuments(filter),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user bookings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
