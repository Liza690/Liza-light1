import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";
import { resolveTenant } from "@/lib/helpers/tenant-resolver";
import { ROLES } from "@/lib/constants";

export async function PATCH(
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

    await dbConnect();
    const tenantId = await resolveTenant(request);

    const updates: Record<string, unknown> = {};
    if (body.role && Object.values(ROLES).includes(body.role)) {
      updates.role = body.role;
    }
    if (typeof body.isVerified === "boolean") {
      updates.isVerified = body.isVerified;
    }

    const user = await User.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: updates },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
