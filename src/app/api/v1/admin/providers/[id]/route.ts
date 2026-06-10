import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ServiceProvider from "@/lib/models/ServiceProvider";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { updateProviderSchema } from "@/lib/validators/provider";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await dbConnect();
    const tenantId = await resolveTenant(request);

    const provider = await ServiceProvider.findOne({ _id: id, tenantId })
      .populate("userId", "name email")
      .lean();

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Admin get provider error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateProviderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const provider = await ServiceProvider.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: parsed.data },
      { new: true }
    );

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Admin update provider error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await dbConnect();
    const tenantId = await resolveTenant(request);

    const provider = await ServiceProvider.findOneAndDelete({ _id: id, tenantId });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Provider deleted" });
  } catch (error) {
    console.error("Admin delete provider error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const updates: Record<string, unknown> = {};
    if (typeof body.isAvailable === "boolean") updates.isAvailable = body.isAvailable;
    if (typeof body.isVerified === "boolean") updates.isVerified = body.isVerified;

    const provider = await ServiceProvider.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: updates },
      { new: true }
    );

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error("Admin update provider status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
