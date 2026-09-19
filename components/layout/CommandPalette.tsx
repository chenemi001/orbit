"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const commands = [
  {
    label: "Go to Dashboard",
    shortcut: "G D",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "View Tasks",
    shortcut: "G T",
    icon: CheckSquare,
    href: "/tasks",
  },
  {
    label: "View Projects",
    shortcut: "G P",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    label: "Open AI Assistant",
    shortcut: "G A",
    icon: Sparkles,
    href: "/ai",
  },
  {
    label: "Open Settings",
    shortcut: "G S",
    icon: Settings,
    href: "/settings",
  },
];

interface SearchResult {
  id: string;
  type: "task" | "project" | "user";
  title: string;
  subtitle?: string;
  href: string;
}

export function CommandPalette({
  open,
  onClose,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 250);

  const handleClose = () => {
    setQuery("");
    setResults([]);
    onClose();
  };

  const goTo = (href: string) => {
    handleClose();
    router.push(href);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !debouncedQuery.trim()) {
      return;
    }

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (!cancelled) setSearching(true);
      })
      .then(() =>
        fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`),
      )
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.data) {
          setResults(data.data as SearchResult[]);
        }
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open]);

  if (!open) return null;

  const isSearchMode = query.trim().length > 0;

  const filteredCommands = commands.filter((command) =>
    command.label
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className={cn(
          "relative z-10 w-full max-w-xl overflow-hidden",
          "rounded-2xl border border-[var(--border)]",
          "bg-[var(--card)]",
          "shadow-2xl shadow-black/10"
        )}
      >
        {/* Search */}
        <div className="flex h-14 items-center gap-3 border-b border-[var(--border)] px-4">
          <Search
            size={18}
            className="shrink-0 text-[var(--muted)]"
          />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search tasks, projects, people, or run a command..."
            className={cn(
              "h-full min-w-0 flex-1 bg-transparent",
              "text-sm text-[var(--foreground)]",
              "placeholder:text-[var(--muted)]",
              "outline-none"
            )}
          />

          <kbd className="hidden rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[10px] text-[var(--muted)] sm:block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {isSearchMode ? (
            searching ? (
              <div className="flex min-h-40 flex-col items-center justify-center text-center">
                <p className="text-sm text-[var(--muted)]">
                  Searching...
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-0.5">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    type="button"
                    onClick={() => goTo(result.href)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-3",
                      "text-left transition-colors duration-150",
                      "hover:bg-[var(--accent)]"
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--muted)] group-hover:text-[var(--foreground)]">
                      {result.type === "task" && <CheckSquare size={16} />}
                      {result.type === "project" && <FolderKanban size={16} />}
                      {result.type === "user" && <Sparkles size={16} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="truncate text-xs text-[var(--muted)]">
                          {result.subtitle}
                        </p>
                      )}
                    </div>

                    <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center text-center">
                <Search
                  size={20}
                  className="mb-3 text-[var(--muted)]"
                />

                <p className="text-sm font-medium">
                  No results found
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Try searching for something else.
                </p>
              </div>
            )
          ) : (
            <div className="space-y-0.5">
              {filteredCommands.map((command) => {
                const Icon = command.icon;

                return (
                  <button
                    key={command.label}
                    type="button"
                    onClick={() => goTo(command.href)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-3",
                      "text-left transition-colors duration-150",
                      "hover:bg-[var(--accent)]"
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--muted)] group-hover:text-[var(--foreground)]">
                      <Icon size={16} />
                    </div>

                    <span className="flex-1 text-sm font-medium text-[var(--foreground)]">
                      {command.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <kbd className="hidden text-[10px] text-[var(--muted)] sm:block">
                        {command.shortcut}
                      </kbd>

                      <ArrowRight
                        size={15}
                        className="text-[var(--muted)] opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-[10px] text-[var(--muted)]">
          <span>Navigate with your keyboard</span>

          <span className="hidden sm:block">
            Press ESC to close
          </span>
        </div>
      </div>
    </div>
  );
}