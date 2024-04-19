export function parseStringToEnum<T extends object>(enumType: T, value: string): T[keyof T] | undefined {
  if (value in enumType) {
    return enumType[value as keyof T];
  }

  const numericValue = parseInt(value, 10);
  if (!isNaN(numericValue) && Object.values(enumType).includes(numericValue as any)) {
    return numericValue as T[keyof T];
  }

  return undefined;
}
