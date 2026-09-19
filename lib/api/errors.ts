export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ApiErrorCode = "INTERNAL_ERROR",
    status = 500,
    details?: unknown
  ) {
    super(message);

    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (
  message = "Bad request"
) =>
  new ApiError(
    message,
    "BAD_REQUEST",
    400
  );

export const unauthorized = (
  message = "Authentication required"
) =>
  new ApiError(
    message,
    "UNAUTHORIZED",
    401
  );

export const forbidden = (
  message = "You do not have permission to perform this action"
) =>
  new ApiError(
    message,
    "FORBIDDEN",
    403
  );

export const notFound = (
  message = "Resource not found"
) =>
  new ApiError(
    message,
    "NOT_FOUND",
    404
  );

export const conflict = (
  message = "Resource already exists"
) =>
  new ApiError(
    message,
    "CONFLICT",
    409
  );

export const serviceUnavailable = (
  message = "This feature is temporarily unavailable"
) =>
  new ApiError(
    message,
    "SERVICE_UNAVAILABLE",
    503
  );

export const validationError = (
  message = "Validation failed",
  details?: unknown
) =>
  new ApiError(
    message,
    "VALIDATION_ERROR",
    422,
    details
  );