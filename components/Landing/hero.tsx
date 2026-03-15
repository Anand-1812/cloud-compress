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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-accent/50 text-primary text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
          <Zap className="w-3 h-3 fill-primary" />
          <span>New: AI-Powered Compression</span>
        </div>

        {/* Title: Uses foreground to ensure visibility in light mode */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.1]">
          Compress images <br /> with <span className="text-primary">zero</span> compromise.
        </h1>

        {/* Description: Uses muted-foreground for better contrast in light mode */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
          The fastest way to optimize your web assets. Reduce file size by up to 90% while maintaining pixel-perfect quality.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            variant="primary"
            className="rounded-2xl px-8 h-14 font-bold text-base hover:scale-[1.01] transition-transform group shadow-xl dark:shadow-primary/20"
          >
            Start Compressing
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-2xl px-8 h-14 font-bold text-base backdrop-blur-md"
          >
            View API Docs
          </Button>
        </div>

        <HeroProductPreview />
      </div>
    </section>
  )
}
