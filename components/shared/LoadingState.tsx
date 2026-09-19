import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  fullScreen = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen ? "min-h-screen" : "min-h-[240px]",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]">
        <Loader2
          size={18}
          className="animate-spin text-[var(--foreground)]"
        />
      </div>

      <p className="mt-3 text-xs font-medium text-[var(--muted)]">
        {message}
      </p>
    </div>
  );
}