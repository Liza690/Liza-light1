import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { findOverlappingSlot } from "@/lib/helpers/availability";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slotId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slotId } = await params;
    const body = await request.json();

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const existing = await AvailabilitySlot.findOne({ _id: slotId, tenantId }).lean();
    if (!existing) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    const e = existing as Record<string, unknown>;
    const providerId = e.providerId as string;

    const effectiveSlot = {
      dayOfWeek: body.dayOfWeek ?? (e.dayOfWeek as number),
      startTime: body.startTime ?? (e.startTime as string),
      endTime: body.endTime ?? (e.endTime as string),
      isRecurring: body.specificDate ? false : body.isRecurring ?? (e.isRecurring as boolean),
      specificDate: body.specificDate
        ? body.specificDate
        : body.specificDate === null
        ? undefined
        : e.specificDate
        ? new Date(e.specificDate as Date).toISOString().split("T")[0]
        : undefined,
    };

    const conflict = await findOverlappingSlot({
      tenantId,
      providerId,
      slot: effectiveSlot,
      excludeId: slotId,
    });

    if (conflict) {
      const fmt = (s: string) => s.split("-").reverse().join("/");
      const fmtDate = (d: Date) => d.toLocaleDateString("en-IN");
      const dayName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][effectiveSlot.dayOfWeek];
      const label = effectiveSlot.specificDate
        ? `date ${fmt(effectiveSlot.specificDate)}`
        : dayName;
      const conflictDayName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][(conflict as Record<string, unknown>).dayOfWeek as number];
      const conflictLabel = (conflict as Record<string, unknown>).specificDate
        ? `on ${fmtDate(new Date((conflict as Record<string, unknown>).specificDate as Date))}`
        : `on ${conflictDayName}`;
      return NextResponse.json(
        { error: `Updated slot ${effectiveSlot.startTime}-${effectiveSlot.endTime} on ${label} overlaps existing slot ${conflict.startTime}-${conflict.endTime} ${conflictLabel}` },
        { status: 409 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (body.startTime) updates.startTime = body.startTime;
    if (body.endTime) updates.endTime = body.endTime;
    if (typeof body.isRecurring === "boolean") updates.isRecurring = body.isRecurring;
    if (body.dayOfWeek !== undefined) updates.dayOfWeek = Number(body.dayOfWeek);
    if (body.specificDate) {
      updates.specificDate = new Date(body.specificDate);
      updates.isRecurring = false;
    }
    if (body.specificDate === null) {
      updates.specificDate = undefined;
      updates.isRecurring = true;
    }

    const slot = await AvailabilitySlot.findOneAndUpdate(
      { _id: slotId, tenantId },
      { $set: updates },
      { new: true }
    );

    return NextResponse.json(slot);
  } catch (error) {
    console.error("Admin update slot error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slotId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slotId } = await params;
    await dbConnect();
    const tenantId = await resolveTenant(request);

    const slot = await AvailabilitySlot.findOneAndDelete({ _id: slotId, tenantId });

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Slot deleted" });
  } catch (error) {
    console.error("Admin delete slot error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
