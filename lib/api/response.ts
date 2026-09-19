import { NextResponse } from "next/server";
import { ApiError } from "./errors";

export function success<T>(
  data: T,
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function created<T>(data: T) {
  return success(data, 201);
}

export function noContent() {
  return new NextResponse(null, {
    status: 204,
  });
}

export function errorResponse(
  error: unknown
) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      {
        status: error.status,
      }
    );
  }

  console.error(error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong",
      },
    },
    {
      status: 500,
    }
  );
}