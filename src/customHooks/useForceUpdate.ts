import { useState, useCallback } from "react";

export function useForceUpdate(): () => void {
  const [, setState] = useState(0);
  return useCallback(() => setState((prev) => prev + 1), []); // Increment the state to force re-render
}
