"use client";

import { KeyboardEvent } from "react";
import {
  Command,
  Search as SearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export function Search({
  value = "",
  placeholder = "Search anything...",
  onChange,
  onSearch,
  className,
}: SearchProps) {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      onSearch?.(value);
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-10 items-center",
        className
      )}
    >
      <SearchIcon
        size={16}
        className="pointer-events-none absolute left-3 text-[var(--muted)]"
      />

      <input
        type="search"
        value={value}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "h-full w-full rounded-xl",
          "border border-[var(--border)]",
          "bg-[var(--card)]",
          "pl-9 pr-20",
          "text-sm text-[var(--foreground)]",
          "outline-none",
          "placeholder:text-[var(--muted)]",
          "transition-all duration-200",
          "focus:border-[var(--foreground)]/20",
          "focus:ring-2 focus:ring-[var(--foreground)]/5"
        )}
      />

      <div className="pointer-events-none absolute right-2.5 hidden items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--accent)] px-1.5 py-1 text-[9px] text-[var(--muted)] sm:flex">
        <Command size={10} />
        <span>K</span>
      </div>
    </div>
  );
}