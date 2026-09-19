"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { AIEmptyState } from "./AIEmptyState";
import { AIHeader } from "./AIHeader";
import { AIInput } from "./AIInput";
import { AIMessage } from "./AIMessage";
import { AISuggestions } from "./AISuggestions";
import { AILoading } from "./AILoading";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  conversationId: string | null;
  onConversationCreated: (id: string) => void;
}

export function AIChat({
  conversationId,
  onConversationCreated,
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // The parent remounts this component with a fresh `key` whenever the
    // conversation changes, so a null id here just means a brand-new chat
    // with no history to fetch.
    if (!conversationId) return;

    let cancelled = false;

    fetch(`/api/ai/conversations/${conversationId}/messages`)
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!cancelled && body?.data) {
          setMessages(
            body.data.map((message: Message) => ({
              id: message.id,
              role: message.role,
              content: message.content,
            })),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  async function handleSend(content: string) {
    if (!content.trim() || loading) return;

    setError("");
    setNotConfigured(false);
    setLoading(true);

    const optimisticUser: Message = {
      id: `pending-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((current) => [...current, optimisticUser]);

    try {
      let activeConversationId = conversationId;

      if (!activeConversationId) {
        const createResponse = await fetch("/api/ai/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!createResponse.ok) throw new Error("Failed to start conversation");

        const createBody = await createResponse.json();
        activeConversationId = createBody.data.id;
        onConversationCreated(activeConversationId as string);
      }

      const response = await fetch(
        `/api/ai/conversations/${activeConversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        },
      );

      const body = await response.json();

      if (!response.ok) {
        if (body?.error?.code === "SERVICE_UNAVAILABLE") {
          setNotConfigured(true);
        } else {
          setError(body?.error?.message ?? "Something went wrong.");
        }
        return;
      }

      setMessages((current) => [
        ...current.filter((m) => m.id !== optimisticUser.id),
        {
          id: body.data.userMessage.id,
          role: "user",
          content: body.data.userMessage.content,
        },
        {
          id: body.data.assistantMessage.id,
          role: "assistant",
          content: body.data.assistantMessage.content,
        },
      ]);
    } catch {
      setError("Unable to reach Orbit AI. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      <AIHeader />

      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="flex h-full flex-col justify-center px-5">
            <AIEmptyState />
            <AISuggestions onSelect={handleSend} />
          </div>
        ) : (
          <div className="space-y-5 p-4">
            {messages.map((message) => (
              <AIMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}

            {loading && <AILoading />}

            {notConfigured && (
              <div className="flex items-start gap-2 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 p-3 text-xs leading-5 text-[var(--warning)]">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>
                  Orbit AI isn&apos;t configured yet. An administrator needs
                  to add an <code>OPENAI_API_KEY</code> to enable responses.
                  Your message was saved.
                </span>
              </div>
            )}

            {error && (
              <p className="text-xs text-[var(--danger)]" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      <AIInput onSend={handleSend} loading={loading} />
    </div>
  );
}
