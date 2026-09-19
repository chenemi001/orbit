import { NextResponse } from "next/server";

import { registerSchema } from "@/lib/validation/auth";
import { registerUser } from "@/lib/services/auth.service";
import { createSession } from "@/lib/auth/session";
import {
  checkRateLimit,
  getClientIp,
} from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(
      `register:${getClientIp(request)}`,
      5,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many attempts. Please try again shortly.",
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

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please check your information.",
          fields: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;

    const user = await registerUser(
      name,
      email,
      password,
    );

    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USER_ALREADY_EXISTS"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email already exists.",
        },
        { status: 409 },
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while creating your account.",
      },
      { status: 500 },
    );
  }
}