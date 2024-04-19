import ApiSettings from "@/ApiSettings.json";
import { getEntityTypeId } from "../../sdkconfig/EntityTypeId";

export function getEntityRoute<T>(entityType: new (...args: any[]) => T) {
  return ApiSettings.Endpoints[getEntityTypeId(entityType)] + "/";
}

export function getEntityRouteByEntityId(entityId: string) {
  return ApiSettings.Endpoints[entityId] + "/";
}
