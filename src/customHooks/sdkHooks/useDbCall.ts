import { HttpRequestHandler } from "@/sdk/services/Http/HttpRequestHandler";
import { getService } from "@/sdk/services/serviceProvider";
import { RequestResponse } from "@sdk/./index";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { QueryKey, QueryObserverResult, UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";

export function useDbGet<T>(
  path: string,
  options?: Partial<UndefinedInitialDataOptions<T, Error, T, QueryKey>> | undefined,
): QueryObserverResult<T, Error> {
  let defaultOptions: UndefinedInitialDataOptions<T, Error, T, QueryKey> = {
    queryKey: [path],
    queryFn: async () => {
      const httpRequestHandler = getService(HttpRequestHandler);
      let response: RequestResponse<T>;
      response = await httpRequestHandler.getAsync<T>(path);
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
  return useQuery(defaultOptions);
}
