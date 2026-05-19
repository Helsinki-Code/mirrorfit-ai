type Primitive = string | number | boolean | null;

type FirestoreSafeValue =
  | Primitive
  | FirestoreSafeValue[]
  | { [key: string]: FirestoreSafeValue };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function sanitizeInternal(value: unknown): FirestoreSafeValue | undefined {
  if (value === undefined) return undefined;
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    const sanitized = value
      .map((item) => sanitizeInternal(item))
      .filter((item): item is FirestoreSafeValue => item !== undefined);
    return sanitized;
  }
  if (isPlainObject(value)) {
    const out: Record<string, FirestoreSafeValue> = {};
    for (const [key, nextValue] of Object.entries(value)) {
      const sanitized = sanitizeInternal(nextValue);
      if (sanitized !== undefined) out[key] = sanitized;
    }
    return out;
  }
  return value as FirestoreSafeValue;
}

export function sanitizeFirestoreData<T>(value: T): T {
  const sanitized = sanitizeInternal(value);
  if (sanitized === undefined) {
    return {} as T;
  }
  return sanitized as T;
}

export function topLevelKeys(value: Record<string, unknown>) {
  return Object.keys(value).sort();
}

