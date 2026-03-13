"use client"

import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
    >
      Toggle Theme
    </button>
  )
}
