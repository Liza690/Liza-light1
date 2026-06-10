import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ServiceProvider from "@/lib/models/ServiceProvider";
import Service from "@/lib/models/Service";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const tenantId = await resolveTenant(request);

    const [cities, priceRange, ratings, experienceLevels] = await Promise.all([
      ServiceProvider.distinct("city", { tenantId }),
      Service.aggregate([
        { $match: { tenantId, isActive: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]),
      ServiceProvider.aggregate([
        { $match: { tenantId } },
        {
          $group: {
            _id: null,
            minRating: { $min: "$averageRating" },
            maxRating: { $max: "$averageRating" },
          },
        },
      ]),
      ServiceProvider.distinct("experienceLevel", { tenantId }),
    ]);

    return NextResponse.json({
      cities,
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 100000 },
      ratings: ratings[0] || { minRating: 0, maxRating: 5 },
      experienceLevels,
    });
  } catch (error) {
    console.error("Get filters error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
