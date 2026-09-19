import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AILoading() {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)]">
        <Sparkles size={13} />
      </div>

      <div
        className={cn(
          "flex items-center gap-1 rounded-2xl rounded-bl-md",
          "bg-[var(--accent)] px-4 py-3"
        )}
      >
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-50 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-50 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-50" />
      </div>
    </div>
  );
}