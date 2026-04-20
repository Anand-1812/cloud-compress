"use client";

import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Sparkles, Video,Zap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoLibrary } from "@/components/Home/video-library";
import { cn } from "@/lib/utils";

const tools = [
  {
    href: "/social-share",
    title: "Social Image Studio",
    description: "Pro-grade compression with intelligent auto-cropping for Instagram, X, and LinkedIn.",
    meta: "Image Optimizer",
    Icon: ImageIcon,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    href: "/video-upload",
    title: "Video Engine",
    description: "High-efficiency video transcoding. Shrink raw footage while maintaining publishing bitrate.",
    meta: "Video Transcoder",
    Icon: Video,
    color: "bg-blue-500/10 text-blue-500",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Dynamic Studio Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-primary/10 blur-[140px] rounded-full opacity-60 dark:opacity-40" />
        <div className="absolute bottom-20 right-[-5%] w-[30%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.08]" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        {/* Dashboard Header - Floating Pill Style */}
        <header className="relative mb-16 rounded-[3rem] border border-border/50 bg-card/40 p-10 backdrop-blur-3xl shadow-2xl xl:p-14 overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
             <Layers className="w-32 h-32 text-primary" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <Zap className="h-3.5 w-3.5 fill-primary" />
              Project Hub
            </div>

            <h1 className="mt-8 text-5xl font-black tracking-tighter md:text-7xl leading-[0.9]">
              Your compression <br />
              <span className="text-muted-foreground">workspace.</span>
            </h1>
            
            <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground/80">
              Select a specialized engine below to begin. Each module is hardware-accelerated and optimized for zero-loss visual fidelity.
            </p>
          </div>
        </header>

        {/* Tool Selection Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.Icon;

            return (
              <article
                key={tool.href}
                className="group relative rounded-[2.5rem] border border-border/50 bg-card/50 p-8 md:p-12 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-card/80 backdrop-blur-md overflow-hidden"
              >
                {/* Background Glow Effect */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-[60px] rounded-full group-hover:bg-primary/20 transition-colors" />

                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className={cn("inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background shadow-inner", tool.color)}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="px-3 py-1 rounded-full border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-background/50">
                      {tool.meta}
                    </div>
                  </div>

                  <h2 className="text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </h2>
                  
                  <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground/80">
                    {tool.description}
                  </p>

                  <div className="mt-10 pt-8 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                       <Sparkles className="h-3 w-3 text-primary" />
                       Ready for production
                    </div>
                    <Link href={tool.href}>
                      <Button className="rounded-2xl h-12 px-8 bg-foreground text-background font-bold uppercase tracking-tighter text-xs group-hover:scale-105 transition-transform">
                        Launch Engine
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <VideoLibrary />

        {/* Bottom Status / Specs Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
             Cloud Processing Active
           </div>
           <div className="hidden sm:block text-border">•</div>
           <div>AES-256 Encrypted</div>
           <div className="hidden sm:block text-border">•</div>
           <div>Studio Version 0.1.0</div>
        </div>
      </section>
    </main>
  );
}
