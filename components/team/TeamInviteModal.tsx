"use client";

import { FormEvent, useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ProjectOption {
  id: string;
  name: string;
}

interface TeamInviteModalProps {
  open: boolean;
  onClose: () => void;
  onInvited: () => void;
}

export function TeamInviteModal({
  open,
  onClose,
  onInvited,
}: TeamInviteModalProps) {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectId, setProjectId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    fetch("/api/projects")
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        const options: ProjectOption[] = (body?.data ?? []).map(
          (project: ProjectOption) => ({
            id: project.id,
            name: project.name,
          }),
        );
        setProjects(options);
        setProjectId(options[0]?.id ?? "");
      });
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!projectId) {
      setError("Create a project first, then invite people to it.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body?.error?.message ?? "Unable to invite this person.");
        return;
      }

      setEmail("");
      onInvited();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite a teammate"
      description="They must already have an Orbit account. Add them to one of your projects to bring them into your team."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium">Project</label>

          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm outline-none"
          >
            {projects.length === 0 && <option value="">No projects yet</option>}
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium">
            Email address
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teammate@example.com"
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium">Role</label>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm outline-none"
          >
            <option value="viewer">Viewer</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
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
            {submitting ? "Inviting..." : "Add to project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
