import { ClerkProvider } from "@clerk/nextjs"

export function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
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
      signInFallbackRedirectUrl="/home"
      signUpFallbackRedirectUrl="/home"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  )
}
