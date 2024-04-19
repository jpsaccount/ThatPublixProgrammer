export function withUpdate<T>(item: T, updates: Partial<T>) {
  return { ...item, ...updates };
}
