"use client";

import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl",
        "border border-[var(--border)]",
        "bg-[var(--accent)]/60 p-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={tab.disabled}
            onClick={() => onChange(tab.value)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[var(--foreground)]/20",
              "disabled:pointer-events-none disabled:opacity-50",
              active
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}