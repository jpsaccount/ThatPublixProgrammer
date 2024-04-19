export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  let index = 0;
  let arrayLength = array.length;
  let tempArray = [];

  for (index = 0; index < arrayLength; index += chunkSize) {
    let chunk = array.slice(index, index + chunkSize);
    tempArray.push(chunk);
  }

  return tempArray;
}

export function convertArrayToObject<T extends { [key in K]: string }, K extends keyof T>(
  array: T[],
  key: K,
): Record<string, T> {
  return array?.reduce(
    (obj, item) => {
      obj[item[key]] = item;
      return obj;
    },
    {} as Record<string, T>,
  );
}

export function range(size: number, startAt: number = 0): ReadonlyArray<number> {
  return [...Array(size).keys()].map((i, index) => index + startAt);
}
