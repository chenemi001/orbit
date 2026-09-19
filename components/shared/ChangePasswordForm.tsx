"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body?.error?.message ?? "Unable to update your password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium">
          Current password
        </label>

        <input
          type="password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium">
          New password
        </label>

        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium">
          Confirm new password
        </label>

        <input
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none"
        />
      </div>

      {error && (
        <p className="text-xs text-[var(--danger)]" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="text-xs text-[var(--success)]">
          Password updated successfully.
        </p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}
