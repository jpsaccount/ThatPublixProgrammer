import { CheckListItem } from "@/sdk/childEntities/CheckListItem";
import { PunchListItemAssignment } from "@/sdk/childEntities/PunchListItemAssignment";
import { PunchListItemAttachment } from "@/sdk/childEntities/PunchListItemAttachment";
import { TaggedEntity } from "@/sdk/childEntities/TaggedEntity";
import { Entity } from "@/sdk/contracts/Entity";
import { Priority } from "@/sdk/enums/Priority";
import { Status } from "@/sdk/enums/Status";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";
import moment from "moment";
import { Moment } from "moment";

@EntityType("eecf3f6a-d21d-46a7-9c1f-4f8277428aa4")
export class PunchListItem extends Entity {
  OrderHint: string;
  Title: string;
  Priority: Priority;
  StartDate: Moment;
  EndDate: Moment;
  Description: string;
  Attachments: PunchListItemAttachment[] = [];
  Status: Status;
  StatusLastChanged: Moment;
  StatusChangedByUserId: string;
  TaggedEntities: TaggedEntity[] = [];
  Tags: string[] = [];
  CheckListItems: CheckListItem[] = [];
  Assignments: PunchListItemAssignment[] = [];
  IsShowingCheckListItemsInCard: boolean = false;
  PunchListId: string;
}
