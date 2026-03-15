const fallingParticles = [
  { left: "8%", delay: "0s", duration: "12s" },
  { left: "16%", delay: "2.4s", duration: "14s" },
  { left: "24%", delay: "1.2s", duration: "10s" },
  { left: "37%", delay: "3.1s", duration: "13s" },
  { left: "48%", delay: "0.7s", duration: "11s" },
  { left: "59%", delay: "2.8s", duration: "15s" },
  { left: "71%", delay: "1.5s", duration: "12s" },
  { left: "82%", delay: "3.6s", duration: "14s" },
  { left: "92%", delay: "0.3s", duration: "10s" },
]

export function HeroAmbientEffects() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="hero-grid-pattern absolute inset-0 opacity-35 [mask-image:radial-gradient(ellipse_at_top,black_45%,transparent_78%)]" />

      <div className="hero-blob hero-blob-one" />
      <div className="hero-blob hero-blob-two" />
      <div className="hero-blob hero-blob-three" />

      <div className="absolute inset-0">
        {fallingParticles.map((particle, index) => (
          <span
            key={index}
            className="hero-fall-dot"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>
    </div>
  )
}
