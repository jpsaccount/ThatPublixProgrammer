import React, { ComponentType, memo } from "react";

export function withComponentMemo<T extends ComponentType<any>>(
  Component: T,
  compareFn?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean,
): T {
  return memo(Component as ComponentType<any>, compareFn) as unknown as T;
}
