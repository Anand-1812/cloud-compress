"use client"

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"
import { SignUpButton, useUser } from "@clerk/nextjs"

export function CTA() {
  const { isSignedIn } = useUser()

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto p-12 rounded-[3rem] border border-border bg-secondary/30 text-center relative overflow-hidden backdrop-blur-sm">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 text-foreground">
          Ready to compress with <br />
          <span className="text-primary italic">zero compromise?</span>
        </h2>
        
        <p className="max-w-md mx-auto text-muted-foreground mb-10 font-medium">
          Join the build phase. Start optimizing your assets or contribute to the core engine on GitHub.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isSignedIn ? (
            <SignUpButton mode="redirect">
              <Button size="lg" className="rounded-2xl px-8 h-14 bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition-all shadow-md">
                Get Started Free
              </Button>
            </SignUpButton>
          ) : (
            <Link href="/home">
              <Button size="lg" className="rounded-2xl px-8 h-14 bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition-all">
                Go to Dashboard
              </Button>
            </Link>
          )}

          <Link href="https://github.com/anand-1812/cloud-compress" target="_blank">
            <Button size="lg" variant="outline" className="rounded-2xl px-8 h-14 border-border bg-background font-bold hover:bg-accent transition-all text-foreground">
              <Github className="mr-2 w-5 h-5" />
              Star on GitHub
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
