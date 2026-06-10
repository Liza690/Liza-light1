import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }
    if (files.length > 5) {
      return NextResponse.json({ error: "Maximum 5 images allowed" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const url = await uploadImage(file);
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Upload error:", msg);
    return NextResponse.json({ error: `Upload failed: ${msg}` }, { status: 500 });
  }
}
