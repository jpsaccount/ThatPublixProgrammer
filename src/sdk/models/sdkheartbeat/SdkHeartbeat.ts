import { UpdateRequest } from "../UpdateRequest";

export class SdkHeartbeat {
  Id: string;
  StateChanges: Array<DbEvent>;
}
export class DbEvent {
  EntityTypeId: string;
  EntityId: string;
  Type: EventType;
  UpdateRequest: UpdateRequest;
  //Mispelled cause I'm an idiot
  ActionOccuredOn: Date;
}
export enum EventType {
  Insert,
  Update,
  Delete,
}
