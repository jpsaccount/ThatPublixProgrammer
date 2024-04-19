import { injectable } from "inversify";
import { Entity } from "../contracts/Entity";
import { DatabaseStateChange, ObjectSyncedResponse } from "../models/ObjectSyncedResponse";
import { UpdateRequest } from "../models/UpdateRequest";
import { DbEvent } from "../models/sdkheartbeat/SdkHeartbeat";
import { isUsable } from "../utils/usabilityUtils";
import { convertDateStringsToDate } from "./Http/AxiosDateReviverInterceptor";

@injectable()
export class StateHandler {
  public async updateStateAsync(dbStateChanges: DatabaseStateChange): Promise<void> {}

  public async updateStateFromDbEventAsync(dbEvent: DbEvent): Promise<void> {
    const { getAnyService } = await import("./getEntityService");
    var entityService = getAnyService(dbEvent.EntityTypeId);
    // var result = entityService.getCache(dbEvent.EntityId);
    // if (typeof result != "undefined" && typeof dbEvent.UpdateRequest != "undefined") {
    //     this.updateEntity(result, dbEvent.UpdateRequest);
    // }
  }
}

export function createUpdatedEntityFromResponse<T extends Entity>(
  oldEntity: T,
  objectSyncedResponse: ObjectSyncedResponse,
): T {
  for (const x of objectSyncedResponse.StateChanges.UpdatesMade) {
    if (x.EntityId == oldEntity.id) {
      return createUpdatedEntity(oldEntity, x);
    }
  }
  return oldEntity;
}
export function createUpdatedEntity<T extends Entity>(oldEntity: T, updateRequest: UpdateRequest): T {
  if (oldEntity._etag === updateRequest.FinalETag) return oldEntity;
  const newEntity = { ...oldEntity };
  newEntity._etag = updateRequest.FinalETag;
  applyUpdate(updateRequest, newEntity, oldEntity);

  return newEntity;
}

function applyUpdate(updateRequest: UpdateRequest, newEntity: {}, oldEntity: {}) {
  for (const valueChangedEvent of updateRequest.ValueChangedEvents) {
    newEntity[valueChangedEvent.PropertyName] = valueChangedEvent.NewValue;
  }

  for (const collectionChanged of updateRequest.CollectionChangedEvents) {
    newEntity[collectionChanged.PropertyName] = collectionChanged.Items;
  }

  for (const collectionItemsRemoved of updateRequest.CollectionItemsRemovedEvents) {
    const removedIds = collectionItemsRemoved.ObjectsToRemove.map((x) => x.Id);
    newEntity[collectionItemsRemoved.PropertyName] = oldEntity[collectionItemsRemoved.PropertyName].filter(
      (x) => removedIds.includes(x.Id) === false,
    );
  }

  for (const collectionItemsAdded of updateRequest.CollectionItemsAddedEvents) {
    newEntity[collectionItemsAdded.PropertyName] = [
      ...oldEntity[collectionItemsAdded.PropertyName],
      ...collectionItemsAdded.ItemsToAdd,
    ];
  }

  for (const valueIncremented of updateRequest.ValueIncrementedEvents) {
    newEntity[valueIncremented.PropertyName] = oldEntity[valueIncremented.PropertyName] + valueIncremented.IncrementBy;
  }

  convertDateStringsToDate(newEntity);
}

export function createPartialUpdatedEntity<T extends Entity>(oldEntity: T, updateRequest: UpdateRequest): Partial<T> {
  if (oldEntity._etag === updateRequest.FinalETag) return oldEntity;
  const newEntity = {};
  newEntity["_etag"] = updateRequest.FinalETag;
  applyUpdate(updateRequest, newEntity, oldEntity);

  return newEntity;
}

let onEntityUpdateCallbacks = new Map<string, Set<(response: any) => void>>();

export function onEntityUpdated<T>(callback: (entity: T) => void, entityId: string) {
  if (isUsable(entityId) === false) return;
  if (onEntityUpdateCallbacks.has(entityId) === false) {
    onEntityUpdateCallbacks[entityId] = new Set<(response: any) => void>();
  }
  onEntityUpdateCallbacks[entityId]?.add(callback);
}

export function onEntitiesUpdated<T extends Entity>(callback: (entity: T) => void, entities: T[]) {
  if (isUsable(entities) === false) return;

  entities.forEach((x) => onEntityUpdated(callback, x.id));
}
