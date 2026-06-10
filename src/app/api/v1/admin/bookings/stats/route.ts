import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const [totalBookings, statusCounts, revenueResult, providerStats] =
      await Promise.all([
        Booking.countDocuments({ tenantId }),
        Booking.aggregate([
          { $match: { tenantId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Booking.aggregate([
          { $match: { tenantId, status: "completed" } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              avgBookingValue: { $avg: "$totalAmount" },
            },
          },
        ]),
        Booking.aggregate([
          { $match: { tenantId, status: "completed" } },
          {
            $group: {
              _id: "$providerId",
              count: { $sum: 1 },
              revenue: { $sum: "$totalAmount" },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "serviceproviders",
              localField: "_id",
              foreignField: "_id",
              as: "provider",
            },
          },
          { $unwind: "$provider" },
          {
            $project: {
              providerName: "$provider.name",
              bookings: "$count",
              revenue: 1,
            },
          },
        ]),
      ]);

    const revenue = revenueResult[0] || { totalRevenue: 0, avgBookingValue: 0 };

    return NextResponse.json({
      totalBookings,
      statusBreakdown: statusCounts,
      revenue: {
        total: revenue.totalRevenue,
        averagePerBooking: revenue.avgBookingValue,
      },
      topProviders: providerStats,
    });
  } catch (error) {
    console.error("Admin booking stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
