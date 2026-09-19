"use client";

import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  onClose?: () => void;
  className?: string;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function Toast({
  title,
  description,
  variant = "info",
  onClose,
  className,
}: ToastProps) {
  const Icon = icons[variant];

  return (
    <div
      role="status"
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-xl",
        "border border-[var(--border)]",
        "bg-[var(--card)] p-4",
        "shadow-xl shadow-black/5",
        className
      )}
    >
      <Icon
        size={19}
        className={cn(
          "mt-0.5 shrink-0",
          variant === "success" && "text-[var(--success)]",
          variant === "error" && "text-[var(--danger)]",
          variant === "info" && "text-blue-500"
        )}
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {title}
        </p>

        {description && (
          <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
            {description}
          </p>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            "text-[var(--muted)]",
            "transition-colors",
            "hover:bg-[var(--accent)] hover:text-[var(--foreground)]",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[var(--foreground)]/20"
          )}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}