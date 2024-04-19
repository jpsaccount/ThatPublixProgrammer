import { AttachmentEntity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";
import { Moment } from "moment";
import { PriorityLevel } from "../PriorityLevel";

@EntityType("d656d9ef-39df-4c46-a923-9b9131b2c277")
export class FocusPhoto extends AttachmentEntity {
  EquipmentUnitId: string = "";
  IsOfficial: boolean;
  OrderHint: number;
  Title: string = "";
  Description: string = "";
  NeedsReview: boolean;
  Notes: string = "";
  InternalNotes: string = "";
  ReviewPriority: PriorityLevel;
  Taken: Moment;
  Tags: string[];
}
