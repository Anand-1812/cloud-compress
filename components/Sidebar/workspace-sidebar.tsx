"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Video,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const WORKSPACE_LINKS = [
  {
    href: "/home",
    label: "Dashboard",
    description: "Workspace overview",
    Icon: LayoutDashboard,
  },
  {
    href: "/social-share",
    label: "Image Compress",
    description: "Resize and optimize images",
    Icon: ImageIcon,
  },
  {
    href: "/video-upload",
    label: "Video Compress",
    description: "Shrink large video files",
    Icon: Video,
  },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const isDarkTheme = resolvedTheme === "dark";

  useEffect(() => {
    if (!isOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              <span className="text-base font-black text-black">CC</span>
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-foreground">
                CloudCompress
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Workspace
              </p>
            </div>
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setIsOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity md:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[19rem] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              <span className="text-base font-black text-black">CC</span>
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-foreground">
                CloudCompress
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Sidebar Navigation
              </p>
            </div>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-xl md:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          <div className="rounded-2xl border border-sidebar-border bg-background/60 p-3.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Signed In
            </p>
            <p className="mt-2 truncate text-sm font-black tracking-tight text-foreground">
              {user?.fullName || user?.firstName || "CloudCompress User"}
            </p>
            <p className="truncate text-xs font-medium text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress || "Session active"}
            </p>
          </div>

          <div>
            <p className="px-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Workspace
            </p>
            <nav className="mt-3 space-y-2">
              {WORKSPACE_LINKS.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                const Icon = link.Icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group block rounded-2xl border px-3.5 py-3 transition-all",
                      isActive
                        ? "border-primary bg-primary/12 shadow-md shadow-primary/15"
                        : "border-sidebar-border bg-background/60 hover:border-primary/45 hover:bg-accent/45"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-black tracking-tight text-foreground">
                          {link.label}
                        </p>
                        <p className="truncate text-xs font-medium text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="rounded-2xl border border-sidebar-border bg-gradient-to-br from-primary/12 to-transparent p-3.5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Quick Actions
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
              >
                {isDarkTheme ? (
                  <Sun className="mr-2 h-3.5 w-3.5" />
                ) : (
                  <Moon className="mr-2 h-3.5 w-3.5" />
                )}
                Theme
              </Button>

              <Link href="/">
                <Button type="button" variant="outline" size="sm" className="rounded-xl">
                  <Home className="mr-2 h-3.5 w-3.5" />
                  Landing
                </Button>
              </Link>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Optimized App Shell
          </div>
        </div>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-sidebar-border bg-background/60 p-3">
            <UserButton />

            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="inline-flex items-center rounded-xl border border-border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-foreground transition-all hover:bg-accent"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>
    </>
  );
}
