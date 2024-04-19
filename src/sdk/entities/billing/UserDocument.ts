import { AttachmentEntity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("13bf0cc8-7ba2-422c-9fa2-3ca27d94161f")
export class UserDocument extends AttachmentEntity {
  Title: string = "";
  Description: string = "";
}
