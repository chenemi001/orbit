"use client";

import { create } from "zustand";

export type TaskView = "board" | "table";

interface TaskStore {
  view: TaskView;
  search: string;
  status: string;
  priority: string;

  setView: (view: TaskView) => void;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setPriority: (priority: string) => void;

  resetFilters: () => void;
}

export const useTaskStore = create<TaskStore>(
  (set) => ({
    view: "board",
    search: "",
    status: "all",
    priority: "all",

    setView: (view) =>
      set({ view }),

    setSearch: (search) =>
      set({ search }),

    setStatus: (status) =>
      set({ status }),

    setPriority: (priority) =>
      set({ priority }),

    resetFilters: () =>
      set({
        search: "",
        status: "all",
        priority: "all",
      }),
  })
);