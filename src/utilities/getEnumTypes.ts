export const getEnumValues = <T>(enumObject: T): Array<T[keyof T]> => {
  const values = Object.values(enumObject);
  return values.filter((value) => typeof value !== "number") as Array<T[keyof T]>;
};
