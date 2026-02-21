export function resolveImageUrl(src, fallback = "") {
  if (!src) return fallback;

  const raw = String(src).trim();
  if (!raw) return fallback;

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  ) {
    return raw;
  }

  const clean = raw.replace(/^\/+/, "");
  return `/${clean}`;
}
