import { Sparkles } from "lucide-react";

export function AIEmptyState() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]">
        <Sparkles
          size={21}
          className="text-[var(--foreground)]"
        />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        How can I help?
      </h3>

      <p className="mx-auto mt-1.5 max-w-[280px] text-xs leading-5 text-[var(--muted)]">
        Ask me about your tasks, projects, team,
        or anything happening in your workspace.
      </p>
    </div>
  );
}