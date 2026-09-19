"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ProjectCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function ProjectCreateModal({
  open,
  onClose,
  onCreated,
}: ProjectCreateModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Project name must be at least 2 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        setError(body?.error?.message ?? "Unable to create project.");
        return;
      }

      setName("");
      setDescription("");
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New project"
      description="Give your project a name to get started."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="project-name" className="mb-1.5 block text-xs font-medium">
            Project name
          </label>

          <input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Website redesign"
            autoFocus
            required
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--foreground)]/20 focus:ring-2 focus:ring-[var(--foreground)]/5"
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="mb-1.5 block text-xs font-medium"
          >
            Description
          </label>

          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="What is this project about?"
            className="w-full resize-none rounded-lg border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--foreground)]/20 focus:ring-2 focus:ring-[var(--foreground)]/5"
          />
        </div>

        {error && (
          <p className="text-xs text-[var(--danger)]" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-[var(--border)] px-4 text-xs font-medium transition-colors hover:bg-[var(--accent)]"
          >
            Cancel
          </button>

          <Button type="submit" disabled={submitting} className="h-9">
            {submitting ? "Creating..." : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
