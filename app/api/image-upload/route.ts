"use client";
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
  public_id: string,
  [key: string]: any
}

export async function POST(request: NextRequest) {
  const {userId} = await auth();

  if (!userId)
    return NextResponse.json({error: "Unauthorized"}, {status: 401})

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file)
      return NextResponse.json({error: "File not found"}, {status: 400})

    const fileBytes = await file.arrayBuffer()
    const fileBuffer = Buffer.from(fileBytes)

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {folder: "next-cloudinary-uploads"},
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        )
        uploadStream.end(fileBuffer);
      }
    )

    return NextResponse.json({publicId: result.public_id}, {status: 200})
  } catch (error: any) {
    console.log(`Upload Image Error: ${error}`) 
    return NextResponse.json({error: "upload image failed"}, {status: 500})
  }
}
