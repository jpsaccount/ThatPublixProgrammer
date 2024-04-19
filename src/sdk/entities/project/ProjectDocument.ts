import { ChildEntity } from "@/sdk/contracts/ChildEntity";
import { DocumentLineItem } from "./DocumentLineItem";

export abstract class AnyProjectDocument extends ChildEntity {
  Title: string = "";
  Nickname: string = "";
  Description: string = "";
  DocumentStatusId: string = "";
  Notes: string = "";
}
export abstract class ProjectDocument<T extends DocumentLineItem> extends AnyProjectDocument {
  Phases: T[] = [];

  // Assuming specific logic for the CreatePhase method is not required in TypeScript
}
