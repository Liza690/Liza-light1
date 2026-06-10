import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const filter: Record<string, unknown> = { tenantId, isActive: true };
    if (providerId) filter.providerId = providerId;

    const services = await Service.find(filter)
      .populate("providerId", "name city")
      .sort({ price: 1 })
      .lean();

    return NextResponse.json({ services });
  } catch (error) {
    console.error("List services error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
