import { isUsable } from "./usabilityUtils";

export function toDecimalString(num: number, decimalPlaces?: number | undefined): string {
  if (isUsable(num) === false) return "";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}
