"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "oklch(0.5393 0.2713 286.7462)",
          colorBackground: "var(--background)",
          colorText: "var(--foreground)",
          borderRadius: "1rem",
          fontFamily: "var(--font-geist-sans)",
        },
        elements: {
          card: "bg-background border border-border shadow-xl",
          formButtonPrimary:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/80",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {children}
    </ClerkProvider>
  )
}
