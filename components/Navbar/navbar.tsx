"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import {
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"

export function Navigation() {

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

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

          <div className="hidden md:flex gap-10 text-[12px] font-bold uppercase tracking-[0.15em] text-foreground/40">
            <Link href="/docs" className="hover:text-primary transition-all">
              Docs
            </Link>

            <Link href="/api" className="hover:text-primary transition-all">
              API
            </Link>
          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl cursor-pointer"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* When user is NOT logged in */}
          {!user && (
            <SignUpButton mode="redirect">
              <Button className="rounded-xl px-7 py-2.5 bg-primary text-black font-bold uppercase tracking-wider cursor-pointer">
                Get Started
              </Button>
            </SignUpButton>
          )}

          {/* When user IS logged in */}
          {user && <UserButton />}

        </div>

      </div>
    </nav>
  )
}
