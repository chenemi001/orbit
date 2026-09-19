"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Dropdown({
  items,
  value,
  placeholder = "Select option",
  onChange,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = items.find((item) => item.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2",
          "rounded-[var(--radius)] border border-[var(--border)]",
          "bg-[var(--card)] px-3 text-sm",
          "text-[var(--foreground)]",
          "transition-all duration-200",
          "hover:bg-[var(--accent)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--foreground)]/10"
        )}
      >
        <span className={!selected ? "text-[var(--muted)]" : ""}>
          {selected?.label ?? placeholder}
        </span>

        <ChevronDown
          size={16}
          className={cn(
            "text-[var(--muted)] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+6px)] z-40",
            "overflow-hidden rounded-xl",
            "border border-[var(--border)]",
            "bg-[var(--card)] p-1",
            "shadow-lg shadow-black/5"
          )}
        >
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;

                onChange?.(item.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2",
                "text-left text-sm",
                "text-[var(--foreground)]",
                "transition-colors duration-150",
                "hover:bg-[var(--accent)]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                item.value === value &&
                  "bg-[var(--accent)] font-medium"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}