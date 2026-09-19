"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIChat } from "./AIChat";

interface AIAssistantProps {
  className?: string;
}

export function AIAssistant({
  className,
}: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-40",
        className
      )}
    >
      {open ? (
        <div className="w-[calc(100vw-2rem)] max-w-[420px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/10">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)]">
                <Sparkles size={15} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Orbit AI
                </p>

                <p className="text-[11px] text-[var(--muted)]">
                  Your intelligent workspace assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AI assistant"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <X size={17} />
            </button>
          </div>

          <div className="h-[500px]">
            <AIChat
              conversationId={conversationId}
              onConversationCreated={setConversationId}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Orbit AI"
          className={cn(
            "group flex h-12 items-center gap-2.5 rounded-full",
            "bg-[var(--foreground)] px-4",
            "text-sm font-medium text-[var(--background)]",
            "shadow-xl shadow-black/10",
            "transition-all duration-200",
            "hover:-translate-y-0.5 hover:shadow-2xl",
            "active:scale-[0.98]"
          )}
        >
          <Sparkles
            size={17}
            className="transition-transform duration-300 group-hover:rotate-12"
          />

          <span>Ask Orbit AI</span>
        </button>
      )}
    </div>
  );
}