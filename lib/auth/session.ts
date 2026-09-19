import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "orbit_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

interface SessionPayload {
  sub: string;
  iat: number;
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is not set"
    );
  }

  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function encodeSessionToken(userId: string) {
  const payload: SessionPayload = {
    sub: userId,
    iat: Date.now(),
  };

  const encodedPayload = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64url");

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

function decodeSessionToken(
  token: string
): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString(
        "utf8"
      )
    );

    if (
      typeof payload.sub !== "string" ||
      typeof payload.iat !== "number"
    ) {
      return null;
    }

    const age = Date.now() - payload.iat;

    if (age < 0 || age > SESSION_MAX_AGE * 1000) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionToken() {
  const cookieStore = await cookies();

  return cookieStore.get(
    SESSION_COOKIE
  )?.value;
}

export async function setSessionToken(
  token: string,
  maxAge = SESSION_MAX_AGE
) {
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    }
  );
}

/**
 * Creates a signed session token for the given user
 * and persists it as an HTTP-only cookie.
 */
export async function createSession(
  userId: string,
  maxAge = SESSION_MAX_AGE
) {
  const token = encodeSessionToken(userId);

  await setSessionToken(token, maxAge);

  return token;
}

/**
 * Reads the session cookie and returns the
 * authenticated user id, or null if there is
 * no valid session.
 */
export async function getSessionUserId(): Promise<
  string | null
> {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  const payload = decodeSessionToken(token);

  return payload?.sub ?? null;
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}