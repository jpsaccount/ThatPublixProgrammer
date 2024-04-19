export type KeyOfStringOrNumber<T> = {
  [K in keyof T]: K extends symbol ? never : K;
}[keyof T];
