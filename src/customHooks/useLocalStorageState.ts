import { getService } from "@sdk/./services/serviceProvider";
import { useCallback, useEffect, useState } from "react";
import { isUsable } from "@/utilities/usabilityUtils";
import { LocalStorageService } from "@/sdk/services/LocalStorageService";

export function useLocalStorageState<T>(
  key: string,
  initialValue?: T | undefined,
): [T | undefined, (value: React.SetStateAction<T>) => void] {
  const localStorageService = getService(LocalStorageService);

  const [stateValue, setStateValue] = useState<T>(() => {
    const cachedValue = localStorageService.getItem<T>(key);
    if (cachedValue !== null) {
      initialValue = cachedValue;
    }

    return initialValue;
  });

  const localStorageStorageKey = "localStorage" + key;

  const setLocalValue = useCallback(
    (value) => {
      if (isUsable(value) == false) {
        localStorageService.removeItem(key);
      } else {
        localStorageService.setItem(key, value);
        window.dispatchEvent(new Event(localStorageStorageKey));
      }
      setStateValue(value);
    },
    [localStorageService],
  );

  const storageEventHandler = useCallback(() => {
    const cachedValue = localStorageService.getItem<T>(key);
    if (cachedValue !== stateValue) {
      setStateValue(cachedValue);
    }
  }, [setStateValue, key, stateValue]);

  useEffect(() => {
    window.addEventListener(localStorageStorageKey, storageEventHandler);
    return () => {
      // Remove the handler when the component unmounts
      window.removeEventListener(localStorageStorageKey, storageEventHandler);
    };
  }, [storageEventHandler]);

  return [stateValue, setLocalValue];
}
