import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { getEntityService } from "@sdk/./services/getEntityService";
import { AttachmentEntity, Entity } from "@sdk/./contracts/Entity";
import { createUpdatedEntityFromResponse } from "@sdk/./services/StateHandler";

export function useDbAttachmentUpload<T extends AttachmentEntity>(
  entityType: new (...args: any[]) => T,
  mutationOptions?: Partial<UseMutationOptions<void, Error, [T, File], unknown>>,
): UseMutationResult<void, Error, [T, File], unknown> {
  const queryClient = useQueryClient();

  const defaultOptions: UseMutationOptions<void, Error, [T, File], unknown> = {
    mutationFn: async (data: [T, File]) => {
      const service = getEntityService(entityType);
      const response = await service.uploadAsync(data[0], data[1]);
      if (response.error) {
        throw response.error;
      }
      return;
    },
    onSuccess: (newData, variables, context) => {
      if (mutationOptions) mutationOptions.onSuccess(newData, variables, context);
    },
  };

  const mutation = useMutation<void, Error, [T, File], unknown>({
    ...(mutationOptions ?? {}),
    ...defaultOptions,
  });

  return mutation;
}
