import { ArrowDownRight, CheckCircle2, Sparkles } from "lucide-react"

const formatChips = ["JPEG", "PNG", "WebP", "AVIF"]

const statTiles = [
  { label: "Saved", value: "89%" },
  { label: "Quality", value: "98/100" },
  { label: "Output", value: "412 KB" },
  { label: "Speed", value: "0.8 sec" },
]

export function HeroProductPreview() {
  return (
    <div className="mt-14 mx-auto max-w-5xl">
      <div className="relative rounded-[2rem] border border-border/80 bg-card/80 p-4 shadow-2xl backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_30px_80px_-30px_var(--color-primary)] md:p-6">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/10" />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Live Compression Preview
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed in 0.8 sec
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Size Reduction
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                  <span className="text-muted-foreground">Original</span>
                  <span className="text-foreground">3.8 MB</span>
                </div>
                <div className="h-2 rounded-full bg-accent">
                  <div className="h-2 w-full rounded-full bg-muted-foreground/40" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                  <span className="text-muted-foreground">Compressed</span>
                  <span className="text-primary">412 KB</span>
                </div>
                <div className="h-2 rounded-full bg-accent">
                  <div className="h-2 w-[11%] rounded-full bg-primary" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex h-28 items-end justify-between rounded-xl border border-dashed border-border bg-gradient-to-br from-accent/50 via-transparent to-primary/15 px-3 pb-3">
              <div className="w-8 rounded-md bg-primary/20" style={{ height: "70%" }} />
              <div className="w-8 rounded-md bg-primary/30" style={{ height: "62%" }} />
              <div className="w-8 rounded-md bg-primary/50" style={{ height: "46%" }} />
              <div className="w-8 rounded-md bg-primary/70" style={{ height: "31%" }} />
              <div className="w-8 rounded-md bg-primary" style={{ height: "18%" }} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Output Summary
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {statTiles.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-card px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {formatChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border bg-accent/60 px-3 py-1 text-xs font-semibold text-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground md:text-sm">
        <span className="inline-flex items-center gap-2">
          <ArrowDownRight className="h-4 w-4 text-primary" />
          Drop files and get optimized assets instantly
        </span>
        <span>No plugin setup</span>
        <span>API ready</span>
      </div>
    </div>
  )
}
