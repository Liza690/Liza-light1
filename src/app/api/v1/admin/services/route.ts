import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { z } from "zod";
import { createServiceSchema } from "@/lib/validators/provider";

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

    const services = await Service.find(filter)
      .populate("providerId", "name city")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Admin list services error:", error);
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
    const schema = createServiceSchema.extend({ providerId: z.string() });
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const service = await Service.create({
      tenantId,
      ...parsed.data,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Admin create service error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
