import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { unauthorized } from "@/lib/api/errors";

import { getSessionUserId } from "./session";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: string;
}

export async function getCurrentUser(): Promise<
  AuthUser | null
> {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = result[0];

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.avatarUrl ?? undefined,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw unauthorized();
  }

  return user;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return Boolean(user);
}