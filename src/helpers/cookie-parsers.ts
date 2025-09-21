export function parseIdsFromCookie(cookie: string | undefined): { id: number }[] {
  try {
    return JSON.parse(cookie ?? "[]")
      .filter((el: string) => Number(el))
      .map((el: string) => ({ id: Number(el) }));
  } catch {
    return [];
  }
}

export function parseBoolean(value: string | undefined): boolean {
  return value === "true";
}

export function parseEnum<T extends string>(value: string | undefined, allowed: T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function parseNumber(value: string | undefined): number | null {
  const num = Number(value);
  return isNaN(num) ? null : num;
}
