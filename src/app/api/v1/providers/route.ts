import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ServiceProvider from "@/lib/models/ServiceProvider";
import Service from "@/lib/models/Service";
import Review from "@/lib/models/Review";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const experienceLevel = searchParams.get("experienceLevel");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const dayOfWeek = searchParams.get("dayOfWeek");
    const availableOnly = searchParams.get("availableOnly") === "true";

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const filter: Record<string, unknown> = { tenantId, isVerified: true };

    if (city) filter.city = city;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (minRating) filter.averageRating = { $gte: parseFloat(minRating) };
    if (availableOnly) filter.isAvailable = true;

    if (minPrice || maxPrice) {
      const providerIds = await Service.find({
        tenantId,
        isActive: true,
        ...(minPrice && { price: { $gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { $lte: parseFloat(maxPrice) } }),
      }).distinct("providerId");
      filter._id = { $in: providerIds };
    }

    if (dayOfWeek) {
      const providerIds = await AvailabilitySlot.find({
        tenantId,
        dayOfWeek: parseInt(dayOfWeek),
        isBooked: false,
        isRecurring: true,
      }).distinct("providerId");
      if (filter._id) {
        filter._id = {
          $in: (filter._id as { $in: string[] }).$in.filter((id) =>
            (providerIds as string[]).includes(id)
          ),
        };
      } else {
        filter._id = { $in: providerIds };
      }
    }

    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "rating") sortOption = { averageRating: -1 };
    if (sort === "bookings") sortOption = { totalBookings: -1 };
    if (sort === "price_asc" || sort === "price_desc") {
      sortOption = { _id: -1 };
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
    console.error("List providers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
