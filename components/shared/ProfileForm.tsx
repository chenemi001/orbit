"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatInitials } from "@/utils/formatters";

interface ProfileFormProps {
  initialName: string;
  email: string;
  initialAvatarUrl: string | null;
}

export function ProfileForm({
  initialName,
  email,
  initialAvatarUrl,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          avatarUrl: avatarUrl.trim() || null,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body?.error?.message ?? "Unable to update your profile.");
        return;
      }

      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
    >
      <div className="flex items-center gap-4">
        <Avatar
          src={avatarUrl || undefined}
          fallback={formatInitials(name || "?")}
          size="xl"
        />

        <div className="min-w-0 flex-1">
          <label className="mb-1.5 block text-xs font-medium">
            Avatar URL
          </label>

          <input
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none placeholder:text-[var(--muted)]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium">Name</label>

        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium">Email</label>

        <input
          value={email}
          disabled
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--accent)]/40 px-3 text-sm text-[var(--muted)] outline-none"
        />

        <p className="mt-1.5 text-[11px] text-[var(--muted)]">
          Email changes aren&apos;t supported yet.
        </p>
      </div>

      {error && (
        <p className="text-xs text-[var(--danger)]" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>

        {saved && (
          <span className="text-xs text-[var(--success)]">
            Profile updated
          </span>
        )}
      </div>
    </form>
  );
}
