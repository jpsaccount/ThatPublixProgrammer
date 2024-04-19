import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { ChildEntity } from "../../contracts/ChildEntity";

@EntityType("28d71d28-0712-4f69-929a-6cf38983b458")
export class Task extends Entity {
  Title: string = "";
  RoleId: string = "";
  ShowInTimesheet: boolean;
  Description: string = "";
  DoesInheritFromCore: boolean;
  CoreTaskId: string = "";
}
