"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  content,
  children,
  side = "top",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const position = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap",
            "rounded-lg bg-[var(--foreground)] px-2.5 py-1.5",
            "text-xs font-medium text-[var(--background)]",
            "shadow-lg",
            position[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}