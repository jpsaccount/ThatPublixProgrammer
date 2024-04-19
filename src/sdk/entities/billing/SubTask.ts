import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { ChildEntity } from "../../contracts/ChildEntity";
@EntityType("90e7ce0c-1610-4dbf-ae78-9c7e6ff24324")
export class SubTask extends Entity {
  Title: string = "";
  Description: string = "";
  DoesInheritFromCore: boolean;
  CoreSubTaskId: string = "";
  TaskId: string = "";
  ShowInTimesheet: boolean;
}
