import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({
  className,
  error = false,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[var(--radius)] border bg-[var(--card)] px-3 text-sm",
        "text-[var(--foreground)] placeholder:text-[var(--muted)]",
        "border-[var(--border)]",
        "transition-all duration-200",
        "outline-none",
        "focus:border-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)]/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error &&
          "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/10",
        className
      )}
      {...props}
    />
  );
}