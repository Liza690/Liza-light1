import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { findOverlappingSlot } from "@/lib/helpers/availability";
import { createAvailabilitySchema } from "@/lib/validators/provider";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: providerId } = await params;
    const body = await request.json();
    const parsed = createAvailabilitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    // Check for overlaps before creating any slots
    for (const slot of parsed.data.slots) {
      const conflict = await findOverlappingSlot({ tenantId, providerId, slot });
      if (conflict) {
        const fmt = (s: string) => s.split("-").reverse().join("/");
        const fmtDate = (d: Date) => d.toLocaleDateString("en-IN");
        const dayName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][slot.dayOfWeek];
        const label = slot.specificDate
          ? `date ${fmt(slot.specificDate)}`
          : dayName;
        const conflictDayName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][(conflict as Record<string, unknown>).dayOfWeek as number];
        const conflictLabel = (conflict as Record<string, unknown>).specificDate
          ? `on ${fmtDate(new Date((conflict as Record<string, unknown>).specificDate as Date))}`
          : `on ${conflictDayName}`;
        return NextResponse.json(
          { error: `Slot ${slot.startTime}-${slot.endTime} on ${label} overlaps existing slot ${conflict.startTime}-${conflict.endTime} ${conflictLabel}` },
          { status: 409 }
        );
      }
    }

    const slots = await AvailabilitySlot.insertMany(
      parsed.data.slots.map((slot) => ({
        tenantId,
        providerId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: slot.isRecurring ?? true,
        specificDate: slot.specificDate ? new Date(slot.specificDate) : undefined,
      }))
    );

    return NextResponse.json({ slots }, { status: 201 });
  } catch (error) {
    console.error("Admin create availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: providerId } = await params;
    await dbConnect();
    const tenantId = await resolveTenant(request);

    const slots = await AvailabilitySlot.find({ tenantId, providerId })
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Admin get availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
