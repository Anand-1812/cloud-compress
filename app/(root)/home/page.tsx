import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Sparkles, Video } from "lucide-react";

import { Button } from "@/components/ui/button";

const tools = [
  {
    href: "/social-share",
    title: "Image Compression + Social Resize",
    description:
      "Upload once, fit your image for Instagram, X, LinkedIn, and more with clean auto-crop exports.",
    meta: "Best for creators and social teams",
    Icon: ImageIcon,
  },
  {
    href: "/video-upload",
    title: "Video Compression",
    description:
      "Shrink large video files for faster sharing while keeping enough quality for publishing.",
    meta: "Best for demos and portfolio clips",
    Icon: Video,
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden pb-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_15%_10%,var(--color-primary)_0%,transparent_60%)] opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-[32rem] bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.14]" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-9 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[2.1rem] border border-border/70 bg-card/80 p-7 shadow-xl backdrop-blur xl:p-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Dashboard
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tighter sm:text-5xl">
            Choose what you want to compress.
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-muted-foreground sm:text-base">
            Pick an image or video workflow below. Each tool is optimized for
            upload speed and clean export dimensions.
          </p>
        </header>

        <div className="grid gap-7 lg:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.Icon;

            return (
              <article
                key={tool.href}
                className="group rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl xl:p-8"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-2xl font-black tracking-tight text-foreground">
                  {tool.title}
                </h2>
                <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">
                  {tool.description}
                </p>

                <p className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-primary/90">
                  {tool.meta}
                </p>

                <Link href={tool.href} className="mt-6 inline-flex">
                  <Button className="rounded-full px-7">
                    Open Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
