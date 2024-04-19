import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";

export function getQueryValue(searchText: string, template: string, defaultValue: string) {
  if (!isNullOrWhitespace(searchText)) {
    return template.replaceAll(`{0}`, searchText);
  } else {
    return defaultValue;
  }
}
