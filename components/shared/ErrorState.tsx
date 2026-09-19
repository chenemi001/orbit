"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[280px] flex-col items-center justify-center",
        "px-6 text-center",
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <AlertCircle size={20} />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs leading-5 text-[var(--muted)]">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 flex h-9 items-center gap-2 rounded-lg bg-[var(--foreground)] px-3.5 text-xs font-medium text-[var(--background)] transition-opacity hover:opacity-90"
        >
          <RefreshCw size={13} />
          Try again
        </button>
      )}
    </div>
  );
}