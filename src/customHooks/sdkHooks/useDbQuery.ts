import { DbChangeLog } from "@/sdk/models/DbChangeLog";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import { Entity } from "@sdk/./contracts/Entity";
import { RequestResponse } from "@sdk/./index";
import { getEntityTypeId } from "@sdk/./sdkconfig/EntityTypeId";
import { onLiveUpdates } from "@sdk/./services/SdkHeartbeatHandler";
import { createPartialUpdatedEntity } from "@sdk/./services/StateHandler";
import { getEntityService } from "@sdk/./services/getEntityService";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { QueryKey, UndefinedInitialDataOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";

export function useDbQuery<T extends Entity>(
  entityType: new (...args: any[]) => T,
  query?: string,
  options?: Partial<UndefinedInitialDataOptions<T[], Error, T[], QueryKey>> | undefined,
) {
  query = query?.trim().replace(/"/g, "'");
  const entityTypeId = useMemo(() => getEntityTypeId(entityType), [entityType]);

  const isCustomUrl = query?.toLowerCase()?.startsWith("get");
  if (isCustomUrl) {
    query = query.replace(/get/i, "").trim();
  }

  const entityName = isDevEnvironment() ? entityType.name : entityTypeId;

  const queryKey = query ? [entityName, query] : [entityName];

  const queryClient = useQueryClient();

  let defaultOptions: UndefinedInitialDataOptions<T[], Error, T[], QueryKey> = {
    queryKey: queryKey,
    queryFn: async () => {
      const entityService = getEntityService<T>(entityType);
      let response: RequestResponse<T[]>;
      if (isCustomUrl) {
        response = await entityService.customGetAsync(query);
      } else {
        response = await entityService.getWhereAsync(query);
      }
      if (response.error) {
        throw response.error;
      }
      const data = response.data;

      return data;
    },
  };

  if (isUsable(options)) {
    defaultOptions = { ...defaultOptions, ...options };
  } else {
    defaultOptions = defaultOptions;
  }

  const getQuery = useQuery(defaultOptions);
  // useEffect(() => {
  //   if (queryKey[0] !== defaultOptions[0] || queryKey[1] !== defaultOptions[1]) {
  //     getQuery.refetch();
  //   }
  // }, [query]);

  const onLiveUpdate = useCallback(
    (action: (updates: Partial<T>, changeLog: DbChangeLog) => any) => {
      const liveUpdateKey = entityName + query + "first" + "pageUpdate";

      onLiveUpdates((databaseChanges) => {
        databaseChanges.forEach((x) => {
          x.UpdatesMade.forEach((update) => {
            if (update.EntityTypeId == entityTypeId) {
              const array = queryClient.getQueryData(defaultOptions.queryKey) as T[];
              if (isUsable(array) === false) return;
              const data = array.find((x) => x.id === update.EntityId);
              if (isUsable(data) === false) return;

              if (data.id != update.EntityId) return;
              const entityChanges = createPartialUpdatedEntity(data, update);
              entityChanges.ModifiedByUserId = x.ChangesFromUserId;
              const changeLog = new DbChangeLog();
              changeLog.modifiedByUserId = x.ChangesFromUserId;
              changeLog.changedOn = moment();
              changeLog.changes = entityChanges;
              action(entityChanges, changeLog);
            }
          });
        });
      }, liveUpdateKey);
    },
    [defaultOptions.queryKey, queryClient, entityTypeId, getQuery],
  );

  return { ...getQuery, onLiveUpdate };
}
