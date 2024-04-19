export function isUsable(value: any): value is {} {
  return value !== undefined && value !== null;
}
