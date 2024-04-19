import { ChildEntity } from "../contracts/ChildEntity";
import { EntityType } from "../sdkconfig/EntityTypeId";

@EntityType("5183621e-bc0d-4071-b9a0-db275620a4a2")
export class PunchListItemAttachment extends ChildEntity {
  Title: string;
  AttachmentId: string;
}
