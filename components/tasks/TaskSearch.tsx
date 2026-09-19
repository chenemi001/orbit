"use client";

import {
  KeyboardEvent,
  useState,
} from "react";
import {
  Command,
  Search as SearchIcon,
  X,
} from "lucide-react";

interface TaskSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function TaskSearch({
  value,
  onChange,
  placeholder = "Search tasks...",
}: TaskSearchProps) {
  const [internalValue, setInternalValue] =
    useState("");

  const searchValue =
    value !== undefined ? value : internalValue;

  const updateValue = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      updateValue("");
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
      />

      <input
        type="search"
        value={searchValue}
        onChange={(event) =>
          updateValue(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-20 text-xs outline-none placeholder:text-[var(--muted)] transition-all focus:border-[var(--foreground)]/20 focus:ring-2 focus:ring-[var(--foreground)]/5"
      />

      {searchValue ? (
        <button
          type="button"
          onClick={() => updateValue("")}
          className="absolute right-10 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--accent)]"
          aria-label="Clear search"
        >
          <X size={13} />
        </button>
      ) : null}

      <div className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--accent)] px-1.5 py-1 text-[9px] text-[var(--muted)] sm:flex">
        <Command size={9} />
        K
      </div>
    </div>
  );
}