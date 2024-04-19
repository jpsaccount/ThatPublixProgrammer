import { Moment } from "moment/moment";

export class UpdateRequest {
  DateTime: Moment;
  OriginatedFromUser: string;
  FinalETag: string;
  ETag: string;
  EntityId: string;
  EntityTypeId: string;
  ValueIncrementedEvents: Array<ValueIncrementedEvent> = [];
  ValueChangedEvents: Array<ValueChangedEvent> = [];
  CollectionChangedEvents: Array<CollectionChangedEvent> = [];
  CollectionItemsAddedEvents: Array<CollectionItemsAddedEvent> = [];
  CollectionItemsRemovedEvents: Array<CollectionItemsRemovedEvent> = [];
}

export class EntityEvent {
  SyncToken: string;
  EventDateTime: Moment;
  PropertyName: string;
}

export class CollectionItemsRemovedEvent extends EntityEvent {
  ObjectsToRemove: Array<any>;
}

export class CollectionItemsAddedEvent extends EntityEvent {
  ItemsToAdd: Array<any>;
}
export class CollectionChangedEvent extends EntityEvent {
  Items: Array<any>;
}
export class ValueChangedEvent extends EntityEvent {
  NewValue: any;
  PreviousValue: any;
}

export class ValueIncrementedEvent extends EntityEvent {
  IncrementBy: any;
}
