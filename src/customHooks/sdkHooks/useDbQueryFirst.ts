import { CurrentSessionId } from "@/sdk";
import { DbChangeLog } from "@/sdk/models/DbChangeLog";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { onLiveUpdates } from "@/sdk/services/SdkHeartbeatHandler";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import { Entity } from "@sdk/./contracts/Entity";
import { createPartialUpdatedEntity } from "@sdk/./services/StateHandler";
import { getEntityService } from "@sdk/./services/getEntityService";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { QueryKey, UndefinedInitialDataOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useCallback, useEffect, useMemo } from "react";

export function useDbQueryFirst<T extends Entity>(
  entityType: new (...args: any[]) => T,
  query?: string,
  options?: Partial<UndefinedInitialDataOptions<T, Error, T, QueryKey>> | undefined,
  deps: React.DependencyList | undefined = undefined,
) {
  const queryClient = useQueryClient();
  const entityTypeId = useMemo(() => getEntityTypeId(entityType), [entityType]);

  query = query?.trim().replace(/"/g, "'");
  const isCustomUrl = query?.toLowerCase()?.startsWith("get");
  if (isCustomUrl) {
    query = query.replace(/get/i, "").trim();
  }
  const entityName = isDevEnvironment() ? entityType.name : entityTypeId;

  const queryKey = [entityName, query, "first"];

  let defaultOptions: UndefinedInitialDataOptions<T, Error, T, QueryKey> = {
    queryKey: queryKey,
    queryFn: async () => {
      const entityService = getEntityService<T>(entityType);
      const regex = /c\.id\s*=\s*'([^']+)'/;
      const match = query.match(regex);
      let response;
      if (isCustomUrl) {
        response = await entityService.customGetAsync<T>(query);
      } else if (isUsable(match) && isUsable(match[1])) {
        response = await entityService.getAsync(match[1]);
      } else {
        response = await entityService.getFirstWhereAsync(query);
      }
      if (response.error) {
        throw response.error;
      }

      return response.data;
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
              const data = queryClient.getQueryData(defaultOptions.queryKey) as T;
              if (isUsable(data) === false) return;
              if (data.id != update.EntityId) return;
              if (data._etag === update.FinalETag) return;

              const entityChanges = createPartialUpdatedEntity(data, update);
              const keys = Object.keys(entityChanges);

              if (keys.some((x) => data[x] != entityChanges[x])) {
                entityChanges.ModifiedByUserId = x.ChangesFromUserId;
                entityChanges.ModifiedDateTime = moment(update.DateTime).utc();
                const changeLog = new DbChangeLog();
                changeLog.modifiedByUserId = x.ChangesFromUserId;
                changeLog.changedOn = moment();
                changeLog.changes = entityChanges;
                changeLog.sessionId = x.SessionId;
                action(entityChanges, changeLog);
              }
            }
          });
        });
      }, liveUpdateKey);
    },
    [defaultOptions.queryKey, queryClient, entityTypeId, getQuery],
  );

  return { ...getQuery, onLiveUpdate };
}
