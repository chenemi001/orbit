"use client";

import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  commandMenuOpen: boolean;
  notificationsOpen: boolean;

  setSidebarOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setCommandMenuOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;

  toggleSidebar: () => void;
  toggleCommandMenu: () => void;
  toggleNotifications: () => void;

  closeOverlays: () => void;
}

export const useUIStore = create<UIStore>(
  (set) => ({
    sidebarOpen: true,
    mobileSidebarOpen: false,
    commandMenuOpen: false,
    notificationsOpen: false,

    setSidebarOpen: (open) =>
      set({ sidebarOpen: open }),

    setMobileSidebarOpen: (open) =>
      set({
        mobileSidebarOpen: open,
      }),

    setCommandMenuOpen: (open) =>
      set({
        commandMenuOpen: open,
      }),

    setNotificationsOpen: (open) =>
      set({
        notificationsOpen: open,
      }),

    toggleSidebar: () =>
      set((state) => ({
        sidebarOpen: !state.sidebarOpen,
      })),

    toggleCommandMenu: () =>
      set((state) => ({
        commandMenuOpen:
          !state.commandMenuOpen,
        notificationsOpen: false,
      })),

    toggleNotifications: () =>
      set((state) => ({
        notificationsOpen:
          !state.notificationsOpen,
        commandMenuOpen: false,
      })),

    closeOverlays: () =>
      set({
        mobileSidebarOpen: false,
        commandMenuOpen: false,
        notificationsOpen: false,
      }),
  })
);