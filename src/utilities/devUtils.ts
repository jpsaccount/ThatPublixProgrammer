import process from "process";

const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export function isDevEnvironment(): boolean {
  return development;
}
export function isDev(): boolean {
  return development && false;
}
