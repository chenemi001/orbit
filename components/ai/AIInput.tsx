"use client";

import {
  KeyboardEvent,
  useState,
} from "react";
import {
  ArrowUp,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

interface AIInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
}

export function AIInput({
  onSend,
  loading = false,
}: AIInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const message = value.trim();

    if (!message || loading) return;

    onSend(message);
    setValue("");
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-[var(--border)] p-3">
      <div
        className={cn(
          "rounded-xl border border-[var(--border)]",
          "bg-[var(--background)]",
          "transition-all duration-200",
          "focus-within:border-[var(--foreground)]/20",
          "focus-within:ring-2 focus-within:ring-[var(--foreground)]/5"
        )}
      >
        <textarea
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={2}
          placeholder="Ask Orbit anything..."
          className={cn(
            "block w-full resize-none bg-transparent",
            "px-3.5 pt-3 text-sm",
            "text-[var(--foreground)]",
            "placeholder:text-[var(--muted)]",
            "outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />

        <div className="flex items-center justify-between px-2.5 pb-2.5 pt-1">
          <button
            type="button"
            aria-label="Attach file"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
          >
            <Paperclip size={16} />
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={!value.trim() || loading}
            aria-label="Send message"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              "bg-[var(--foreground)] text-[var(--background)]",
              "transition-all duration-200",
              "hover:opacity-90",
              "disabled:pointer-events-none disabled:opacity-30"
            )}
          >
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <ArrowUp size={16} />
            )}
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-[var(--muted)]">
        Orbit AI can make mistakes. Review important information.
      </p>
    </div>
  );
}