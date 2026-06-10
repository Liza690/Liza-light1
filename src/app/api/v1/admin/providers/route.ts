import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ServiceProvider from "@/lib/models/ServiceProvider";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { createProviderSchema } from "@/lib/validators/provider";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const filter: Record<string, unknown> = { tenantId };
    if (searchParams.get("isVerified")) {
      filter.isVerified = searchParams.get("isVerified") === "true";
    }
    if (searchParams.get("isAvailable")) {
      filter.isAvailable = searchParams.get("isAvailable") === "true";
    }

    const [providers, total] = await Promise.all([
      ServiceProvider.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ServiceProvider.countDocuments(filter),
    ]);

    return NextResponse.json({
      providers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin list providers error:", error);
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
    const parsed = createProviderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const provider = await ServiceProvider.create({
      tenantId,
      isVerified: true,
      isAvailable: true,
      ...parsed.data,
    });

    return NextResponse.json(provider, { status: 201 });
  } catch (error) {
    console.error("Admin create provider error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
