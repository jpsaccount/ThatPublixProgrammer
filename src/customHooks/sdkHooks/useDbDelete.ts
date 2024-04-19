import { PagedResponse } from "@/sdk/models/PagedResponse";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Entity } from "@sdk/./contracts/Entity";
import { getEntityService } from "@sdk/./services/getEntityService";
import { QueryKey, UseMutationOptions, UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";

export function useDbDelete<T extends Entity>(
  entityType: new (...args: any[]) => T,
  mutationOptions?: Partial<UseMutationOptions<T | T[], Error, T | T[], unknown>>,
): UseMutationResult<T | T[], Error, T | T[], unknown> {
  const queryClient = useQueryClient();
  const entityName = isDevEnvironment() ? entityType.name : getEntityTypeId(entityType);

  const defaultOptions: UseMutationOptions<T | T[], Error, T, unknown> = {
    mutationFn: async (data: T | T[]) => {
      const service = getEntityService(entityType);
      if (Array.isArray(data)) {
        await Promise.all(data.map((x) => service.deleteAsync(x)));
      } else {
        const response = await service.deleteAsync(data);
        if (response.error) {
          throw response.error;
        }
      }
      return data;
    },
    onSuccess: (newData, variables, context) => {
      if (mutationOptions) {
        mutationOptions.onSuccess && mutationOptions.onSuccess(newData, variables, context);
        return;
      }

      const allQueries = queryClient.getQueriesData({ queryKey: [entityName] });

      function handleUpdate([queryKey, data]: [QueryKey, T | T[] | PagedResponse<T>], newData: T) {
        if (isUsable(data) === false) return;

        if (Array.isArray(data)) {
          if (data.find((i) => i.id === newData.id) !== null) {
            queryClient.setQueryData(
              queryKey,
              data.filter((e) => e.id !== newData.id),
            );
          }
        } else if ("Items" in data) {
          const items = data.Items;
          if (items.find((i) => i.id === newData.id) !== null) {
            queryClient.setQueryData(queryKey, { ...data, Items: items.filter((e) => e.id !== newData.id) });
          }
        } else if ("id" in data) {
          if (data.id === newData.id) {
            queryClient.removeQueries({ queryKey: queryKey, exact: true });
          }
        }
      }

      function handleMultipleUpdate([queryKey, data]: [QueryKey, T | T[] | PagedResponse<T>], newData: T[]) {
        if (isUsable(data) === false) return;

        const newDataIds = newData.map((x) => x.id);
        if (Array.isArray(data)) {
          if (data.find((i) => newDataIds.includes(i.id)) !== null) {
            queryClient.setQueryData(
              queryKey,
              data.filter((e) => newDataIds.includes(e.id) === false),
            );
          }
        } else if ("Items" in data) {
          const items = data.Items;
          if (items.find((i) => newDataIds.includes(i.id)) !== null) {
            queryClient.setQueryData(queryKey, {
              ...data,
              Items: items.filter((e) => newDataIds.includes(e.id) === false),
            });
          }
        } else if ("id" in data) {
          if (newDataIds.includes(data.id)) {
            queryClient.removeQueries({ queryKey: queryKey, exact: true });
          }
        }
      }

      allQueries.forEach(([queryKey, data]: [QueryKey, T | T[] | PagedResponse<T>]) => {
        if (Array.isArray(newData)) {
          handleMultipleUpdate([queryKey, data], newData);
        } else {
          handleUpdate([queryKey, data], newData);
        }
      });
    },
  };

  const mutation = useMutation<T | T[], Error, T | T[], unknown>({
    ...(mutationOptions ?? {}),
    ...defaultOptions,
  });

  return mutation;
}
