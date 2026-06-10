import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { findOverlappingSlot } from "@/lib/helpers/availability";
import { z } from "zod";
import { createAvailabilitySchema } from "@/lib/validators/provider";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const filter: Record<string, unknown> = { tenantId };
    if (providerId) filter.providerId = providerId;

    const slots = await AvailabilitySlot.find(filter).sort({ dayOfWeek: 1, startTime: 1 }).lean();
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Admin list slots error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const schema = createAvailabilitySchema.extend({ providerId: z.string() });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const { providerId, slots } = parsed.data;

    // Check for overlaps before creating any slots
    for (const slot of slots) {
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

    const createdSlots = await Promise.all(
      slots.map((slot) =>
        AvailabilitySlot.create({
          tenantId,
          providerId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isRecurring: slot.isRecurring ?? true,
          specificDate: slot.specificDate ? new Date(slot.specificDate) : undefined,
        })
      )
    );

    return NextResponse.json(createdSlots, { status: 201 });
  } catch (error) {
    console.error("Admin create availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
