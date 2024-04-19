export function isNullOrWhitespace(value: string): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (value.trim().length === 0) {
    return true;
  }

  return false;
}

export function sanitizeInput(value: string): string {
  return value.replace(/"/g, '""').replace(/'/g, "''");
}
