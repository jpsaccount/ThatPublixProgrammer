import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("6ddda4a2-c140-466b-b73f-62ed1375e106")
export class Role extends Entity {
  BillableRate: number;
  Title: string = "";
  QboRoleName: string = "";
  ShowInTimesheet: boolean;
  Description: string = "";
  DoesInheritFromCore: boolean;
  PhaseActivityBucketId: string = "";
  CoreRoleId: string = "";
}
