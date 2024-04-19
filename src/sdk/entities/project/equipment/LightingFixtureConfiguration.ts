import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("e884e4a2-40bc-46dd-bfc8-aa3a5d400112")
export class LightingFixtureConfiguration extends Entity {
  PowerConnectionType: string = "";
  Index: string = "";
  EquipmentId: string = "";
  EquipmentCategoryId: string = "";
  Notes: string = "";
  InternalNotes: string = "";
  Index2: string = "";
  EquipmentTypeGroupId: string = "";
  IsExisting: boolean;
  IsBeingPurchaseByOthers: boolean;
  HoldOnBuying: boolean;
  InstallationNotes: string = "";
  IsExtendedDataSheet: boolean;
  IsLamp1NoSpares: boolean;
  IsLamp2NoSpares: boolean;
  MountingType: string = "";
  Lamp1Id: string = "";
  Lamp2Id: string = "";
  TotalAccessoriesCost: number;
}
