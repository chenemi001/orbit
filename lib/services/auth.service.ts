import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { User } from "@/lib/db/types";

const scrypt = promisify(scryptCallback);

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export async function createPasswordHash(
  password: string,
): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString("hex");

  const derivedKey = (await scrypt(
    password,
    salt,
    KEY_LENGTH,
  )) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  try {
    const derivedKey = (await scrypt(
      password,
      salt,
      KEY_LENGTH,
    )) as Buffer;

    const storedKey = Buffer.from(key, "hex");

    if (derivedKey.length !== storedKey.length) {
      return false;
    }

    return timingSafeEqual(derivedKey, storedKey);
  } catch {
    return false;
  }
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<User | null> {
  const normalizedEmail = email.toLowerCase().trim();

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  const user = result[0];

  if (!user) {
    return null;
  }

  const validPassword = await verifyPassword(
    password,
    user.passwordHash,
  );

  if (!validPassword) {
    return null;
  }

  return user;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser[0]) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const passwordHash = await createPasswordHash(password);

  const result = await db
    .insert(users)
    .values({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    })
    .returning();

  const user = result[0];

  if (!user) {
    throw new Error("USER_CREATION_FAILED");
  }

  return user;
}