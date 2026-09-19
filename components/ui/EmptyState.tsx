import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[280px] flex-col items-center justify-center",
        "rounded-2xl border border-dashed border-[var(--border)]",
        "bg-[var(--card)] px-6 py-10 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--muted)]">
        {icon ?? <Inbox size={20} strokeWidth={1.8} />}
      </div>

      <h3 className="text-sm font-semibold text-[var(--foreground)]">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-5 text-[var(--muted)]">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}