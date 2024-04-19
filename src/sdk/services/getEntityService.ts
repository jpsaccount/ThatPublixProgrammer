import { AnyEntityService } from "./AnyEntityService";
import { Entity } from "../contracts/Entity";
import diContainer, { tryAddToContainer } from "../sdkconfig/SdkSetup";
import { getEntityTypeFromId, getEntityTypeId } from "../sdkconfig/EntityTypeId";
import { EntityService } from "./EntityService";
import { isDevEnvironment } from "../utils/devUtils";

export function getAnyService(entityTypeId: string): AnyEntityService {
  return diContainer.get(getEntityTypeFromId(entityTypeId).name);
}

export function getEntityService<T extends Entity>(entityType: new (...args: any[]) => T): EntityService<T> {
  const key = isDevEnvironment() ? entityType.name : getEntityTypeId(entityType);

  tryAddToContainer(EntityService<T>, key);

  const entityService = diContainer.get<EntityService<T>>(key);
  entityService.setBasePath(entityType);

  return entityService;
}
