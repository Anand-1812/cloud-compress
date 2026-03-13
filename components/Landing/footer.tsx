import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t border-border py-8 bg-background">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-black text-[10px]">CC</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            CloudCompress v0.1
          </span>
        </div>

        <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <Link href="https://github.com/anand-1812" className="hover:text-primary transition-colors">Github</Link>
          <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
          <Link href="/api" className="hover:text-primary transition-colors">API</Link>
        </div>
      </div>
    </footer>
  )
}
