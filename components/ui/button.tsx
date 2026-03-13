import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer",
          {
            // Primary: Uses your OKLCH primary and foreground
            "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20": 
              variant === "primary",
            
            // Outline: Uses semantic border and accent colors
            "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground": 
              variant === "outline",
            
            // Ghost: Subtle hover state using accent color
            "hover:bg-accent hover:text-accent-foreground text-foreground bg-transparent": 
              variant === "ghost",

            // Sizes
            "px-4 py-2 text-xs uppercase tracking-wider": size === "sm",
            "px-6 py-2.5 text-sm": size === "md",
            "px-10 py-4 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
