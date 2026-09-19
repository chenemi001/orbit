import { useEffect } from "react";

interface KeyboardShortcutOptions {
  key: string;
  callback: (event: KeyboardEvent) => void;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  enabled?: boolean;
}

export function useKeyboardShortcut({
  key,
  callback,
  ctrl = false,
  meta = false,
  shift = false,
  alt = false,
  enabled = true,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatches =
        event.key.toLowerCase() === key.toLowerCase();

      if (!keyMatches) return;

      if (event.ctrlKey !== ctrl) return;
      if (event.metaKey !== meta) return;
      if (event.shiftKey !== shift) return;
      if (event.altKey !== alt) return;

      event.preventDefault();
      callback(event);
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    key,
    callback,
    ctrl,
    meta,
    shift,
    alt,
    enabled,
  ]);
}