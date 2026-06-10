import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const filter: Record<string, unknown> = {
      tenantId,
      providerId: id,
    };

    if (date) {
      const dayOfWeek = new Date(date).getDay();
      filter.$or = [
        { isRecurring: true, dayOfWeek },
        { isRecurring: false, specificDate: new Date(date) },
      ];
    } else {
      filter.isRecurring = true;
    }

    const slots = await AvailabilitySlot.find(filter)
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Get availability error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
