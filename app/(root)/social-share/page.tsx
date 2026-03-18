"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import {
  ArrowLeft,
  ChevronDown,
  Download,
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

export default function SocialSharePage() {
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedPreset = SOCIAL_FORMATS[selectedFormat];

  useEffect(() => {
    if (uploadedPublicId) setIsTransforming(true);
  }, [uploadedPublicId, selectedFormat]);

  async function uploadFile(file: File) {
    setErrorMessage(null);
    setIsUploading(true);
    setFileName(file.name);
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok || !data.publicId) throw new Error(data.error ?? "Upload failed");
      setUploadedPublicId(data.publicId);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsUploading(false);
    }
  }

  const handleDownload = async () => {
    if (!uploadedPublicId) return;
    setIsDownloading(true);
    try {
      const url = getCldImageUrl({
        src: uploadedPublicId,
        width: selectedPreset.width,
        height: selectedPreset.height,
        crop: "fill",
        gravity: "auto",
        format: "png",
      });
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `cloud-compress-${selectedFormat.toLowerCase().replace(/ /g, "-")}.png`;
      link.click();
    } catch {
      setErrorMessage("Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

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
            <p className="text-muted-foreground font-medium mt-2">Precision dimensions for every platform.</p>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-2xl h-12 px-6 border-border bg-background" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Change Image
             </Button>
             <Button 
                disabled={!uploadedPublicId || isDownloading} 
                onClick={handleDownload}
                className="rounded-2xl h-12 px-8 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
             >
                {isDownloading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Export Assets
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
              </div>
            </div>
          </aside>

          {/* Canvas Workspace */}
          <section className="relative group">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
            
            {!localPreviewUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video w-full rounded-[3rem] border-2 border-dashed border-border bg-muted/20 dark:bg-card/30 hover:bg-muted/30 dark:hover:bg-card/50 hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground">Drop your source here</h3>
                <p className="text-muted-foreground font-medium mt-2">High-res PNG or JPG recommended</p>
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
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-4">
                        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
                        <span className="font-black text-sm uppercase tracking-widest text-foreground">Uploading...</span>
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
                            alt="Transformed"
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
                          <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-md">
                            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comparison Mini-Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="p-4 rounded-3xl border border-border bg-card/60 flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-muted overflow-hidden border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={localPreviewUrl} alt="source" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Original</p>
                        <p className="text-xs font-bold truncate text-foreground">Source file</p>
                      </div>
                   </div>
                   <div className="p-4 rounded-3xl border border-border bg-card/60 flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Maximize2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Processing</p>
                        <p className="text-xs font-bold text-foreground">Auto-Center Fill</p>
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
