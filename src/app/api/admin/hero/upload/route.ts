import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "hero",
    );
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `hero-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);

    const url = `/uploads/hero/${filename}`;
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 },
    );
  }
}