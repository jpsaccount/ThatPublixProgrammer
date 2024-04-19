import { isUsable } from "./usabilityUtils";

export function toUsdString(value: number): string {
  if (isUsable(value) === false) return "";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(value);
}
