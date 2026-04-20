export type VideoRecord = {
  id: string;
  userId?: string | null;
  title: string;
  description: string | null;
  publicId: string;
  originalSize: string;
  compressedSize: string;
  duration: string | number;
  createdAt: string;
  updatedAt: string;
};

function getCloudinaryBaseUrl() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) return null;

  return `https://res.cloudinary.com/${cloudName}`;
}

function encodePublicId(publicId: string) {
  return encodeURIComponent(publicId).replace(/%2F/g, "/");
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value >= 100 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}

export function formatDuration(value: string | number) {
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

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();

  if (!Number.isFinite(timestamp)) return "recently";

  const diffInSeconds = Math.round((timestamp - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(diffInSeconds) >= secondsInUnit || unit === "second") {
      return formatter.format(Math.round(diffInSeconds / secondsInUnit), unit);
    }
  }

  return "recently";
}

export function getCompressionStats(originalSize: string | number, compressedSize: string | number) {
  const original = Number(originalSize);
  const compressed = Number(compressedSize);
  const savedBytes = Math.max(original - compressed, 0);
  const savedPercentage =
    original > 0 && compressed > 0 ? Math.round((savedBytes / original) * 100) : 0;

  return {
    original,
    compressed,
    savedBytes,
    savedPercentage,
  };
}

export function buildCloudinaryVideoUrl(publicId: string) {
  const baseUrl = getCloudinaryBaseUrl();

  if (!baseUrl) return null;

  return `${baseUrl}/video/upload/f_mp4,q_auto/${encodePublicId(publicId)}.mp4`;
}

export function buildCloudinaryAiPreviewUrl(publicId: string) {
  const baseUrl = getCloudinaryBaseUrl();

  if (!baseUrl) return null;

  return `${baseUrl}/video/upload/e_preview:duration_8,f_mp4,q_auto/${encodePublicId(publicId)}.mp4`;
}

export function buildCloudinaryVideoPosterUrl(publicId: string) {
  const baseUrl = getCloudinaryBaseUrl();

  if (!baseUrl) return null;

  return `${baseUrl}/video/upload/f_jpg,q_auto,so_auto/${encodePublicId(publicId)}.jpg`;
}
