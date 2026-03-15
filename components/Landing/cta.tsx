"use client"

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"
import { SignUpButton, useUser } from "@clerk/nextjs"

export function CTA() {
  const { isSignedIn } = useUser()

  return (
    <section className="py-20 px-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[3rem] border border-border bg-secondary/30 p-12 text-center backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--color-primary)_0%,transparent_45%)] opacity-20" />
        <div className="pointer-events-none absolute -right-14 -bottom-14 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
          <span>Launch Faster</span>
        </div>

        <h2 className="relative z-10 mb-6 text-3xl font-black tracking-tighter text-foreground md:text-5xl">
          Ready to compress with <br />
          <span className="text-primary italic">zero compromise?</span>
        </h2>

        <p className="relative z-10 mx-auto mb-10 max-w-md font-medium text-muted-foreground">
          Join the build phase and speed up your delivery pipeline with an optimizer that protects quality by default.
        </p>

        <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {!isSignedIn ? (
            <SignUpButton mode="redirect">
              <Button size="lg" className="h-14 rounded-2xl bg-primary px-8 font-bold text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:shadow-xl">
                Get Started Free
              </Button>
            </SignUpButton>
          ) : (
            <Link href="/home">
              <Button size="lg" className="h-14 rounded-2xl bg-primary px-8 font-bold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-xl">
                Go to Dashboard
              </Button>
            </Link>
          )}

          <Link href="https://github.com/anand-1812/cloud-compress" target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline" className="h-14 rounded-2xl border-border bg-background/90 px-8 font-bold text-foreground transition-all hover:bg-accent">
              <Github className="mr-2 w-5 h-5" />
              Star on GitHub
            </Button>
          </Link>
        </div>

        <p className="relative z-10 mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          No setup fee · Open source core · Built for developers
        </p>
      </div>
    </section>
  )
}
