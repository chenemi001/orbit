import { Sparkles } from "lucide-react";

export function AIHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]">
        <Sparkles
          size={15}
          className="text-[var(--foreground)]"
        />
      </div>

      <div>
        <p className="text-xs font-semibold">
          AI Assistant
        </p>

        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <span className="text-[10px] text-[var(--muted)]">
            Ready to help
          </span>
        </div>
      </div>
    </div>
  );
}