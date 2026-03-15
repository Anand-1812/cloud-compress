import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import { HeroAmbientEffects } from "./hero-ambient-effects"
import { HeroProductPreview } from "./hero-product-preview"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background pt-32 pb-20 md:pt-48 md:pb-32">
      <HeroAmbientEffects />

      {/* Dynamic Background Glow - uses primary with theme-aware opacity */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 dark:bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        {/* Badge: Uses semantic border and accent colors from globals.css */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-accent/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary transition-colors">
          <Zap className="w-3 h-3 fill-primary" />
          <span>New: AI-Powered Compression Engine</span>
        </div>

        {/* Title: Uses foreground to ensure visibility in light mode */}
        <h1 className="mb-8 bg-gradient-to-b from-foreground via-foreground to-foreground/65 bg-clip-text text-5xl leading-[1.05] font-black tracking-tighter text-transparent md:text-7xl">
          Compress images <br /> with <span className="text-primary">zero</span> compromise.
        </h1>

        {/* Description: Uses muted-foreground for better contrast in light mode */}
        <p className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
          Cut asset size by up to 65% while keeping visual fidelity. Built for teams who care about web performance and product quality.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="primary"
            className="group h-14 rounded-2xl px-8 text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/30"
          >
            Start Compressing
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-14 rounded-2xl border-border bg-background/70 px-8 text-base font-bold backdrop-blur-md transition-colors hover:bg-accent/70"
          >
            View API Docs
          </Button>
        </div>

        <HeroProductPreview />
      </div>
    </section>
  )
}
