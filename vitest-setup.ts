import "reflect-metadata";
import * as matchers from "@testing-library/jest-dom/matchers";
import { afterEach, beforeAll, expect, vi } from "vitest";
import { User } from "./src/sdk/entities/User";
import { cleanup, fireEvent, waitFor } from "@testing-library/react";
import "./src/appMocks";
import { setup } from "./src/sdk";

process.env.DEBUG_PRINT_LIMIT = "1000000";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
const localStorageMock = (() => {
  let store = new Map<string, any>();

  return {
    getItem(key: string): any {
      const value = store.get(key);
      return value ? value : null;
    },
    setItem(key: string, value: any): void {
      store.set(key, value);
    },
    removeItem(key: string): void {
      store.delete(key);
    },
    clear(): void {
      store.clear();
    },
    key(index: number): string | null {
      const keys = Array.from(store.keys());
      return keys[index] || null;
    },
    get length(): number {
      return store.size;
    },
  };
})();

global.localStorage = localStorageMock;

beforeAll(() => {
  global.localStorage = localStorageMock;
});
const DOWN_ARROW = { keyCode: 40 };

export async function selectedAnItemFromDom(testId, getByText) {
  fireEvent.keyDown(getByLabelText(getByLabelText), DOWN_ARROW);
  await waitFor(() => expect(getByText(getByText)).toBeInTheDocument());
  fireEvent.click(getByText(getByText));
}

setup();
