import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("24083c0b-2786-4b10-ae91-0c3a99405c1f")
export class Comment extends Entity {
  Message: string;
  RepliedToCommentId: string;
  AttachmentId: string;
  ItemId: string;
  UserId: string;
}
