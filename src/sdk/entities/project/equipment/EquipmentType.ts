import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("6ff2b3bb-f675-4a6e-84bb-0e9aa86a9cbd")
export class EquipmentType extends Entity {
  OrderHint: number;
  Code: string;
  Description: string;
  ShowInTimesheet: boolean;
}
