import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function AIMessage({
  role,
  content,
}: AIMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser && "justify-end"
      )}
    >
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)]">
          <Sparkles size={13} />
        </div>
      )}

      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-5",
          isUser
            ? "rounded-br-md bg-[var(--foreground)] text-[var(--background)]"
            : "rounded-bl-md bg-[var(--accent)] text-[var(--foreground)]"
        )}
      >
        {content}
      </div>
    </div>
  );
}