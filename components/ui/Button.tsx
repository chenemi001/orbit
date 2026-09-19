import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--foreground)] text-[var(--background)] shadow-sm hover:opacity-90",
  secondary:
    "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-sm hover:bg-[var(--accent)]",
  ghost:
    "bg-transparent text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]",
  danger:
    "bg-[var(--danger)] text-white shadow-sm hover:opacity-90",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius)] px-4 text-sm font-medium",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}