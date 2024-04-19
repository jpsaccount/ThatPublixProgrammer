import { isDevEnvironment } from "./devUtils";

export default function debugLog(message?: any, ...optionalParams: any[]) {
  if (isDevEnvironment()) {
    console.log(message, optionalParams);
  }
}
