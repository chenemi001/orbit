"use client";

import {
  ChevronDown,
  Filter,
  SlidersHorizontal,
} from "lucide-react";

interface TaskFiltersProps {
  status?: string;
  priority?: string;
  onStatusChange?: (value: string) => void;
  onPriorityChange?: (value: string) => void;
}

export function TaskFilters({
  status = "all",
  priority = "all",
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3">
        <Filter
          size={14}
          className="text-[var(--muted)]"
        />

        <select
          value={status}
          onChange={(event) =>
            onStatusChange?.(event.target.value)
          }
          className="appearance-none bg-transparent pr-5 text-xs font-medium outline-none"
        >
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">
            In progress
          </option>
          <option value="in_review">In review</option>
          <option value="completed">Completed</option>
        </select>

        <ChevronDown
          size={12}
          className="-ml-5 pointer-events-none text-[var(--muted)]"
        />
      </div>

      <div className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3">
        <SlidersHorizontal
          size={14}
          className="text-[var(--muted)]"
        />

        <select
          value={priority}
          onChange={(event) =>
            onPriorityChange?.(event.target.value)
          }
          className="appearance-none bg-transparent pr-5 text-xs font-medium outline-none"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <ChevronDown
          size={12}
          className="-ml-5 pointer-events-none text-[var(--muted)]"
        />
      </div>
    </div>
  );
}