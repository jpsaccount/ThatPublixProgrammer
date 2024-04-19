import { newUuid } from "../utils/uuidUtils";

export class ChildEntity {
  Id: string = crypto.randomUUID ? crypto.randomUUID() : newUuid();
}
