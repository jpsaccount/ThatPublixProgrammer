import { injectable } from "inversify";
import moment from "moment/moment";
import { dateReviver } from "../utils/dateUtils";

@injectable()
export class LocalStorageService {
  constructor() {}

  setItem<T>(key: string, value: T): void {
    if (typeof localStorage === "undefined") {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    if (typeof localStorage === "undefined") {
      return null;
    }
    const storedValue = localStorage.getItem(key);
    try {
      return storedValue ? JSON.parse(storedValue, dateReviver) : null;
    } catch (e) {
      localStorage.removeItem(key);
      return null;
    }
  }

  removeItem(key: string): void {
    if (typeof localStorage === "undefined") {
      return;
    }
    localStorage.removeItem(key);
  }
}
