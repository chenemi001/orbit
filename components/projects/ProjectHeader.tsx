"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProjectHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onCreate: () => void;
}

export function ProjectHeader({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onCreate,
}: ProjectHeaderProps) {
  return (
    <div className="mb-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium text-[var(--muted)]">
            Workspace
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Projects
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Manage your projects, track progress, and keep your team
            aligned.
          </p>
        </div>

        <Button onClick={onCreate}>
          <Plus size={16} />
          New project
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search projects..."
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 text-sm outline-none transition-all placeholder:text-[var(--muted)] focus:border-[var(--foreground)]/20 focus:ring-2 focus:ring-[var(--foreground)]/5"
          />
        </div>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-medium outline-none"
        >
          <option value="all">All statuses</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on_hold">On hold</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-medium outline-none"
        >
          <option value="updated">Recently updated</option>
          <option value="name">Name</option>
          <option value="progress">Progress</option>
        </select>
      </div>
    </div>
  );
}
