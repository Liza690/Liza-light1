import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Tenant from "@/lib/models/Tenant";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const tenants = await Tenant.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ tenants });
  } catch (error) {
    console.error("Admin list tenants error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { v4: uuidv4 } = await import("uuid");

    await dbConnect();

    const tenant = await Tenant.create({
      tenantId: uuidv4(),
      name: body.name,
      domain: body.domain,
      customDomain: body.customDomain,
      logo: body.logo,
      primaryColor: body.primaryColor,
      currency: body.currency || "INR",
      whatsappNumber: body.whatsappNumber,
    });

    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    console.error("Admin create tenant error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
