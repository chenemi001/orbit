import type { ZodType } from "zod";

import { validationError } from "./errors";

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw validationError("Request body must be valid JSON");
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    throw validationError(
      "Validation failed",
      result.error.flatten().fieldErrors,
    );
  }

  return result.data;
}
