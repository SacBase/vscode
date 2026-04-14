// Escapes user-provided text for safe insertion into RegExp sources.
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
