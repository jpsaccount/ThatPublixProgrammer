import { useMemo, useState } from "react";

export default function useTrackedState<T>(
  initialValue: T,
  hookName: string,
): [T, (value: React.SetStateAction<T>) => void] {
  const [state, setState] = useState(initialValue);

  const setTrackedState = useMemo(
    () => (newValue: T) => {
      setState((oldValue) => {
        newValue;
        const stack = new Error().stack;
        if (newValue !== oldValue) {
          console.log(
            `${hookName} changed from ${JSON.stringify(oldValue)} to ${JSON.stringify(newValue)} from ${stack}`,
          );
          return newValue;
        } else {
          console.log(`${hookName} did not changed from ${JSON.stringify(oldValue)} to ${JSON.stringify(newValue)}`);
          return oldValue;
        }
      });
    },
    [setState, hookName],
  );

  return [state, setTrackedState];
}
