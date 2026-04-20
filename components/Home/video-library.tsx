"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Clock3,
  Download,
  FileArchive,
  HardDrive,
  LoaderCircle,
  Sparkles,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  buildCloudinaryAiPreviewUrl,
  buildCloudinaryVideoPosterUrl,
  buildCloudinaryVideoUrl,
  formatBytes,
  formatDuration,
  formatRelativeTime,
  getCompressionStats,
  type VideoRecord,
} from "@/lib/video-utils";

const MAX_DASHBOARD_VIDEOS = 6;

function DashboardVideoCard({
  video,
  isDownloading,
  onDownload,
}: {
  video: VideoRecord;
  isDownloading: boolean;
  onDownload: (video: VideoRecord) => Promise<void>;
}) {
  const [isPosterReady, setIsPosterReady] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fullVideoUrl = buildCloudinaryVideoUrl(video.publicId);
  const previewUrl = buildCloudinaryAiPreviewUrl(video.publicId);
  const posterUrl = buildCloudinaryVideoPosterUrl(video.publicId);

  const { original, compressed, savedPercentage } = getCompressionStats(
    video.originalSize,
    video.compressedSize
  );

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 shadow-xl backdrop-blur-xl">
      <div
        className="relative overflow-hidden bg-black px-4 pt-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-muted/20">
          {/* Poster image — hidden while hovering */}
          {posterUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={posterUrl}
                alt={video.title}
                className={`h-full w-full object-cover transition-all duration-500 ${
                  isHovering ? "opacity-0 scale-105" : "opacity-100 scale-100"
                }`}
                loading="lazy"
                onLoad={() => setIsPosterReady(true)}
                onError={() => setIsPosterReady(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </>
          )}

          {/* AI preview video — plays on hover */}
          {previewUrl && (
            <video
              ref={videoRef}
              src={previewUrl}
              muted
              playsInline
              loop
              preload="none"
              className={`absolute inset-0 h-full w-full object-cover rounded-[1.75rem] transition-opacity duration-500 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {!isPosterReady && posterUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
              <LoaderCircle className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          {/* Preview label — switches text on hover */}
          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white/80 backdrop-blur-md transition-all duration-300">
            {isHovering ? "▶ Preview" : "Thumbnail"}
          </div>

          <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-sm font-black text-white backdrop-blur-md">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDuration(video.duration)}
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h3 className="truncate text-2xl font-black tracking-tight text-foreground">
            {video.title}
          </h3>
          <p className="line-clamp-2 min-h-11 text-base font-medium text-muted-foreground">
            {video.description || "Compressed video ready for reuse and download."}
          </p>
          <p className="text-sm font-medium text-muted-foreground/80">
            Uploaded {formatRelativeTime(video.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
              <FileArchive className="h-4 w-4 text-primary" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Original
            </p>
            <p className="mt-1 text-xl font-black text-foreground">{formatBytes(original)}</p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
              <HardDrive className="h-4 w-4 text-primary" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Compressed
            </p>
            <p className="mt-1 text-xl font-black text-foreground">{formatBytes(compressed)}</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-border/60 pt-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
              Compression
            </p>
            <p className="mt-1 text-2xl font-black text-emerald-500">{savedPercentage}%</p>
          </div>

          <Button
            type="button"
            onClick={() => void onDownload(video)}
            disabled={isDownloading || !fullVideoUrl}
            className="h-12 rounded-2xl bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/20"
          >
            {isDownloading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}

export function VideoLibrary() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadingVideoId, setDownloadingVideoId] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        const response = await fetch("/api/videos", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load uploaded videos.");
        }

        setVideos(Array.isArray(data) ? data.slice(0, MAX_DASHBOARD_VIDEOS) : []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load uploaded videos."
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadVideos();
  }, []);

  async function handleDownload(video: VideoRecord) {
    const sourceUrl = buildCloudinaryVideoUrl(video.publicId);

    if (!sourceUrl) {
      setErrorMessage("Cloudinary is not configured for video downloads.");
      return;
    }

    setDownloadingVideoId(video.id);

    try {
      const response = await fetch(sourceUrl);

      if (!response.ok) {
        throw new Error("Download failed.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = `${video.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "cloud-compress-video"}.mp4`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Download failed.");
    } finally {
      setDownloadingVideoId(null);
    }
  }

  return (
    <section className="mt-12 rounded-[3rem] border border-border/50 bg-card/30 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Video Library
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">Videos</h2>
          <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground/80">
            Hover any card to watch a Cloudinary-generated 8-second AI preview. Click download to grab the full compressed file.
          </p>
        </div>

        <Link href="/video-upload">
          <Button className="h-12 rounded-2xl px-7 text-xs font-black uppercase tracking-[0.2em]">
            Upload Another
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive">
          <Clock3 className="h-4 w-4" />
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-72 items-center justify-center rounded-[2rem] border border-border bg-muted/20">
          <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
            <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
            Loading video previews...
          </div>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-muted/20 px-6 text-center">
          <Video className="h-12 w-12 text-primary" />
          <h3 className="mt-5 text-2xl font-black tracking-tight">No videos yet</h3>
          <p className="mt-3 max-w-xl text-base font-medium text-muted-foreground">
            Upload your first file through the Video Engine and it will appear here with an AI-generated preview card.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <DashboardVideoCard
              key={video.id}
              video={video}
              isDownloading={downloadingVideoId === video.id}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </section>
  );
}
