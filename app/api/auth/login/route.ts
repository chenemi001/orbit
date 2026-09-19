import { NextResponse } from "next/server";

import { authenticateUser } from "@/lib/services/auth.service";
import { createSession } from "@/lib/auth/session";
import {
  checkRateLimit,
  getClientIp,
} from "@/lib/auth/rate-limit";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(
      `login:${getClientIp(request)}`,
      10,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again shortly.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const body = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email and password.",
          fields: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

    const user = await authenticateUser(
      email,
      password,
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while logging you in.",
      },
      { status: 500 },
    );
  }
}