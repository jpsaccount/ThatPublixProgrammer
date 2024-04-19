import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Entity } from "@sdk/./contracts/Entity";
import { getEntityService } from "@sdk/./services/getEntityService";
import { createUpdatedEntityFromResponse } from "@sdk/./services/StateHandler";
import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from "@tanstack/react-query";

export type UpdateOptions<T> = Partial<UseMutationOptions<T, Error, T, unknown>> & {
  updateCache?: boolean;
};

export function useDbUpsert<T extends Entity>(
  entityType: new (...args: any[]) => T,
  mutationOptions?: UpdateOptions<T>,
): UseMutationResult<T, Error, T, unknown> {
  const queryClient = useQueryClient();
  const entityName = isDevEnvironment() ? entityType.name : getEntityTypeId(entityType);

  const defaultOptions: UseMutationOptions<T, Error, T, unknown> = {
    mutationFn: async (entity: T) => {
      const service = getEntityService(entityType);
      const response = await service.upsertAsync(entity);
      if (response.error) {
        throw response.error;
      }
      return createUpdatedEntityFromResponse(entity, response.data);
    },
    throwOnError: false,
    onSuccess: (newData, variables, context) => {
      if (mutationOptions?.onSuccess) mutationOptions.onSuccess(newData, variables, context);

      if (mutationOptions?.updateCache ?? true) {
        console.log("update cache");
        queryClient.setQueriesData({ queryKey: [entityName] }, (oldData: {}) => {
          if (isUsable(oldData) == false) return oldData;

          if ("id" in oldData === true) {
            if (oldData.id == newData.id) {
              return newData;
            }
          }
          if (Array.isArray(oldData) === false) return oldData;
          if (Array.isArray(oldData)) {
            const oldEntity = oldData.find((i) => i.id === newData.id);
            if (oldEntity !== null) {
              return oldData.map((e) => (e.id === newData.id ? { ...newData } : e));
            }
          }
          return oldData;
        });
      }
    },
  };

  const mutation = useMutation<T, Error, T, unknown>({
    ...(mutationOptions ?? {}),
    ...defaultOptions,
  });

  return mutation;
}
