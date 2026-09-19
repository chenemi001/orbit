"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "orbit-modal-title" : undefined}
    >
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px]"
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-2xl",
          "border border-[var(--border)] bg-[var(--card)]",
          "shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
            <div className="min-w-0">
              {title && (
                <h2
                  id="orbit-modal-title"
                  className="text-base font-semibold tracking-tight text-[var(--foreground)]"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                "text-[var(--muted)]",
                "transition-colors duration-200",
                "hover:bg-[var(--accent)] hover:text-[var(--foreground)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]"
              )}
            >
              <X size={17} strokeWidth={1.8} />
            </button>
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}