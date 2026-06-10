import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tenant from "@/lib/models/Tenant";
import { auth } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    await dbConnect();

    const updates: Record<string, unknown> = {};
    if (body.name) updates.name = body.name;
    if (body.domain) updates.domain = body.domain;
    if (body.customDomain !== undefined) updates.customDomain = body.customDomain;
    if (body.logo !== undefined) updates.logo = body.logo;
    if (body.primaryColor) updates.primaryColor = body.primaryColor;
    if (body.currency) updates.currency = body.currency;
    if (body.whatsappNumber !== undefined) updates.whatsappNumber = body.whatsappNumber;
    if (typeof body.isActive === "boolean") updates.isActive = body.isActive;

    const tenant = await Tenant.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { new: true }
    );

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Admin update tenant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
