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
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {specs.map((item, i) => (
          <div key={i} className="group p-8 rounded-[2rem] border border-border bg-card hover:bg-accent/50 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 tracking-tight text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-snug font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
