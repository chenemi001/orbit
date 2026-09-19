import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/services/notification.service";
import { AppShellClient } from "@/components/layout/AppShellClient";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const unreadCount = await getUnreadNotificationCount(user.id);

  return (
    <AppShellClient
      user={{
        name: user.name,
        email: user.email,
        avatarUrl: user.image,
      }}
      unreadCount={unreadCount}
    >
      {children}
    </AppShellClient>
  );
}
