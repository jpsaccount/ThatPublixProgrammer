import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";
import { MediaContentStatus } from "../MediaContentStatus";
import { PriorityLevel } from "../PriorityLevel";
import { EquipmentControl } from "./EquipmentControl";

@EntityType("ba5f610c-a303-4f62-8b38-ab9d8c75621b")
export class LightingFixtureUnit extends Entity {
  Control: EquipmentControl = new EquipmentControl();
  UnitId: string;
  UnitNumber: number;
  UnitLetterIndex: string = "";
  UnitNumberIndex: number;
  Description: string = "";
  Purpose: string = "";
  Filter: string = "";
  PatternSize: string = "";
  InternalNotes: string = "";
  Notes: string = "";
  Circuit: string = "";
  Panel: string = "";
  Location: string = "";
  ExternalID: string = "";
  SetupNotes: string = "";
  InstallNotes: string = "";
  Pattern2Size: string = "";
  Channel: string = "";
  SubPurpose: string = "";
  ExternalVersionGuid: string = "";
  ProjectDatabaseId: string = "";
  EquipmentTypeId: string = "";
  PatternId: string = "";
  Pattern2Id: string = "";
  LCIO: string = "";
  PatternRawString: string = "";
  MediaContentsCount: number = 0;
  MediaContentStatus: MediaContentStatus;
  MediaContentStatusPriority: PriorityLevel;
  Settings: string = "";
  Accessories: string = "";
}
