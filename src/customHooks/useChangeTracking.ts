import { useEffect, useLayoutEffect, useMemo, useState } from "react";

export function useChangeTracking<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [propertiesChanged, setPropertiesChanged] = useState<Set<string>>(new Set());

  useLayoutEffect(() => {
    console.log("initial value", initialValue);
    setValue(initialValue);
    setPropertiesChanged(new Set());
  }, [initialValue]);

  function update(newProps: Partial<T>) {
    setValue((prev) => {
      const updatedObject = { ...prev, ...newProps };

      setPropertiesChanged((prev) => {
        const updatedProperties = new Set(prev);

        if (initialValue) {
          Object.keys(newProps).forEach((propertyName) => {
            const originalValue = initialValue[propertyName];
            const newValue = updatedObject[propertyName];

            if (originalValue !== newValue) {
              updatedProperties.add(propertyName);
            } else {
              updatedProperties.delete(propertyName);
            }
          });
        }

        return updatedProperties;
      });

      return updatedObject;
    });
  }
  return { initialValue, update: update, value, propertiesChanged };
}
