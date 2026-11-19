import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawFiles = formData.getAll("files");
    const fallbackFiles = formData.getAll("images");
    const singleFile = formData.get("file") as File | null || formData.get("image") as File | null;

    let filesToProcess: File[] = [];
    if (rawFiles.length > 0) {
      filesToProcess = rawFiles.filter((f): f is File => f instanceof File);
    } else if (fallbackFiles.length > 0) {
      filesToProcess = fallbackFiles.filter((f): f is File => f instanceof File);
    } else if (singleFile) {
      filesToProcess = [singleFile];
    }

    if (!filesToProcess.length) {
      return NextResponse.json({ error: "No image files provided." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const savedUrls: string[] = [];

    for (let idx = 0; idx < filesToProcess.length; idx++) {
      const file = filesToProcess[idx];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = file.name || "mango_image.jpg";
      const ext = path.extname(originalName).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(ext)) {
        continue;
      }

      const safeName = originalName.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
      const filename = `${Date.now()}_${idx}_${safeName}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      savedUrls.push(`/uploads/${filename}`);
    }

    if (!savedUrls.length) {
      return NextResponse.json({ error: "No valid image formats found (JPG, PNG, WebP, SVG supported)." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      urls: savedUrls,
      url: savedUrls[0],
      count: savedUrls.length,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to save file." }, { status: 500 });
  }
}
