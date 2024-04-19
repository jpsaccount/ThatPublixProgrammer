import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";
import { Moment } from "moment";
import { PriorityLevel } from "../project/PriorityLevel";

@EntityType("080d428b-de99-4343-acea-08236081c39f")
export class Notification extends Entity {
  EntityTypeId: string;
  EntityId: string;
  RecipientUserId: string;
  ReadOn: Moment;
  Title: string;
  Description: string;
  Priority: PriorityLevel;
  Topic: string;
}
