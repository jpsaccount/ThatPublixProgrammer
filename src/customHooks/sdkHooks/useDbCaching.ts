import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { useQueryClient } from "@tanstack/react-query";

export default function useDbCaching() {
  const queryClient = useQueryClient();

  const setFirstQueryCache = <T extends { id: string }>(entityType: new (...args: any[]) => T, entity: T) => {
    const entityName = isDevEnvironment() ? entityType.name : getEntityTypeId(entityType);
    queryClient.setQueryData([entityName, `WHERE c.id = '${entity.id}'`, "first"], entity);
  };

  const setToQuery = <T extends { id: string }>(entityType: new (...args: any[]) => T, entity: T, query?: string) => {
    const entityName = isDevEnvironment() ? entityType.name : getEntityTypeId(entityType);

    setFirstQueryCache(entityType, entity);

    queryClient.setQueryData([entityName], (oldResponse: T[]) => {
      if (Array.isArray(oldResponse) === false) return;
      return [...oldResponse, entity];
    });
    if (isNullOrWhitespace(query)) {
      queryClient.setQueryData([entityName, query], (oldResponse: T[]) => {
        if (Array.isArray(oldResponse) === false) return;
        return [...oldResponse, entity];
      });
    }
  };

  const invalidateQueries = <T extends { id: string }>(entityType: new (...args: any[]) => T) => {
    const entityName = isDevEnvironment() ? entityType.name : getEntityTypeId(entityType);

    queryClient.invalidateQueries({ queryKey: [entityName] });
  };

  return { setFirstQueryCache, setToQuery, invalidateQueries };
}
