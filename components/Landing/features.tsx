import { Zap, Shield, FileCode, Monitor } from "lucide-react"

const specs = [
  {
    title: "Client-Side Processing",
    desc: "Images are compressed directly in your browser or at the edge. Speed is the priority.",
    icon: Zap
  },
  {
    title: "Privacy First",
    desc: "We don't store your assets. Files are processed and immediately removed from memory.",
    icon: Shield
  },
  {
    title: "Modern Formats",
    desc: "Full support for WebP and AVIF conversion to ensure your site stays fast.",
    icon: FileCode
  },
  {
    title: "Lossless Quality",
    desc: "Advanced algorithms preserve pixel data while stripping unnecessary metadata.",
    icon: Monitor
  }
]

export function Features() {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
            Built For Speed
          </p>
          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Everything you need to ship lighter pages
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {specs.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-accent/40 hover:shadow-xl"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0%,transparent_60%)]" />

              <div className="relative z-10 mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="relative z-10 mb-2 text-lg font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="relative z-10 text-sm font-medium leading-snug text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
