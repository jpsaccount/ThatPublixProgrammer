import { Entity } from "@/sdk/contracts/Entity";
import { DbChangeLog } from "@/sdk/models/DbChangeLog";
import { PagedResponse } from "@/sdk/models/PagedResponse";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { onLiveUpdates } from "@/sdk/services/SdkHeartbeatHandler";
import { createPartialUpdatedEntity } from "@/sdk/services/StateHandler";
import { getEntityService } from "@/sdk/services/getEntityService";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import {
  FetchNextPageOptions,
  FetchPreviousPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef } from "react";

export type CustomPageQueryResult<T> = UseInfiniteQueryResult<InfiniteData<PagedResponse<T>, number>> & {
  currentPageData: PagedResponse<T>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export function useDbInfiniteQuery<T extends Entity>(
  entityType: new (...args: any[]) => T,
  initialQuery: string,
  itemCountPerPage: number,
  options?:
    | Partial<
        UndefinedInitialDataInfiniteOptions<
          PagedResponse<T>,
          Error,
          InfiniteData<PagedResponse<T>, number>,
          QueryKey,
          number
        >
      >
    | undefined,
  deps?: React.DependencyList | undefined,
) {
  const lastKnownQuery = useRef(initialQuery);
  const currentPageNumber = useRef(1);
  if (lastKnownQuery.current != initialQuery) {
    lastKnownQuery.current = initialQuery;
    currentPageNumber.current = 1;
  }

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

  const queryKey = [entityName, query, "partial"];
  const queryClient = useQueryClient();
  const onLiveUpdate = useCallback(
    (action: (updates: Partial<T>, changeLog: DbChangeLog) => any) => {
      const liveUpdateKey = entityName + query + "first" + "pageUpdate";

      onLiveUpdates((databaseChanges) => {
        databaseChanges.forEach((x) => {
          x.UpdatesMade.forEach((update) => {
            if (update.EntityTypeId == entityTypeId) {
              const array = queryClient.getQueryData(defaultOptions.queryKey) as InfiniteData<PagedResponse<T>>;
              if (isUsable(array) === false) return;
              const data = array.pages.flatMap((x) => x.Items).find((x) => x.id === update.EntityId);
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
    [queryKey, queryClient, entityTypeId],
  );

  let defaultOptions: UndefinedInitialDataInfiniteOptions<
    PagedResponse<T>,
    Error,
    InfiniteData<PagedResponse<T>, number>,
    QueryKey,
    number
  > = {
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      if (pageParam === undefined) return;

      const entityService = getEntityService<T>(entityType);
      const executingQuery = `SELECT Paged(*, ${pageParam}, ${itemCountPerPage}) FROM c ${query}`;
      const response = await entityService.getPagedWhereAsync(
        executingQuery,
        new Map([["continuationToken", continuationToken.current]]),
      );
      isFetching.current = false;
      if (response.error) {
        throw response.error;
      }
      continuationToken.current = response.data.ContinuationToken;
      return response.data;
    },
    initialPageParam: currentPageNumber.current,
    getNextPageParam: (response) => {
      const nextPage = currentPageNumber.current + 1;
      if (nextPage > response.PageCount) {
        return undefined;
      }
      return nextPage;
    },
  };

  if (isUsable(options)) {
    defaultOptions = { ...defaultOptions, ...options };
  } else {
    defaultOptions = defaultOptions;
  }
  const queryResult = useInfiniteQuery<
    PagedResponse<T>,
    Error,
    InfiniteData<PagedResponse<T>, number>,
    QueryKey,
    number
  >(defaultOptions);

  const safeFetchNextPage = async (
    options?: FetchNextPageOptions,
  ): Promise<InfiniteQueryObserverResult<InfiniteData<PagedResponse<T>, number>, Error>> => {
    if (isFetching.current == false) {
      isFetching.current = true;

      const response = await queryResult.fetchNextPage(options);
      currentPageNumber.current = currentPageNumber.current + 1;
      isFetching.current = false;
      return response;
    } else {
      return null;
    }
  };

  const fetchPreviousPage = async (
    options?: FetchPreviousPageOptions,
  ): Promise<InfiniteQueryObserverResult<InfiniteData<PagedResponse<T>, number>, Error>> => {
    if (isFetching.current == false) {
      isFetching.current = true;
      const response = await queryResult.fetchPreviousPage(options);
      currentPageNumber.current = currentPageNumber.current - 1;

      isFetching.current = false;
      return response;
    } else {
      return null;
    }
  };

  return {
    ...queryResult,
    onLiveUpdate,
    fetchPreviousPage: fetchPreviousPage,
    fetchNextPage: safeFetchNextPage,
    currentPageData: queryResult.data?.pages[currentPageNumber.current - 1],
    currentPage: currentPageNumber.current,
    setCurrentPage: (value) => {
      if (typeof value === "function") {
        currentPageNumber.current = (value as Function)(currentPageNumber.current);
      } else {
        currentPageNumber.current = value;
      }
    },
  };
}
