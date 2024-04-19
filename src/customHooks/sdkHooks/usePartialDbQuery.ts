import { Entity } from "@/sdk/contracts/Entity";
import { PagedResponse } from "@/sdk/models/PagedResponse";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { onLiveUpdates } from "@/sdk/services/SdkHeartbeatHandler";
import { createPartialUpdatedEntity } from "@/sdk/services/StateHandler";
import { getEntityService } from "@/sdk/services/getEntityService";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { QueryKey, UndefinedInitialDataOptions, UseQueryResult, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useSessionStorageState } from "../useSessionStorageState";
import moment from "moment";
import { DbChangeLog } from "@/sdk/models/DbChangeLog";
export type CustomPageQueryResult<T> = UseQueryResult<PagedResponse<T>, Error> & {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  fetchPreviousPage: () => void;
  fetchNextPage: () => void;
};

export function usePartialDbQuery<T extends Entity>(
  entityType: new (...args: any[]) => T,
  initialQuery: string,
  itemCountPerPage: number,
  options?: Partial<UndefinedInitialDataOptions<PagedResponse<T>, Error, PagedResponse<T>, QueryKey>> | undefined,
  deps?: React.DependencyList | undefined,
) {
  const [currentPage, setCurrentPage] = useSessionStorageState(initialQuery, 1);

  const isFetching = useRef(false);
  const continuationToken = useRef("");

  useEffect(() => {
    continuationToken.current = "";
  }, [initialQuery]);

  let query = initialQuery;
  query = query?.trim().replace(/"/g, "'");
  const entityTypeId = useMemo(() => getEntityTypeId(entityType), [entityType]);

  const isCustomUrl = query?.toLowerCase()?.startsWith("url");
  if (isCustomUrl) {
    query = query.replace(/url/i, "").trim();
  }
  const entityName = isDevEnvironment() ? entityType.name : entityTypeId;

  const pageKey = itemCountPerPage + " per page - page:" + currentPage;
  const queryKey = [entityName, query, "partial", pageKey];
  const queryClient = useQueryClient();

  let defaultOptions: UndefinedInitialDataOptions<PagedResponse<T>, Error, PagedResponse<T>, QueryKey> = {
    placeholderData: (previous) => previous,
    queryKey: queryKey,
    queryFn: async () => {
      const entityService = getEntityService<T>(entityType);
      const executingQuery = `SELECT Paged(*, ${currentPage}, ${itemCountPerPage}) FROM c ${query}`;
      const response = await entityService.getPagedWhereAsync(
        executingQuery,
        new Map([["continuationToken", continuationToken.current]]),
      );
      isFetching.current = false;
      if (response.error) {
        throw response.error;
      }
      if (response.data.CurrentPage > response.data.PageCount) {
        setCurrentPage(1);
      }
      continuationToken.current = response.data.ContinuationToken;
      isFetching.current = false;

      return response.data;
    },
  };

  if (isUsable(options)) {
    defaultOptions = { ...defaultOptions, ...options };
  } else {
    defaultOptions = defaultOptions;
  }

  const queryResult = useQuery(defaultOptions);

  const onLiveUpdate = useCallback(
    (action: (updates: Partial<T>, changeLog: DbChangeLog) => any) => {
      const liveUpdateKey = entityName + query + "first" + "pageUpdate";

      onLiveUpdates((databaseChanges) => {
        databaseChanges.forEach((x) => {
          x.UpdatesMade.forEach((update) => {
            if (update.EntityTypeId == entityTypeId) {
              const pagedResponse = queryClient.getQueryData(defaultOptions.queryKey) as PagedResponse<T>;
              if (isUsable(pagedResponse) === false) return;
              const data = pagedResponse.Items.find((x) => x.id === update.EntityId);
              if (isUsable(data) === false) return;

              if (data.id != update.EntityId) return;
              const entityChanges = createPartialUpdatedEntity(data, update);
              entityChanges.id = update.EntityId;
              entityChanges._etag = update.FinalETag;
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
    [defaultOptions.queryKey, queryClient, entityTypeId],
  );

  const safeFetchNextPage = async () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const fetchPreviousPage = async () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  return {
    ...queryResult,
    onLiveUpdate,
    fetchPreviousPage: fetchPreviousPage,
    fetchNextPage: safeFetchNextPage,
    currentPage: currentPage,
    setCurrentPage,
  };
}
