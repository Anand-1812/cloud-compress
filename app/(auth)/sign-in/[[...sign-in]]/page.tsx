import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--color-primary)_0%,transparent_55%)] opacity-15" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:38px_38px] opacity-[0.22]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </div>
    </div>
  )
}
