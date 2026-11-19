import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null || formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate extension
    const originalName = file.name || "mango_image.jpg";
    const ext = path.extname(originalName).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(ext)) {
      return NextResponse.json({ error: "Only JPG, PNG, WebP or SVG images allowed." }, { status: 400 });
    }

    const safeName = originalName.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
    const filename = `${Date.now()}_${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to save file." }, { status: 500 });
  }
}
