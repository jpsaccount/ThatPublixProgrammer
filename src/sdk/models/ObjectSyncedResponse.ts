import { UpdateRequest } from "./UpdateRequest";

export class ObjectSyncedResponse {
  Id: string;
  SyncToken: string;
  StateChanges: DatabaseStateChange;
}

export class DatabaseStateChange {
  UpdatesMade: Array<UpdateRequest>;
  ChangesFromUserId: string;
  DeviceId: string;
  SessionId: string;
}
