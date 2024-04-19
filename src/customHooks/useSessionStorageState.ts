import { isUsable } from "@/utilities/usabilityUtils";
import { useEffect, useMemo, useState } from "react";

export function useSessionStorageState<T>(
  key: string,
  initialValue?: T | undefined,
): [T | undefined, React.Dispatch<React.SetStateAction<T>>] {
  const intiialValueGetter = useMemo(() => {
    return () => {
      const stringValue = sessionStorage.getItem(key);
      if (stringValue !== null) {
        const cachedValue = JSON.parse(stringValue);
        if (cachedValue !== null) {
          initialValue = cachedValue;
        }
      }
      return initialValue;
    };
  }, [key, initialValue]);
  const [stateValue, setStateValue] = useState<T>(intiialValueGetter);

  useEffect(() => {
    setStateValue((t) => intiialValueGetter());
  }, [key]);

  useEffect(() => {
    if (isUsable(stateValue) == false) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(stateValue));
    }
  }, [stateValue]);

  return [stateValue, setStateValue];
}
