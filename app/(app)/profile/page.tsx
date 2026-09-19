import { CalendarDays } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getUserById } from "@/lib/services/user.service";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileForm } from "@/components/shared/ProfileForm";
import { formatDate } from "@/utils/formatters";

export default async function ProfilePage() {
  const authUser = await requireUser();
  const user = await getUserById(authUser.id);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Profile"
        description="Manage how you appear across Orbit."
      />

      <ProfileForm
        initialName={user.name}
        email={user.email}
        initialAvatarUrl={user.avatarUrl}
      />

      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted)]">
        <CalendarDays size={13} />
        Member since {formatDate(user.createdAt)}
      </div>
    </div>
  );
}
