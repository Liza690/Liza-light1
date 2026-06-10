import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Booking from "@/lib/models/Booking";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const user = await User.findOne({
      _id: session.user.id,
      tenantId,
    }).select("-passwordHash");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();
    const tenantId = await resolveTenant(request);

    const updates: Record<string, unknown> = {};
    if (body.name) updates.name = body.name;
    if (body.phone) updates.phone = body.phone;
    if (body.avatar) updates.avatar = body.avatar;

    const user = await User.findOneAndUpdate(
      { _id: session.user.id, tenantId },
      { $set: updates },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
