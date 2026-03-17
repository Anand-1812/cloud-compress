"use client";
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import {v2 as cloudinary} from 'cloudinary';
import { PrismaClient } from '@prisma/client/extension';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
  public_id: string,
  bytes: number
  duration?: number
  [key: string]: any
}

export async function POST(request: NextRequest) {
  const {userId} = await auth();

  if (!userId)
    return NextResponse.json({error: "Unauthorized"}, {status: 401})

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const desc = formData.get("description") as string;
    const orgSize = formData.get("originalSize") as string;

    if (!file)
      return NextResponse.json({error: "File not found"}, {status: 400})

    const fileBytes = await file.arrayBuffer()
    const fileBuffer = Buffer.from(fileBytes)

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {folder: "video-uploads", resource_type: "video", transformation: [{quality: "auto", fetch_format: "mp4"}]},
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        )
        uploadStream.end(fileBuffer);
      }
    )

    const video = await prisma.video.create({
      data: {
        title,
        desc,
        publidId: result.public_id,
        originalSize: orgSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      }
    });

    return NextResponse.json(video)
  } catch (error: any) {
    console.log(`Upload Video Error: ${error}`) 
    return NextResponse.json({error: "upload video failed"}, {status: 500})
  } finally {
    await prisma.$disconnect; 
  }
}
