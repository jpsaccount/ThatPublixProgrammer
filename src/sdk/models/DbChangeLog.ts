import { Moment } from "moment";
import { UpdateRequest } from "./UpdateRequest";

export class DbChangeLog {
  modifiedByUserId: string;
  changedOn: Moment;
  changes: Partial<any>;
  sessionId: string;
}
