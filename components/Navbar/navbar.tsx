"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"

import {
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"

const NAV_LINKS = [
  { href: "/home", label: "Dashboard" },
  { href: "/social-share", label: "Image Compress" },
  { href: "/video-upload", label: "Video Compress" },
]

export function Navigation() {

  const { resolvedTheme, setTheme } = useTheme()
  const { isSignedIn } = useUser()
  const pathname = usePathname()
  const isDarkTheme = resolvedTheme === "dark"

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between 
      rounded-2xl border border-white/10 bg-background/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

        {/* LEFT */}
        <div className="flex items-center gap-12">

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center 
            shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all group-hover:scale-105 group-hover:rotate-3">
              <span className="text-black font-black text-base">CC</span>
            </div>

            <span className="font-extrabold tracking-tighter text-xl text-foreground">
              CloudCompress
            </span>
          </Link>

          <div className="hidden md:flex gap-2 rounded-full border border-border/70 bg-background/70 px-2 py-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-foreground/55 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl cursor-pointer"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
          >
            <Sun className="hidden h-5 w-5 dark:block" />
            <Moon className="h-5 w-5 dark:hidden" />
          </Button>

          {/* When user is NOT logged in */}
          {!isSignedIn && (
            <SignUpButton mode="redirect">
              <Button className="rounded-xl px-7 py-2.5 bg-primary text-black font-bold uppercase tracking-wider cursor-pointer">
                Get Started
              </Button>
            </SignUpButton>
          )}

          {/* When user IS logged in */}
          {isSignedIn && <UserButton />}

        </div>

      </div>
    </nav>
  )
}
