import { expect, describe, it, vi, test } from "vitest";
import { RenderOptions, RenderResult, act, fireEvent, waitFor, screen } from "@testing-library/react";

export async function waitForLoadingAsync(
  result: RenderResult<
    typeof import("./../../../node_modules/@testing-library/dom/types/queries"),
    HTMLElement,
    HTMLElement
  >,
) {
  await waitFor(
    () => {
      const elements = result.queryAllByTestId("loading-spinner");
      expect(elements).toHaveLength(0);
    },
    { timeout: 20000, interval: 500 },
  );
}

const DOWN_ARROW = { keyCode: 40 };
const ENTER = { keyCode: 13 };

export function setDropdownOption(dropdown: HTMLElement, optionIndex: number) {
  act(() => {
    dropdown.focus();
  });
  for (let i = 0; i <= optionIndex; i++) {
    act(() => {
      fireEvent.keyDown(dropdown, DOWN_ARROW);
    });
  }
  act(() => {
    fireEvent.keyDown(dropdown, ENTER);
  });
}
