"use client";

import { create } from "zustand";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface WorkspaceStore {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];

  setCurrentWorkspace: (
    workspace: Workspace
  ) => void;

  setWorkspaces: (
    workspaces: Workspace[]
  ) => void;

  addWorkspace: (
    workspace: Workspace
  ) => void;

  removeWorkspace: (
    workspaceId: string
  ) => void;
}

export const useWorkspaceStore =
  create<WorkspaceStore>((set) => ({
    currentWorkspace: {
      id: "orbit",
      name: "Orbit",
      slug: "orbit",
    },

    workspaces: [
      {
        id: "orbit",
        name: "Orbit",
        slug: "orbit",
      },
    ],

    setCurrentWorkspace: (workspace) =>
      set({
        currentWorkspace: workspace,
      }),

    setWorkspaces: (workspaces) =>
      set({
        workspaces,
      }),

    addWorkspace: (workspace) =>
      set((state) => ({
        workspaces: [
          ...state.workspaces,
          workspace,
        ],
      })),

    removeWorkspace: (workspaceId) =>
      set((state) => {
        const workspaces =
          state.workspaces.filter(
            (workspace) =>
              workspace.id !== workspaceId
          );

        const currentWorkspace =
          state.currentWorkspace?.id ===
          workspaceId
            ? workspaces[0] ?? null
            : state.currentWorkspace;

        return {
          workspaces,
          currentWorkspace,
        };
      }),
  }));