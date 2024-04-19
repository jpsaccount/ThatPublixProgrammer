import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("3BDD311B-9A34-45A0-92EE-AC2CA1E00859")
export class EquipmentConfigurationGroup extends Entity {
  Name: string = "";
  Description: string = "";
  Notes: string = "";
}
