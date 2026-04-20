"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Clapperboard,
  FileVideo,
  HardDrive,
  LoaderCircle,
  Sparkles,
  Upload,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 70 * 1024 * 1024;
const MAX_RECENT_VIDEOS = 6;

type VideoRecord = {
  id: string;
  title: string;
  description: string | null;
  publicId: string;
  originalSize: string;
  compressedSize: string;
  duration: string | number;
  createdAt: string;
  updatedAt: string;
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value >= 100 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}

function formatDuration(value: string | number) {
  const seconds = Number(value);

  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function buildCloudinaryVideoUrl(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) return null;

  const encodedPublicId = encodeURIComponent(publicId).replace(/%2F/g, "/");
  return `https://res.cloudinary.com/${cloudName}/video/upload/f_mp4,q_auto/${encodedPublicId}.mp4`;
}

export default function VideoUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<VideoRecord | null>(null);
  const [recentVideos, setRecentVideos] = useState<VideoRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadRecentVideos() {
      try {
        const response = await fetch("/api/videos", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch recent videos.");
        }

        const data = await response.json();
        setRecentVideos(Array.isArray(data) ? data.slice(0, MAX_RECENT_VIDEOS) : []);
      } catch {
        setRecentVideos([]);
      } finally {
        setIsLoadingRecent(false);
      }
    }

    void loadRecentVideos();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const uploadedVideoUrl = uploadedVideo ? buildCloudinaryVideoUrl(uploadedVideo.publicId) : null;
  const previewSource = uploadedVideoUrl ?? previewUrl;
  const previewTitle = uploadedVideo?.title || title || file?.name || "Preview";
  const originalSize = uploadedVideo ? Number(uploadedVideo.originalSize) : file?.size ?? 0;
  const compressedSize = uploadedVideo ? Number(uploadedVideo.compressedSize) : 0;
  const savedBytes = Math.max(originalSize - compressedSize, 0);
  const savedPercentage =
    originalSize > 0 && compressedSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  function resetMessages() {
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function validateFile(selectedFile: File) {
    if (selectedFile.type && !selectedFile.type.startsWith("video/")) {
      return "Please choose a valid video file.";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return `Video size must stay under ${formatBytes(MAX_FILE_SIZE)}.`;
    }

    return null;
  }

  function handleFileSelect(selectedFile: File | null) {
    if (!selectedFile) return;

    resetMessages();

    const validationMessage = validateFile(selectedFile);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setFile(selectedFile);
    setUploadedVideo(null);

    if (!title.trim()) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    handleFileSelect(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (!file) {
      setErrorMessage("Select a video before uploading.");
      return;
    }

    const validationMessage = validateFile(file);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Add a title so this upload can be identified later.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("originalSize", String(file.size));

    try {
      const response = await fetch("/api/video-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Video upload failed.");
      }

      const nextVideo = data as VideoRecord;

      setUploadedVideo(nextVideo);
      setRecentVideos((current) => [
        nextVideo,
        ...current.filter((video) => video.id !== nextVideo.id),
      ].slice(0, MAX_RECENT_VIDEOS));
      setSuccessMessage("Upload complete. Your video was compressed and saved.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong while uploading the video."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[38%] w-[38%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[38%] w-[38%] rounded-full bg-primary/12 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1450px] px-6 py-10">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Link
              href="/home"
              className="group mb-4 inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Back to Studio
            </Link>
            <h1 className="flex items-center gap-3 text-4xl font-black tracking-tighter md:text-5xl">
              Video Engine <Clapperboard className="h-8 w-8 text-primary" />
            </h1>
            <p className="mt-2 max-w-2xl font-medium text-muted-foreground">
              Upload footage, let Cloudinary compress it, and keep the output tracked inside your workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-2xl border-border bg-background px-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Video
            </Button>
            <div className="rounded-2xl border border-border bg-card/60 px-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
              Max Size {formatBytes(MAX_FILE_SIZE)}
            </div>
          </div>
        </header>

        {errorMessage && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm font-bold text-primary">
            <CheckCircle2 className="h-4 w-4" />
            {successMessage}
          </div>
        )}

        <div className="grid items-start gap-10 lg:grid-cols-[390px_1fr]">
          <aside className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-border bg-card/60 p-8 shadow-xl backdrop-blur-xl"
            >
              <div className="mb-8 flex items-center gap-2 text-primary">
                <WandSparkles className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Upload Config
                </span>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label
                    htmlFor="video-title"
                    className="text-xs font-black uppercase tracking-widest text-muted-foreground"
                  >
                    Video Title
                  </label>
                  <input
                    id="video-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Product launch reel"
                    className="h-14 w-full rounded-2xl border border-border bg-background px-5 text-sm font-bold text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="video-description"
                    className="text-xs font-black uppercase tracking-widest text-muted-foreground"
                  >
                    Description
                  </label>
                  <textarea
                    id="video-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Optional notes about this export."
                    rows={5}
                    className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-sm font-medium text-foreground outline-none transition resize-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                      Source Size
                    </span>
                    <p className="mt-1 text-lg font-black text-foreground">
                      {file ? formatBytes(file.size) : "Waiting..."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                      Format
                    </span>
                    <p className="mt-1 text-lg font-black text-foreground">
                      {file?.type ? file.type.split("/")[1]?.toUpperCase() : "VIDEO"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                    Current File
                  </p>
                  <p className="mt-2 truncate text-sm font-bold text-foreground">
                    {file?.name ?? "No video selected"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    MP4, MOV, WEBM and other browser-supported video files are accepted.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!file || isUploading}
                  className="h-14 w-full rounded-2xl bg-primary text-sm font-black uppercase tracking-[0.2em] text-primary-foreground shadow-lg shadow-primary/20"
                >
                  {isUploading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Uploading
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Compress and Save
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="rounded-[2rem] border border-border bg-secondary/20 p-6">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  Pipeline Notes
                </span>
              </div>
              <div className="space-y-3 text-sm font-medium text-muted-foreground">
                <p>Uploads are sent through Cloudinary with automatic quality optimization.</p>
                <p>The resulting asset is stored in your database so it can be listed back in the workspace.</p>
                <p>Use concise titles here because this page also becomes the internal upload history.</p>
              </div>
            </div>
          </aside>

          <section className="space-y-8">
            {!previewSource ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex aspect-video w-full flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border bg-muted/20 p-8 text-center transition-all hover:border-primary/50 hover:bg-muted/30"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-primary/10 transition-transform group-hover:scale-110">
                  <FileVideo className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Drop in the footage you want to compress
                </h2>
                <p className="mt-3 max-w-xl font-medium text-muted-foreground">
                  Start with a source file, add a title, and submit it for cloud compression.
                </p>
              </button>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="relative overflow-hidden rounded-[3rem] border border-border bg-card/50 p-4 shadow-xl backdrop-blur-sm">
                  <div className="absolute left-8 top-8 z-10 rounded-full border border-border bg-background/90 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-foreground shadow-sm backdrop-blur-md">
                    {uploadedVideo ? "Processed Preview" : "Source Preview"}
                  </div>

                  <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-[2.5rem] bg-muted/50">
                    <video
                      key={previewSource}
                      src={previewSource}
                      controls
                      playsInline
                      className="max-h-[72vh] w-full rounded-[2rem] bg-black object-contain"
                    />

                    {isUploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/60 backdrop-blur-md">
                        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
                        <span className="text-sm font-black uppercase tracking-[0.25em] text-foreground">
                          Uploading...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-3xl border border-border bg-card/60 p-5 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/30">
                      <HardDrive className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Original Size
                    </p>
                    <p className="mt-2 text-xl font-black text-foreground">{formatBytes(originalSize)}</p>
                  </div>

                  <div className="rounded-3xl border border-border bg-card/60 p-5 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/30">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Compressed Size
                    </p>
                    <p className="mt-2 text-xl font-black text-foreground">
                      {uploadedVideo ? formatBytes(compressedSize) : "Pending"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-border bg-card/60 p-5 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/30">
                      <Clock3 className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Duration
                    </p>
                    <p className="mt-2 text-xl font-black text-foreground">
                      {uploadedVideo ? formatDuration(uploadedVideo.duration) : "Pending"}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-border bg-card/60 p-5 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/30">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Saved
                    </p>
                    <p className="mt-2 text-xl font-black text-foreground">
                      {uploadedVideo ? `${formatBytes(savedBytes)} (${savedPercentage}%)` : "Waiting"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-3xl border border-border bg-card/60 p-4 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/30">
                      <FileVideo className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Source Asset</p>
                      <p className="mt-1 truncate text-xs font-bold text-foreground">
                        {file?.name ?? previewTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-3xl border border-border bg-card/60 p-4 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Pipeline Status</p>
                      <p className="mt-1 truncate text-xs font-bold text-foreground">
                        {uploadedVideo ? "Stored and ready in Cloudinary" : "Waiting for submit"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-[2rem] border border-border bg-card/40 p-6 shadow-lg backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                    Recent Uploads
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground">
                    Latest video jobs
                  </h2>
                </div>
                <div className="rounded-full border border-border bg-background px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  {recentVideos.length} items
                </div>
              </div>

              {isLoadingRecent ? (
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 p-5 text-sm font-bold text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                  Loading recent uploads...
                </div>
              ) : recentVideos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
                  <p className="text-sm font-bold text-foreground">No uploads yet</p>
                  <p className="mt-2 font-medium text-muted-foreground">
                    Your saved videos will appear here after the first successful submit.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {recentVideos.map((video) => (
                    <article
                      key={video.id}
                      className="rounded-[1.75rem] border border-border bg-background/70 p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-lg font-black tracking-tight text-foreground">
                            {video.title}
                          </p>
                          <p className="mt-1 text-xs font-medium text-muted-foreground">
                            {video.description || "No description added"}
                          </p>
                        </div>
                        <div className="rounded-full border border-border bg-muted/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {formatDate(video.createdAt)}
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-border bg-muted/20 p-3">
                          <p className="text-[10px] font-black uppercase text-muted-foreground">Original</p>
                          <p className="mt-1 text-sm font-black text-foreground">
                            {formatBytes(Number(video.originalSize))}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-border bg-muted/20 p-3">
                          <p className="text-[10px] font-black uppercase text-muted-foreground">Output</p>
                          <p className="mt-1 text-sm font-black text-foreground">
                            {formatBytes(Number(video.compressedSize))}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-border bg-muted/20 p-3">
                          <p className="text-[10px] font-black uppercase text-muted-foreground">Runtime</p>
                          <p className="mt-1 text-sm font-black text-foreground">
                            {formatDuration(video.duration)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
