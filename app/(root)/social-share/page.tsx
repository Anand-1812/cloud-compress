"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import imageCompression from "browser-image-compression";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import {
  ArrowLeft,
  ChevronDown,
  Cloud,
  Download,
  FileArchive,
  Gauge,
  Image as ImageIcon,
  LoaderCircle,
  Maximize2,
  Monitor,
  Share2,
  Sparkles,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/video-utils";

const SOCIAL_FORMATS = {
  "Instagram Square": { width: 1080, height: 1080, ratio: "1:1", icon: "📸" },
  "Instagram Portrait": { width: 1080, height: 1350, ratio: "4:5", icon: "📸" },
  "Twitter / X": { width: 1200, height: 675, ratio: "16:9", icon: "🐦" },
  "YouTube Thumbnail": { width: 1280, height: 720, ratio: "16:9", icon: "📺" },
  "TikTok": { width: 1080, height: 1920, ratio: "9:16", icon: "🎵" },
  "LinkedIn": { width: 1200, height: 627, ratio: "1.91:1", icon: "💼" },
  "WhatsApp Status": { width: 1080, height: 1920, ratio: "9:16", icon: "💬" },
} as const;

type SocialFormat = keyof typeof SOCIAL_FORMATS;
type SocialPreset = (typeof SOCIAL_FORMATS)[SocialFormat];

type ImagePipelineStats = {
  originalName: string;
  browserName: string;
  originalSize: number;
  browserSize: number;
  cloudinarySize: number | null;
  deliveredSize: number | null;
};

type ImageUploadResponse = {
  publicId?: string;
  bytes?: number;
  error?: string;
};

type PipelineStageRowProps = {
  icon: ReactNode;
  label: string;
  detail: string;
  size: string;
  savings: number | null;
  pending?: boolean;
};

const CLIENT_COMPRESSION_OPTIONS = {
  maxSizeMB: 1.2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.82,
};

function getSavingsPercent(originalSize: number, optimizedSize: number | null | undefined) {
  if (!Number.isFinite(originalSize) || originalSize <= 0 || !optimizedSize) return 0;

  return Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100));
}

function buildBrowserFileName(file: File, mimeType: string) {
  const baseName = file.name.replace(/\.[^/.]+$/, "") || "image";
  const extension = mimeType.includes("webp")
    ? "webp"
    : mimeType.includes("png")
      ? "png"
      : "jpg";

  return `${baseName}-browser-compressed.${extension}`;
}

function createBrowserCompressedFile(sourceFile: File, compressedBlob: Blob) {
  const mimeType = compressedBlob.type || sourceFile.type || "image/jpeg";

  return new File([compressedBlob], buildBrowserFileName(sourceFile, mimeType), {
    type: mimeType,
    lastModified: Date.now(),
  });
}

function buildOptimizedDeliveryUrl(publicId: string, preset: SocialPreset) {
  return getCldImageUrl({
    src: publicId,
    width: preset.width,
    height: preset.height,
    crop: "fill",
    gravity: "auto",
    format: "webp",
    quality: "auto",
  });
}

async function fetchOptimizedBlob(url: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, { cache: "no-store" });

    if (response.ok) return response.blob();
    if (response.status !== 423 || attempt === 2) {
      throw new Error("Cloudinary delivery optimization failed.");
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  throw new Error("Cloudinary delivery optimization failed.");
}

function PipelineStageRow({ icon, label, detail, size, savings, pending }: PipelineStageRowProps) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-widest text-foreground">{label}</p>
            <span className="text-xs font-black text-primary">
              {pending ? "..." : `${savings ?? 0}% saved`}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">{detail}</p>
          <p className="mt-2 text-sm font-black text-foreground">{pending ? "Measuring..." : size}</p>
        </div>
      </div>
    </div>
  );
}

export default function SocialSharePage() {
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pipelineStats, setPipelineStats] = useState<ImagePipelineStats | null>(null);
  const [isPreprocessing, setIsPreprocessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isMeasuringDelivery, setIsMeasuringDelivery] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedPreset = SOCIAL_FORMATS[selectedFormat];

  useEffect(() => {
    if (!uploadedPublicId) return;

    const publicId = uploadedPublicId;
    let isCancelled = false;

    async function measureDeliveryAsset() {
      setIsTransforming(true);
      setIsMeasuringDelivery(true);

      try {
        const blob = await fetchOptimizedBlob(buildOptimizedDeliveryUrl(publicId, selectedPreset));

        if (!isCancelled) {
          setPipelineStats((current) =>
            current ? { ...current, deliveredSize: blob.size } : current
          );
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Cloudinary delivery optimization failed."
          );
        }
      } finally {
        if (!isCancelled) setIsMeasuringDelivery(false);
      }
    }

    void measureDeliveryAsset();

    return () => {
      isCancelled = true;
    };
  }, [selectedPreset, uploadedPublicId]);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose a valid image file.");
      return;
    }

    setErrorMessage(null);
    setUploadedPublicId(null);
    setPipelineStats(null);
    setFileName(file.name);
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(null);
    setIsPreprocessing(true);

    try {
      const compressedBlob = await imageCompression(file, CLIENT_COMPRESSION_OPTIONS);
      const compressedFile = createBrowserCompressedFile(file, compressedBlob);
      const browserFile = compressedFile.size < file.size ? compressedFile : file;

      setPipelineStats({
        originalName: file.name,
        browserName: browserFile.name,
        originalSize: file.size,
        browserSize: browserFile.size,
        cloudinarySize: null,
        deliveredSize: null,
      });
      setLocalPreviewUrl(URL.createObjectURL(browserFile));
      setIsPreprocessing(false);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", browserFile);
      formData.append("originalSize", String(file.size));
      formData.append("browserCompressedSize", String(browserFile.size));

      const response = await fetch("/api/image-upload", { method: "POST", body: formData });
      const data = (await response.json()) as ImageUploadResponse;
      if (!response.ok || !data.publicId) throw new Error(data.error ?? "Upload failed");

      setPipelineStats((current) =>
        current
          ? {
              ...current,
              cloudinarySize: Number(data.bytes ?? browserFile.size),
            }
          : current
      );
      setUploadedPublicId(data.publicId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsPreprocessing(false);
      setIsUploading(false);
    }
  }

  const handleDownload = async () => {
    if (!uploadedPublicId) return;
    setIsDownloading(true);
    try {
      const url = buildOptimizedDeliveryUrl(uploadedPublicId, selectedPreset);
      const blob = await fetchOptimizedBlob(url);
      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);

      setPipelineStats((current) =>
        current ? { ...current, deliveredSize: blob.size } : current
      );
      link.href = objectUrl;
      link.download = `cloud-compress-${selectedFormat.toLowerCase().replace(/ /g, "-")}.webp`;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setErrorMessage("Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const browserSavings = pipelineStats
    ? getSavingsPercent(pipelineStats.originalSize, pipelineStats.browserSize)
    : 0;
  const cloudinarySavings = pipelineStats
    ? getSavingsPercent(pipelineStats.browserSize, pipelineStats.cloudinarySize)
    : 0;
  const deliverySavings = pipelineStats
    ? getSavingsPercent(pipelineStats.originalSize, pipelineStats.deliveredSize)
    : 0;
  const totalDeliveredSize =
    pipelineStats?.deliveredSize ?? pipelineStats?.cloudinarySize ?? pipelineStats?.browserSize ?? 0;
  const isProcessingSource = isPreprocessing || isUploading;

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background Ambience - Adaptable to light/dark */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/15 dark:bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 py-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link href="/home" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4 group">
              <ArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              Back to Studio
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-3 text-foreground">
              Social Studio <Share2 className="h-8 w-8 text-primary" />
            </h1>
            <p className="text-muted-foreground font-medium mt-2">
              Browser pre-compression plus Cloudinary delivery optimization for every platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-2xl h-12 px-6 border-border bg-background" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Change Image
             </Button>
             <Button 
                disabled={!uploadedPublicId || isDownloading || isMeasuringDelivery} 
                onClick={handleDownload}
                className="rounded-2xl h-12 px-8 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
             >
                {isDownloading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Export WebP
             </Button>
          </div>
        </header>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-[380px_1fr] gap-10 items-start">
          {/* Controls Sidebar */}
          <aside className="space-y-6">
            <div className="p-8 rounded-[2rem] border border-border bg-card/60 dark:bg-card/50 backdrop-blur-xl shadow-xl dark:shadow-2xl">
              <div className="flex items-center gap-2 mb-8 text-primary">
                <Monitor className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Configuration</span>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Target Platform</label>
                  <div className="relative group">
                    <select 
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                      className="w-full h-14 bg-background border border-border rounded-2xl px-5 font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                    >
                      {Object.keys(SOCIAL_FORMATS).map((format) => (
                        <option key={format} value={format}>{format}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/30 dark:bg-background border border-border">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Ratio</span>
                    <p className="font-black text-lg mt-1 text-foreground">{selectedPreset.ratio}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/30 dark:bg-background border border-border">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Dimensions</span>
                    <p className="font-black text-lg mt-1 text-foreground">{selectedPreset.width}px</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Auto-Center Smart Crop Active
                  </div>
                </div>
              </div>
            </div>

            {/* Source Meta Card */}
            <div className="p-6 rounded-[2rem] border border-border bg-muted/40 dark:bg-secondary/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source Image</p>
                <p className="text-sm font-bold truncate mt-0.5 text-foreground">{fileName ?? "Waiting for file..."}</p>
                {pipelineStats && (
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {formatBytes(pipelineStats.originalSize)} original source
                  </p>
                )}
              </div>
            </div>

            {pipelineStats && (
              <div className="p-6 rounded-[2rem] border border-border bg-card/60 dark:bg-card/50 backdrop-blur-xl shadow-xl dark:shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Pipeline</p>
                    <h2 className="mt-2 text-xl font-black tracking-tight text-foreground">Savings Breakdown</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <Gauge className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <PipelineStageRow
                    icon={<FileArchive className="h-4 w-4" />}
                    label="Browser Pass"
                    detail="Client-side compression before upload"
                    size={formatBytes(pipelineStats.browserSize)}
                    savings={browserSavings}
                  />
                  <PipelineStageRow
                    icon={<Cloud className="h-4 w-4" />}
                    label="Cloudinary Store"
                    detail="Uploaded optimized source asset"
                    size={formatBytes(pipelineStats.cloudinarySize ?? pipelineStats.browserSize)}
                    savings={pipelineStats.cloudinarySize ? cloudinarySavings : null}
                    pending={!pipelineStats.cloudinarySize && isUploading}
                  />
                  <PipelineStageRow
                    icon={<Maximize2 className="h-4 w-4" />}
                    label="Delivery Export"
                    detail={`${selectedPreset.width}x${selectedPreset.height} smart-cropped WebP`}
                    size={formatBytes(totalDeliveredSize)}
                    savings={pipelineStats.deliveredSize ? deliverySavings : null}
                    pending={!pipelineStats.deliveredSize && isMeasuringDelivery}
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Total Delivery Savings
                  </p>
                  <p className="mt-1 text-3xl font-black tracking-tight text-foreground">
                    {pipelineStats.deliveredSize ? `${deliverySavings}%` : "Measuring"}
                  </p>
                  <p className="mt-1 text-xs font-bold text-muted-foreground">
                    {pipelineStats.deliveredSize
                      ? `${formatBytes(pipelineStats.originalSize)} to ${formatBytes(pipelineStats.deliveredSize)}`
                      : "Cloudinary is generating the optimized delivery variant."}
                  </p>
                </div>
              </div>
            )}
          </aside>

          {/* Canvas Workspace */}
          <section className="relative group">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
            
            {!localPreviewUrl ? (
              <div 
                onClick={() => !isPreprocessing && fileInputRef.current?.click()}
                className="aspect-video w-full rounded-[3rem] border-2 border-dashed border-border bg-muted/20 dark:bg-card/30 hover:bg-muted/30 dark:hover:bg-card/50 hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer group"
              >
                {isPreprocessing ? (
                  <>
                    <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center mb-6">
                      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-foreground">Pre-compressing locally</h3>
                    <p className="text-muted-foreground font-medium mt-2">Running the browser compression pass first.</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-foreground">Drop your source here</h3>
                    <p className="text-muted-foreground font-medium mt-2">High-res PNG or JPG recommended</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="relative rounded-[3rem] border border-border bg-card/40 dark:bg-card/50 p-4 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-8 left-8 z-10">
                    <div className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-md border border-border text-[10px] font-black uppercase tracking-widest text-foreground shadow-sm">
                      Live Preview
                    </div>
                  </div>
                  
                  {/* Canvas Background - Uses muted color in light mode for contrast */}
                  <div className="relative w-full flex items-center justify-center bg-muted/50 dark:bg-black/20 rounded-[2.5rem] overflow-hidden min-h-[500px]">
                    {isProcessingSource ? (
                      <div className="flex flex-col items-center gap-4">
                        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
                        <span className="font-black text-sm uppercase tracking-widest text-foreground">
                          {isPreprocessing ? "Pre-compressing..." : "Uploading..."}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          {isPreprocessing ? "Browser pass in progress" : "Sending optimized source to Cloudinary"}
                        </span>
                      </div>
                    ) : (
                      <div 
                        className="relative shadow-2xl transition-all duration-500 ease-out"
                        style={{ 
                          aspectRatio: `${selectedPreset.width}/${selectedPreset.height}`,
                          maxHeight: '70vh',
                          width: 'auto'
                        }}
                      >
                        {uploadedPublicId ? (
                          <CldImage
                            key={`${uploadedPublicId}-${selectedFormat}`}
                            src={uploadedPublicId}
                            width={selectedPreset.width}
                            height={selectedPreset.height}
                            crop="fill"
                            gravity="auto"
                            format="webp"
                            quality="auto"
                            alt="Optimized social export"
                            onLoad={() => setIsTransforming(false)}
                            className={cn(
                              "h-full w-full object-cover rounded-sm transition-opacity duration-700",
                              isTransforming ? "opacity-0" : "opacity-100"
                            )}
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={localPreviewUrl} alt="local" className="h-full w-full object-cover rounded-sm opacity-40 blur-sm" />
                        )}
                        
                        {isTransforming && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/40 backdrop-blur-md">
                            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-foreground">
                              {isMeasuringDelivery ? "Measuring delivery" : "Transforming"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comparison Mini-Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="p-4 rounded-3xl border border-border bg-card/60 flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={localPreviewUrl} alt="source" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Original</p>
                        <p className="text-xs font-bold truncate text-foreground">
                          {pipelineStats ? formatBytes(pipelineStats.originalSize) : "Source file"}
                        </p>
                      </div>
                   </div>
                   <div className="p-4 rounded-3xl border border-border bg-card/60 flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <FileArchive className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Browser Pass</p>
                        <p className="text-xs font-bold text-foreground">
                          {pipelineStats ? `${formatBytes(pipelineStats.browserSize)} · ${browserSavings}% saved` : "Pre-compressed"}
                        </p>
                      </div>
                   </div>
                   <div className="p-4 rounded-3xl border border-border bg-card/60 flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Maximize2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Cloudinary Export</p>
                        <p className="text-xs font-bold text-foreground">
                          {pipelineStats?.deliveredSize
                            ? `${formatBytes(pipelineStats.deliveredSize)} · ${deliverySavings}% saved`
                            : "Smart crop + WebP"}
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
