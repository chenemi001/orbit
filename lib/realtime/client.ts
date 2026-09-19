"use client";

import {
  RealtimeEvent,
  RealtimePayload,
} from "./events";

type EventHandler<T = unknown> = (
  payload: RealtimePayload<T>
) => void;

class RealtimeClient {
  private listeners = new Map<
    RealtimeEvent,
    Set<EventHandler>
  >();

  subscribe<T>(
    event: RealtimeEvent,
    handler: EventHandler<T>
  ) {
    if (!this.listeners.has(event)) {
      this.listeners.set(
        event,
        new Set()
      );
    }

    this.listeners
      .get(event)!
      .add(handler as EventHandler);

    return () => {
      this.listeners
        .get(event)
        ?.delete(handler as EventHandler);
    };
  }

  emit<T>(
    event: RealtimeEvent,
    data: T
  ) {
    const payload: RealtimePayload<T> = {
      event,
      data,
      timestamp:
        new Date().toISOString(),
    };

    this.listeners
      .get(event)
      ?.forEach((handler) =>
        handler(payload)
      );
  }

  clear() {
    this.listeners.clear();
  }
}

export const realtimeClient =
  new RealtimeClient();