import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import { Entity } from "@sdk/./contracts/Entity";
import { RequestResponse } from "@sdk/./index";
import { getEntityService } from "@sdk/./services/getEntityService";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { QueryKey, QueryObserverResult, UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import React from "react";

export function useDbSearch<T extends Entity>(
  entityType: new (...args: any[]) => T,
  query?: string,
  options?: Partial<UndefinedInitialDataOptions<string[], Error, string[], QueryKey>> | undefined,
  deps?: React.DependencyList | undefined,
): QueryObserverResult<string[], Error> {
  query = query?.trim().replace(/"/g, "'");

  const isCustomUrl = query?.toLowerCase()?.startsWith("get");
  if (isCustomUrl) {
    query = query.replace(/get/i, "").trim();
  }

  const entityName = isDevEnvironment() ? entityType.name : getEntityTypeId(entityType);

  const queryKey = [entityName + " search", query];

  let defaultOptions: UndefinedInitialDataOptions<string[], Error, string[], QueryKey> = {
    queryKey: queryKey,
    queryFn: async () => {
      const entityService = getEntityService<T>(entityType);
      let response: RequestResponse<string[]> = await entityService.customPostAsync<string[], string>("search", query);
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
  defaultOptions.queryKey = queryKey;
  const getQuery = useQuery(defaultOptions);

  return getQuery;
}
