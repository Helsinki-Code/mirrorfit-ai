export function buildStoragePath(parts: Array<string | number>) {
  return parts
    .map((part) => String(part).trim().replace(/\s+/g, "_"))
    .join("/")
    .replace(/\/{2,}/g, "/");
}
