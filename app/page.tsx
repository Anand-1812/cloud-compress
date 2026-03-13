import { Navigation } from "@/components/Navbar/navbar"
import { Hero } from "@/components/Landing/hero"
import { Features } from "@/components/Landing/features"
import { CTA } from "@/components/Landing/cta"
import { Footer } from "@/components/Landing/footer"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
