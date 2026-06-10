import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/lib/models/Review";
import ServiceProvider from "@/lib/models/ServiceProvider";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { updateReviewSchema } from "@/lib/validators/review";

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
    const parsed = updateReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const review = await Review.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: parsed.data },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (parsed.data.rating) {
      const reviews = await Review.find({ tenantId, providerId: review.providerId });
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await ServiceProvider.findByIdAndUpdate(review.providerId, {
        averageRating: Math.round(avgRating * 10) / 10,
      });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Admin update review error:", error);
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

    const review = await Review.findOneAndDelete({ _id: id, tenantId });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const reviews = await Review.find({ tenantId, providerId: review.providerId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    await ServiceProvider.findByIdAndUpdate(review.providerId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Admin delete review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
