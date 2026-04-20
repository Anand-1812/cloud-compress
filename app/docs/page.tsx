"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Monitor,
  Book,
  ChevronRight,
  Cpu,
  FileJson,
  Globe,
  Image as ImageIcon,
  Layers,
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
  Terminal,
} from "lucide-react";
import { Navigation } from "@/components/Navbar/navbar";
import { cn } from "@/lib/utils";

const DOCS_NAVIGATION = [
  {
    group: "Introduction",
    items: [
      { id: "overview", label: "System Overview", icon: Globe },
      { id: "architecture", label: "Architecture", icon: Layers },
    ],
  },
  {
    group: "Core Engines",
    items: [
      { id: "image-engine", label: "Image Studio", icon: ImageIcon },
      { id: "video-engine", label: "Video Engine", icon: Video },
    ],
  },
];

const DOC_SECTION_IDS = DOCS_NAVIGATION.flatMap((group) =>
  group.items.map((item) => item.id)
);

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === "undefined") return "overview";

    const hash = window.location.hash.replace("#", "");
    return DOC_SECTION_IDS.includes(hash) ? hash : "overview";
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry?.target.id) return;

        const nextSection = visibleEntry.target.id;
        setActiveSection(nextSection);
        window.history.replaceState(null, "", `#${nextSection}`);
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    DOC_SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navigation />

      <div className="max-w-[1440px] mx-auto flex">
        {/* TECHNICAL SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 pt-32 pb-10 px-8 border-r border-border/50">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Book className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Manual v0.1</span>
          </div>

          <nav className="flex-1 space-y-8">
            {DOCS_NAVIGATION.map((group) => (
              <div key={group.group}>
                <p className="px-2 mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">
                  {group.group}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all group",
                        activeSection === item.id
                          ? "bg-primary/10 text-primary border border-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-4 h-4",
                          activeSection === item.id ? "text-primary" : "text-muted-foreground/60"
                        )}
                      />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Back to Dashboard link at bottom of sidebar */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <Link
              href="/home"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
            >
              <Globe className="w-4 h-4" />
              Landing Page
            </Link>
          </div>
        </aside>

        {/* DOCUMENTATION CONTENT */}
        <main className="flex-1 pt-32 md:pt-40 pb-24 px-6 md:px-16 lg:px-24">
          <div className="max-w-3xl">

            {/* Mobile back button — only visible on small screens */}
            <div className="flex items-center gap-4 mb-10 lg:hidden">
              <Link
                href="/home"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/30 transition-all group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                Dashboard
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                Home
              </Link>
            </div>

            {/* OVERVIEW SECTION */}
            <section id="overview" className="mb-24 scroll-mt-32">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
                <Sparkles className="h-3 w-3" />
                Getting Started
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1]">
                CloudCompress <br />
                <span className="text-muted-foreground">Studio Engine.</span>
              </h1>
              <p className="text-lg text-muted-foreground/80 leading-relaxed mb-10 font-medium">
                CloudCompress is a specialized media processing engine built for high-performance optimization.
                It leverages a hybrid architecture combining local edge logic with global cloud distribution
                to handle intensive asset transformations.
              </p>

              <div className="p-6 rounded-3xl border border-border bg-card/40 backdrop-blur-md">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-4">
                  <Terminal className="w-4 h-4 text-primary" /> Key Capabilities
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Lossless Image Resizing",
                    "Bitrate-Aware Video Compression",
                    "Edge-Computed Previews",
                    "Cloud-Synced Metadata",
                  ].map((capability) => (
                    <li key={capability} className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                      <ChevronRight className="w-4 h-4 text-primary" /> {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ARCHITECTURE SECTION */}
            <section id="architecture" className="mb-24 scroll-mt-32 border-t border-border/50 pt-24">
              <h2 className="text-3xl font-black tracking-tight mb-8">System Architecture</h2>
              <p className="text-muted-foreground/80 mb-8 leading-relaxed">
                The platform is engineered on a three-tier stack designed to minimize the time between upload and delivery.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Transformation Layer",
                    desc: "Cloudinary-backed engine handles real-time dynamic resizing and transcoding.",
                    icon: Cpu,
                  },
                  {
                    title: "Data Persistence",
                    desc: "PostgreSQL via Prisma manages asset metadata and historical compression records.",
                    icon: FileJson,
                  },
                  {
                    title: "Identity Control",
                    desc: "Clerk-integrated middleware protects all internal studio operations and user scopes.",
                    icon: ShieldCheck,
                  },
                ].map((tier) => (
                  <div key={tier.title} className="flex gap-6 p-6 rounded-[2rem] border border-border bg-accent/20">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0">
                      <tier.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-black text-base mb-1">{tier.title}</h4>
                      <p className="text-sm text-muted-foreground font-medium">{tier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* IMAGE ENGINE SECTION */}
            <section id="image-engine" className="mb-24 scroll-mt-32 border-t border-border/50 pt-24">
              <h2 className="text-3xl font-black tracking-tight mb-8">Social Image Studio</h2>
              <p className="text-muted-foreground/80 mb-8 leading-relaxed">
                The image studio utilizes &quot;Smart-Fill&quot; algorithms to adapt raw assets into social-safe dimensions.
                It prevents pixel stretching by calculating the optimal focal point before generating the derivative.
              </p>

              <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-inner">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Optimization Strategy</span>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold border-b border-border/50 pb-4">
                    <span>Auto-Crop Logic</span>
                    <span className="text-primary tracking-widest uppercase text-[10px]">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold border-b border-border/50 pb-4">
                    <span>WebP Transformation</span>
                    <span className="text-primary tracking-widest uppercase text-[10px]">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>Lossy-to-Lossless Mapping</span>
                    <span className="text-primary tracking-widest uppercase text-[10px]">Adaptive</span>
                  </div>
                </div>
              </div>
            </section>

            {/* VIDEO ENGINE SECTION */}
            <section id="video-engine" className="mb-24 scroll-mt-32 border-t border-border/50 pt-24">
              <h2 className="text-3xl font-black tracking-tight mb-8">Video Transcoding Engine</h2>
              <p className="text-muted-foreground/80 mb-8 leading-relaxed">
                Unlike standard uploads, the Video Engine performs a multi-pass compression routine.
                It logs the original size vs. the optimized size into the database, allowing for
                real-time efficiency tracking on the dashboard.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl border border-border bg-primary/5">
                  <Zap className="w-5 h-5 text-primary mb-4" />
                  <h4 className="font-black mb-2">Fast-Pass Encoding</h4>
                  <p className="text-xs text-muted-foreground font-medium">Prioritizes upload speed for demo and internal clips.</p>
                </div>
                <div className="p-6 rounded-3xl border border-border bg-secondary/20">
                  <Monitor className="w-5 h-5 text-secondary-foreground mb-4" />
                  <h4 className="font-black mb-2">Metadata Persistence</h4>
                  <p className="text-xs text-muted-foreground font-medium">Automatic logging of duration, resolution, and format.</p>
                </div>
              </div>
            </section>

            {/* BOTTOM NAV */}
            <div className="border-t border-border/50 pt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                CloudCompress Docs v0.1
              </p>
              <div className="flex gap-3">
                <Link
                  href="/home"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/30 transition-all group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  Dashboard
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Home
                </Link>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
