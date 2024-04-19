import { useState } from "react";

export function usePartialState<T>(initialState: T) {
  const [state, setS] = useState<T>(initialState);

  const setState = (newProps: Partial<T>) => {
    setS((prev) => {
      return { ...prev, ...newProps };
    });
  };

  return { state, setState };
}
