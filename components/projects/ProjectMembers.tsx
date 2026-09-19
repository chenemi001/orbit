"use client";

import { FormEvent, useState } from "react";
import { UserMinus, UserPlus, Users, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatInitials } from "@/utils/formatters";

export interface ProjectMemberRow {
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

interface ProjectMembersProps {
  projectId: string;
  ownerId: string;
  members: ProjectMemberRow[];
  canManage: boolean;
  onChanged: () => void;
}

export function ProjectMembers({
  projectId,
  ownerId,
  members,
  canManage,
  onChanged,
}: ProjectMembersProps) {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body?.error?.message ?? "Unable to add this member.");
        return;
      }

      setEmail("");
      setRole("member");
      setShowForm(false);
      onChanged();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(userId: string) {
    if (!confirm("Remove this member from the project?")) return;

    await fetch(`/api/projects/${projectId}/members/${userId}`, {
      method: "DELETE",
    });

    onChanged();
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">Project members</h2>

          <p className="mt-1 text-xs text-[var(--muted)]">
            {members.length}{" "}
            {members.length === 1 ? "person" : "people"} working on this
            project
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            aria-label="Add project member"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
          >
            {showForm ? <X size={16} /> : <UserPlus size={16} />}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-2 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center"
        >
          <input
            type="email"
            required
            placeholder="teammate@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 text-xs outline-none placeholder:text-[var(--muted)]"
          />

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 text-xs outline-none"
          >
            <option value="viewer">Viewer</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="h-9 rounded-lg bg-[var(--foreground)] px-3 text-xs font-medium text-[var(--background)] disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </form>
      )}

      {error && (
        <p className="border-b border-[var(--border)] px-5 py-2 text-xs text-[var(--danger)]">
          {error}
        </p>
      )}

      <div className="divide-y divide-[var(--border)]">
        {members.map((member) => (
          <div
            key={member.userId}
            className="flex items-center gap-3 px-5 py-3.5"
          >
            <Avatar
              src={member.user.avatarUrl ?? undefined}
              fallback={formatInitials(member.user.name)}
              size="sm"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {member.user.name}
              </p>

              <p className="truncate text-xs text-[var(--muted)]">
                {member.user.email}
              </p>
            </div>

            <span className="rounded-full bg-[var(--accent)] px-2 py-1 text-[10px] font-semibold capitalize text-[var(--muted)]">
              {member.role}
            </span>

            {canManage && member.userId !== ownerId && (
              <button
                type="button"
                onClick={() => handleRemove(member.userId)}
                aria-label={`Remove ${member.user.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <UserMinus size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="flex flex-col items-center px-5 py-10 text-center">
          <Users size={20} className="text-[var(--muted)]" />

          <p className="mt-3 text-sm font-medium">No members yet</p>
        </div>
      )}
    </section>
  );
}
