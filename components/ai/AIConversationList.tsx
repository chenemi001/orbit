"use client";

import { MessageSquarePlus, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/formatters";

export interface ConversationSummary {
  id: string;
  title: string | null;
  updatedAt: string | Date;
}

interface AIConversationListProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function AIConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: AIConversationListProps) {
  return (
    <div className="flex h-full flex-col border-r border-[var(--border)]">
      <div className="border-b border-[var(--border)] p-3">
        <button
          type="button"
          onClick={onNew}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90"
        >
          <MessageSquarePlus size={16} />
          New conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <Sparkles size={18} className="text-[var(--muted)]" />
            <p className="mt-3 text-xs text-[var(--muted)]">
              No conversations yet
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group flex items-center gap-1 rounded-lg pr-1",
                  activeId === conversation.id
                    ? "bg-[var(--accent)]"
                    : "hover:bg-[var(--accent)]/60",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  className="min-w-0 flex-1 px-3 py-2.5 text-left"
                >
                  <p className="truncate text-xs font-medium">
                    {conversation.title || "New conversation"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--muted)]">
                    {formatRelativeTime(conversation.updatedAt)}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(conversation.id)}
                  aria-label="Delete conversation"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted)] opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
