import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { createServiceSchema } from "@/lib/validators/provider";

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
    const parsed = createServiceSchema.safeParse(body);
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
      providerId,
      ...parsed.data,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Admin create service error:", error);
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

    const services = await Service.find({ tenantId, providerId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Admin get services error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
