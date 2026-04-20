"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  BookOpen,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  Video,
  X,
  Zap
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const WORKSPACE_LINKS = [
  {
    href: "/home",
    label: "Dashboard",
    Icon: LayoutDashboard,
  },
  {
    href: "/social-share",
    label: "Image Engine",
    Icon: ImageIcon,
  },
  {
    href: "/video-upload",
    label: "Video Engine",
    Icon: Video,
  },
  {
    href: "/docs",
    label: "Docs",
    Icon: BookOpen,
  },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const isDark = resolvedTheme === "dark";

  return (
    <>
      {/* MOBILE TRIGGER - Flush to top */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-sidebar-border/50 bg-background/80 px-6 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-black text-black">CC</span>
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Studio</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/40 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* CORE 2.0 SIDEBAR */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* TOP: BRANDING */}
        <div className="flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <span className="text-sm font-black text-black">CC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-sidebar-foreground">CloudCompress</span>
            </div>
          </Link>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* MIDDLE: SCROLLABLE NAVIGATION */}
        <div className="flex-1 space-y-8 overflow-y-auto px-4 py-6 scrollbar-hide">
          
          <nav className="space-y-1">
            <p className="mb-4 px-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
              Main Menu
            </p>
            {WORKSPACE_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.Icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-accent/40 hover:text-sidebar-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  <span className="text-[13px] font-bold tracking-tight">{link.label}</span>
                  
                  {isActive && (
                    <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary-foreground/50" />
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* BOTTOM: USER PROFILE - Docked Style */}
        <div className="border-t border-sidebar-border/50 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-accent/30 p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-sidebar-border/50">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 rounded-lg",
                  }
                }}
              />
            </div>
            
            <div className="flex flex-1 flex-col min-w-0">
              <span className="truncate text-xs font-black tracking-tight text-sidebar-foreground">
                {user?.firstName || "Operator"}
              </span>
              <span className="truncate text-[10px] font-medium text-muted-foreground">
                Pro Plan
              </span>
            </div>

            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent/60 hover:text-sidebar-foreground"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <SignOutButton redirectUrl="/">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </SignOutButton>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
             <Zap className="h-3 w-3" />
             Cloud Processing Active
          </div>
        </div>
      </aside>
    </>
  );
}
