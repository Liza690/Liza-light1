import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function withAuth(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function withAdmin(request: Request) {
  const session = await withAuth(request);
  if (session instanceof NextResponse) return session;

  if (session.user.role !== "admin" && session.user.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}

export async function withSuperAdmin(request: Request) {
  const session = await withAuth(request);
  if (session instanceof NextResponse) return session;

  if (session.user.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}
