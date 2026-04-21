import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const originalSize = formData.get("originalSize") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    if (file.type && !file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Only video uploads are supported." }, { status: 400 });
    }

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const fileBytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "video-uploads",
          resource_type: "video",
          transformation: [{ quality: "auto", fetch_format: "mp4" }],
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload failed."));
            return;
          }

          resolve(uploadResult as CloudinaryUploadResult);
        }
      );

      uploadStream.end(fileBuffer);
    });

    const video = await prisma.video.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
        publicId: result.public_id,
        originalSize: originalSize ?? String(file.size),
        compressedSize: String(result.bytes),
        duration: result.duration ?? 0,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload video failed.";

    console.error(`Upload Video Error: ${message}`);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
