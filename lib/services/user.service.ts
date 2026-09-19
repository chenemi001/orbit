import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { NewUser, User } from "@/lib/db/types";

export async function getUserById(
  userId: string,
): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getUserByEmail(
  email: string,
): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0];
}

export async function createUser(
  data: NewUser,
): Promise<User> {
  const result = await db
    .insert(users)
    .values(data)
    .returning();

  return result[0];
}

export async function updateUser(
  userId: string,
  data: Partial<NewUser>,
): Promise<User | undefined> {
  const result = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return result[0];
}

export async function deleteUser(
  userId: string,
): Promise<User | undefined> {
  const result = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning();

  return result[0];
}