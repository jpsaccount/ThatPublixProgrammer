import { dateReviver } from "@/sdk/utils/dateUtils";

export function convertDateStringsToDate(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      convertDateStringsToDate(obj[key]);
    } else {
      obj[key] = dateReviver(key, obj[key]);
    }
  }
}
