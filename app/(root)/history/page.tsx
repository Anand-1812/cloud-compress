"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Clock3,
  Database,
  HardDrive,
  LoaderCircle,
  Sparkles,
  TrendingDown,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatBytes,
  formatDate,
  formatDuration,
  getCompressionStats,
  type VideoRecord,
} from "@/lib/video-utils";

type TrendPoint = {
  key: string;
  label: string;
  uploads: number;
  original: number;
  compressed: number;
  saved: number;
};

const MAX_TREND_POINTS = 8;

function getTimestamp(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getDayKey(value: string) {
  const timestamp = getTimestamp(value);
  if (!timestamp) return "Unknown";

  return new Date(timestamp).toISOString().slice(0, 10);
}

function getShortDateLabel(dayKey: string) {
  if (dayKey === "Unknown") return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dayKey));
}

function buildTrendData(videos: VideoRecord[]) {
  const buckets = new Map<string, TrendPoint>();

  videos.forEach((video) => {
    const key = getDayKey(video.createdAt);
    const existing = buckets.get(key);
    const { original, compressed, savedBytes } = getCompressionStats(
      video.originalSize,
      video.compressedSize
    );

    if (existing) {
      existing.uploads += 1;
      existing.original += original;
      existing.compressed += compressed;
      existing.saved += savedBytes;
      return;
    }

    buckets.set(key, {
      key,
      label: getShortDateLabel(key),
      uploads: 1,
      original,
      compressed,
      saved: savedBytes,
    });
  });

  return Array.from(buckets.values())
    .sort((a, b) => (a.key > b.key ? 1 : -1))
    .slice(-MAX_TREND_POINTS);
}

function getTrendPath(points: TrendPoint[], maxSaved: number) {
  if (points.length === 0) return "";

  const width = 640;
  const height = 220;
  const paddingX = 44;
  const paddingY = 34;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  return points
    .map((point, index) => {
      const x =
        points.length === 1
          ? width / 2
          : paddingX + (index / (points.length - 1)) * usableWidth;
      const y = height - paddingY - (point.saved / maxSaved) * usableHeight;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function StatCard({
  title,
  value,
  detail,
  Icon,
}: {
  title: string;
  value: string;
  detail: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-card/60 p-6 shadow-lg backdrop-blur-xl">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
        {title}
      </p>
      <p className="mt-2 text-3xl font-black tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-sm font-medium text-muted-foreground">{detail}</p>
    </div>
  );
}

function TrendChart({ points }: { points: TrendPoint[] }) {
  const maxSaved = Math.max(...points.map((point) => point.saved), 1);
  const path = getTrendPath(points, maxSaved);

  return (
    <div className="rounded-[3rem] border border-border bg-card/50 p-6 shadow-xl backdrop-blur-xl md:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Trend
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Saved over time</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-muted-foreground">
            Daily compression savings grouped from your Postgres video upload records.
          </p>
        </div>
        <div className="rounded-full border border-border bg-background px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
          Last {points.length} active days
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border bg-background/70 p-4">
        <svg viewBox="0 0 640 220" className="h-[260px] w-full overflow-visible">
          <defs>
            <linearGradient id="history-bar-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((line) => {
            const y = 34 + line * 48;
            return (
              <line
                key={line}
                x1="36"
                x2="604"
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="5 8"
                strokeOpacity="0.7"
              />
            );
          })}

          {points.map((point, index) => {
            const x =
              points.length === 1 ? 320 : 44 + (index / (points.length - 1)) * 552;
            const height = Math.max((point.saved / maxSaved) * 150, point.saved > 0 ? 8 : 2);
            const y = 186 - height;

            return (
              <g key={point.key}>
                <rect
                  x={x - 18}
                  y={y}
                  width="36"
                  height={height}
                  rx="12"
                  fill="url(#history-bar-gradient)"
                />
                <text
                  x={x}
                  y="212"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] font-bold"
                >
                  {point.label}
                </text>
              </g>
            );
          })}

          {path && (
            <path
              d={path}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.slice(-4).map((point) => (
            <div key={point.key} className="rounded-2xl bg-muted/30 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {point.label}
              </p>
              <p className="mt-1 text-lg font-black text-foreground">{formatBytes(point.saved)}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {point.uploads} upload{point.uploads === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch("/api/videos", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load compression history.");
        }

        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load compression history."
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadHistory();
  }, []);

  const sortedVideos = useMemo(
    () => [...videos].sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt)),
    [videos]
  );

  const totals = useMemo(() => {
    return videos.reduce(
      (acc, video) => {
        const { original, compressed, savedBytes } = getCompressionStats(
          video.originalSize,
          video.compressedSize
        );

        acc.original += original;
        acc.compressed += compressed;
        acc.saved += savedBytes;
        acc.duration += Number(video.duration) || 0;

        return acc;
      },
      { original: 0, compressed: 0, saved: 0, duration: 0 }
    );
  }, [videos]);

  const averageCompression =
    totals.original > 0 ? Math.round((totals.saved / totals.original) * 100) : 0;

  const bestVideo = useMemo(() => {
    return videos
      .map((video) => ({
        video,
        stats: getCompressionStats(video.originalSize, video.compressedSize),
      }))
      .sort((a, b) => b.stats.savedBytes - a.stats.savedBytes)[0];
  }, [videos]);

  const trendPoints = useMemo(() => buildTrendData(videos), [videos]);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-10%] top-[-10%] h-[36%] w-[36%] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-[-8%] right-[-8%] h-[32%] w-[32%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <section className="relative mx-auto max-w-[1450px] px-6 py-10">
        <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Link
              href="/home"
              className="group mb-4 inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tighter md:text-6xl">
              Savings that prove the engine is working.
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-muted-foreground">
              Track how much storage and transfer weight you have saved across your uploaded
              videos, using the original and compressed sizes already stored in Postgres.
            </p>
          </div>

          <Link href="/video-upload">
            <Button className="h-12 rounded-2xl px-7 text-xs font-black uppercase tracking-[0.2em]">
              Upload Video
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </header>

        {errorMessage && (
          <div className="mb-8 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-[3rem] border border-border bg-card/40">
            <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
              <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
              Loading compression history...
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[3rem] border border-dashed border-border bg-card/40 px-6 text-center">
            <Database className="h-12 w-12 text-primary" />
            <h2 className="mt-5 text-3xl font-black tracking-tight">No compression history yet</h2>
            <p className="mt-3 max-w-xl font-medium text-muted-foreground">
              Upload your first video and this page will start tracking total savings, compression
              rate, and upload trends over time.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Saved"
                value={formatBytes(totals.saved)}
                detail={`Across ${videos.length} upload${videos.length === 1 ? "" : "s"}`}
                Icon={TrendingDown}
              />
              <StatCard
                title="Average Reduction"
                value={`${averageCompression}%`}
                detail={`${formatBytes(totals.original)} original asset weight`}
                Icon={Sparkles}
              />
              <StatCard
                title="Compressed Output"
                value={formatBytes(totals.compressed)}
                detail="Total optimized delivery size"
                Icon={HardDrive}
              />
              <StatCard
                title="Processed Runtime"
                value={formatDuration(totals.duration)}
                detail="Combined duration of uploaded videos"
                Icon={Clock3}
              />
            </div>

            <TrendChart points={trendPoints} />

            <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
              <section className="rounded-[3rem] border border-border bg-card/50 p-6 shadow-xl backdrop-blur-xl md:p-8">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                      Timeline
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight">Recent jobs</h2>
                  </div>
                  <div className="rounded-full border border-border bg-background px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                    {videos.length} records
                  </div>
                </div>

                <div className="space-y-4">
                  {sortedVideos.slice(0, 8).map((video) => {
                    const { original, compressed, savedBytes, savedPercentage } =
                      getCompressionStats(video.originalSize, video.compressedSize);

                    return (
                      <article
                        key={video.id}
                        className="rounded-[2rem] border border-border bg-background/70 p-5"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                                {savedPercentage}% saved
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDate(video.createdAt)}
                              </span>
                            </div>
                            <h3 className="truncate text-xl font-black tracking-tight text-foreground">
                              {video.title}
                            </h3>
                            <p className="mt-1 line-clamp-1 text-sm font-medium text-muted-foreground">
                              {video.description || "No description added"}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-right">
                            <div className="rounded-2xl bg-muted/30 p-3">
                              <p className="text-[10px] font-black uppercase text-muted-foreground">
                                Original
                              </p>
                              <p className="mt-1 text-sm font-black">{formatBytes(original)}</p>
                            </div>
                            <div className="rounded-2xl bg-muted/30 p-3">
                              <p className="text-[10px] font-black uppercase text-muted-foreground">
                                Output
                              </p>
                              <p className="mt-1 text-sm font-black">{formatBytes(compressed)}</p>
                            </div>
                            <div className="rounded-2xl bg-muted/30 p-3">
                              <p className="text-[10px] font-black uppercase text-muted-foreground">
                                Saved
                              </p>
                              <p className="mt-1 text-sm font-black text-emerald-500">
                                {formatBytes(savedBytes)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <aside className="space-y-6">
                <div className="rounded-[3rem] border border-border bg-card/50 p-8 shadow-xl backdrop-blur-xl">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    Best Save
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight">
                    {bestVideo?.video.title ?? "No winner yet"}
                  </h2>
                  <p className="mt-4 font-medium leading-relaxed text-muted-foreground">
                    {bestVideo
                      ? `${formatBytes(bestVideo.stats.savedBytes)} saved on this upload.`
                      : "Upload more videos to calculate the strongest compression result."}
                  </p>
                </div>

              </aside>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
