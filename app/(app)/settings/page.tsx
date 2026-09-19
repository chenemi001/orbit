import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/PageHeader";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ChangePasswordForm } from "@/components/shared/ChangePasswordForm";
import { Avatar } from "@/components/ui/Avatar";
import { formatInitials } from "@/utils/formatters";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, appearance, and security."
      />

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-semibold">Account</h2>

        <div className="mt-4 flex items-center gap-3">
          <Avatar
            src={user.image ?? undefined}
            fallback={formatInitials(user.name)}
            size="lg"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-[var(--muted)]">
              {user.email}
            </p>
          </div>

          <Link
            href="/profile"
            className="shrink-0 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--accent)]"
          >
            Edit profile
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-semibold">Appearance</h2>

        <p className="mt-1 text-xs text-[var(--muted)]">
          Choose how Orbit looks on this device.
        </p>

        <div className="mt-4">
          <ThemeToggle />
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-semibold">Security</h2>

        <p className="mt-1 text-xs text-[var(--muted)]">
          Update your password. You&apos;ll stay signed in on this device.
        </p>

        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}
