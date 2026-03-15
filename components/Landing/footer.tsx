import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
            <span className="text-primary-foreground font-black text-[10px]">CC</span>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            CloudCompress v0.1 • {currentYear}
          </span>
        </div>

        <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
          <Link href="https://github.com/anand-1812" className="transition-colors hover:text-primary">
            Github
          </Link>
          <Link href="/docs" className="transition-colors hover:text-primary">
            Docs
          </Link>
          <Link href="/api" className="transition-colors hover:text-primary">
            API
          </Link>
        </div>
      </div>
    </footer>
  )
}
