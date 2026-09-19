"use client";

import {
  ArrowRight,
  CheckSquare,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AISuggestionsProps {
  onSelect: (prompt: string) => void;
}

const suggestions = [
  {
    label: "Plan my day",
    prompt:
      "Help me prioritize my tasks for today.",
    icon: CheckSquare,
  },
  {
    label: "Project summary",
    prompt:
      "Give me a summary of my active projects.",
    icon: Sparkles,
  },
  {
    label: "What's next?",
    prompt:
      "What should I focus on next?",
    icon: Lightbulb,
  },
];

export function AISuggestions({
  onSelect,
}: AISuggestionsProps) {
  return (
    <div className="mt-6">
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        Try asking
      </p>

      <div className="space-y-1.5">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;

          return (
            <button
              key={suggestion.label}
              type="button"
              onClick={() =>
                onSelect(suggestion.prompt)
              }
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl",
                "border border-[var(--border)]",
                "p-3 text-left",
                "transition-all duration-200",
                "hover:border-[var(--foreground)]/20",
                "hover:bg-[var(--accent)]"
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--muted)]">
                <Icon size={15} />
              </div>

              <span className="flex-1 text-xs font-medium">
                {suggestion.label}
              </span>

              <ArrowRight
                size={14}
                className="text-[var(--muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}