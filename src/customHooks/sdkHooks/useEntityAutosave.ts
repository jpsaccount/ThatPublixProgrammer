import { Entity } from "@/sdk/contracts/Entity";
import { useCallback, useEffect, useRef, useState } from "react";
import { UpdateOptions, useDbUpsert } from "./useDbUpsert";
import { UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

type AutosaveOptions<T> = UpdateOptions<T> & {
  delay: number;
};

export default function useAutosaveState<T extends Entity | Entity[]>(
  entityType: new (...args: any[]) => Entity,
  defaultValue: T | (() => T),
  options?: AutosaveOptions<T>,
): [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  UseMutationResult<Entity, Error, Entity, unknown>,
  React.Dispatch<React.SetStateAction<T>>,
] {
  const upsertMutation = useDbUpsert(entityType, { updateCache: options?.updateCache });

  const [value, setValue] = useState<T>(defaultValue);

  const shouldSave = useRef(false);

  options ??= { delay: 200 };
  const saveState = useCallback(
    (newValue) => {
      if (Array.isArray(newValue)) {
        Promise.all(newValue.map((item) => upsertMutation.mutateAsync(item)));
      } else {
        upsertMutation.mutateAsync(newValue as Entity);
      }
    },
    [upsertMutation],
  );

  const update = useCallback(
    (newValue: React.SetStateAction<T>) => {
      console.log(newValue);
      setValue(newValue);

      shouldSave.current = true;
    },
    [shouldSave],
  );

  useEffect(() => {
    if (shouldSave.current == false) {
      return;
    }
    const timeOutId = setTimeout(() => {
      shouldSave.current = false;
      saveState(value);
    }, options.delay);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [entityType, value]);

  return [value, update, upsertMutation, setValue];
}
