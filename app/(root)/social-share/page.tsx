"use client";

import { useState, useEffect, useRef, use } from "react";
import { CldImage } from "next-cloudinary";

const SOCIAL_FORMATS = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: 1, ratio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: 0.8, ratio: "4:5" },
  "Instagram Landscape (1.91:1)": { width: 1200, height: 628, aspectRatio: 1.91, ratio: "1.91:1" },
  "Facebook (1.2:1)": { width: 1200, height: 1000, aspectRatio: 1.2, ratio: "1.2:1" },
  "Twitter / X (16:9)": { width: 1024, height: 576, aspectRatio: 1.78, ratio: "16:9" },
  "LinkedIn (1.2:1)": { width: 1200, height: 1000, aspectRatio: 1.2, ratio: "1.2:1" },
  "TikTok (9:16)": { width: 1080, height: 1920, aspectRatio: 0.56, ratio: "9:16" },
  "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: 1.78, ratio: "16:9" },
  "YouTube Banner (16:9)": { width: 2560, height: 1440, aspectRatio: 1.78, ratio: "16:9" },
  "Pinterest (1000:1500)": { width: 1000, height: 1500, aspectRatio: 0.67, ratio: "1000:1500" },
  "Snapchat (9:16)": { width: 1080, height: 1920, aspectRatio: 0.56, ratio: "9:16" },
  "WhatsApp Story (9:16)": { width: 1080, height: 1920, aspectRatio: 0.56, ratio: "9:16" },
};

type SocialFormat = keyof typeof SOCIAL_FORMATS;

const page = () => {
  // state to get the idea about uploading, chaging and all that stuff
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRed = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage)
      setIsTransforming(false);
  }, [selectedFormat, uploadedImage])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      
      const data = await response.json();
      setUploadedImage(data.public_id);

    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(error.message || "An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>This is ths social share page</div>
  );
};

export default page;
