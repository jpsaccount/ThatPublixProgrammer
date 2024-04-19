import { isUsable } from "./usabilityUtils";

export function tryGetSum(itemsArray: number[], defaultValue: number = 0) {
  if (isUsable(itemsArray) === false) return defaultValue;
  if (itemsArray.length === 0) return defaultValue;
  const results = itemsArray.reduce((a, b) => a + b, defaultValue);
  if (Number.isNaN(results)) {
    return defaultValue;
  }
  return results;
}

export function sortBy<T>(items: T[], property: keyof T, isAscending: boolean = false) {
  return items?.sort((a, b) => {
    const aProp = a[property];
    const bProp = b[property];
    if (isAscending) {
      return aProp === bProp ? 0 : aProp < bProp ? 1 : -1;
    }
    return aProp === bProp ? 0 : aProp < bProp ? -1 : 1;
  });
}

export function sort<T>(items: T[], func: (item: T) => any) {
  return items.sort((a, b) => (func(a) === func(b) ? 0 : func(a) < func(b) ? -1 : 1));
}

export class GroupedItems<T> {
  items: Array<T>;
}

export function groupByMultipleCriteria<T>(items: Array<T>, criteria: Array<string>): Array<GroupedItems<T>> {
  if (isUsable(items) === false) return null;
  const grouped = {};

  items.forEach((item) => {
    // Create a unique key based on the criteria values
    const key = criteria.map((criterion) => item[criterion]).join("|");

    // Initialize the group if it doesn't exist
    if (!grouped[key]) {
      grouped[key] = [];
    }

    // Add the item to the appropriate group
    grouped[key].push(item);
  });

  // Convert the grouped object into an array of groups
  const results = Object.values(grouped).map((group) => ({ items: Array.isArray(group) ? group : [] }));
  return results;
}

export function groupBy<T>(list: T[], key: string | ((item: T) => any)): Map<any, T[]> {
  if (isUsable(list) === false) return null;
  const map = new Map<any, T[]>();
  list.forEach((item) => {
    const keyValue = typeof key === "function" ? key(item) : item[key];
    const collection = map.get(keyValue);
    if (!collection) {
      map.set(keyValue, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

type MergeFunction<T> = (original: T, update: T) => T;

export function selectByMin<T>(items: T[], action: (item: T) => unknown): T {
  return items.reduce((min, current) => {
    return action(current) < action(min) ? current : min;
  });
}

export function getAverage(arr: number[]): number {
  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  return sum / arr.length;
}

export function mapUnqiue<T>(array: T[], key: keyof T): any[] {
  if (isUsable(array) === false) return null;
  return Array.from(new Set(array.map((x) => x[key])));
}
