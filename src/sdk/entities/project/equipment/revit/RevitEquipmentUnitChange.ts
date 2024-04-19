import { Entity } from "@/sdk/contracts/Entity";
import { RevitChangeType } from "./RevitChangeType";
import { ValueChangedEvent } from "@/sdk/models/UpdateRequest";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("fa6c83b6-6ca6-4861-a678-deb926aeaf9c")
export class RevitEquipmentUnitChange extends Entity {
  RevitImportId: string;
  EquipmentUnitId: string;
  EquipmentUnitTitle: string;
  ChangeType: RevitChangeType;
  PropertiesChanged: ValueChangedEvent[];
}
