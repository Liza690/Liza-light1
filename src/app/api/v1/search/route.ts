import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ServiceProvider from "@/lib/models/ServiceProvider";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const city = searchParams.get("city") || "";
    const minAge = searchParams.get("minAge") ? parseInt(searchParams.get("minAge")!) : undefined;
    const maxAge = searchParams.get("maxAge") ? parseInt(searchParams.get("maxAge")!) : undefined;
    const sort = searchParams.get("sort") || "";

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const filter: Record<string, unknown> = { tenantId, isVerified: true };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
      ];
    }

    if (city) {
      filter.city = city;
    }

    if (minAge !== undefined || maxAge !== undefined) {
      const ageFilter: Record<string, number> = {};
      if (minAge !== undefined) ageFilter.$gte = minAge;
      if (maxAge !== undefined) ageFilter.$lte = maxAge;
      filter.age = ageFilter;
    }

    let sortOption: Record<string, 1 | -1> = { totalBookings: -1 };
    if (sort === "asc" || sort === "desc") {
      sortOption = { totalBookings: sort === "asc" ? 1 : -1 };
    }

    const [providers, total] = await Promise.all([
      ServiceProvider.find(filter)
        .sort(sortOption)
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
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
