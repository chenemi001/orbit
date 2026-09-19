"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const mounted = useMounted();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (!mounted) return;

    Promise.resolve().then(() => {
      try {
        const stored = localStorage.getItem("orbit-theme") as Theme | null;
        const initial =
          stored ??
          (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light");

        setTheme(initial);
        applyTheme(initial);
      } catch {
        // localStorage may be unavailable; fall back to light.
      }
    });
  }, [mounted]);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);

    try {
      localStorage.setItem("orbit-theme", next);
    } catch {
      // ignore write failures (private browsing, etc.)
    }
  }

  if (!mounted) {
    return <div className="h-10 w-full max-w-[220px] rounded-lg bg-[var(--accent)]" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm font-medium transition-colors hover:bg-[var(--accent)]"
    >
      {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
      {theme === "dark" ? "Dark mode" : "Light mode"}
    </button>
  );
}
