export function cn(
  ...classes: Array<
    string | false | null | undefined
  >
): string {
  return classes
    .filter(Boolean)
    .join(" ");
}

export function sleep(
  milliseconds: number
): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds)
  );
}

export function isBrowser(): boolean {
  return (
    typeof window !== "undefined"
  );
}

export function isServer(): boolean {
  return !isBrowser();
}

export function generateId(
  prefix = ""
): string {
  const id = crypto.randomUUID();

  return prefix ? `${prefix}_${id}` : id;
}

export function isEmpty(
  value: unknown
): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function omit<
  T extends Record<string, unknown>,
  K extends keyof T
>(
  object: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...object };

  keys.forEach((key) => {
    delete result[key];
  });

  return result as Omit<T, K>;
}

export function pick<
  T extends Record<string, unknown>,
  K extends keyof T
>(
  object: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  keys.forEach((key) => {
    result[key] = object[key];
  });

  return result;
}

export function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(
    Math.max(value, min),
    max
  );
}

export function sleepAndReturn<T>(
  value: T,
  milliseconds: number
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), milliseconds);
  });
}