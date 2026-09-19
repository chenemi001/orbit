"use client";

import { useCallback, useEffect, useState } from "react";

import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { AIChat } from "@/components/ai/AIChat";
import {
  AIConversationList,
  type ConversationSummary,
} from "@/components/ai/AIConversationList";

export default function AIPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>(
    [],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/ai/conversations");
      if (!response.ok) throw new Error("Failed to load conversations");

      const body = await response.json();
      const list: ConversationSummary[] = body.data ?? [];

      setConversations(list);
      setActiveId((current) => current ?? list[0]?.id ?? null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  async function handleDelete(id: string) {
    await fetch(`/api/ai/conversations/${id}`, { method: "DELETE" });

    setConversations((current) => current.filter((c) => c.id !== id));

    if (activeId === id) {
      setActiveId(null);
    }
  }

  function handleConversationCreated(id: string) {
    setActiveId(id);
    load();
  }

  if (loading) {
    return <LoadingState message="Loading Orbit AI..." />;
  }

  if (error) {
    return <ErrorState onRetry={load} message="Unable to load Orbit AI." />;
  }

  return (
    <div className="mx-auto h-[calc(100vh-160px)] max-w-[1100px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="grid h-full grid-cols-1 sm:grid-cols-[240px_1fr]">
        <div className="hidden sm:block">
          <AIConversationList
            conversations={conversations}
            activeId={activeId}
            onSelect={setActiveId}
            onNew={() => setActiveId(null)}
            onDelete={handleDelete}
          />
        </div>

        <AIChat
          key={activeId ?? "new"}
          conversationId={activeId}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </div>
  );
}
