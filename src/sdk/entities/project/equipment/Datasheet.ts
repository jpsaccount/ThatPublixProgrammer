import { AttachmentEntity, Entity } from "../../../contracts/Entity";
import { EntityType } from "../../../sdkconfig/EntityTypeId";

@EntityType("d2cfdf6c-e093-451a-8a16-efe023c09af0")
export class Datasheet extends AttachmentEntity {
  Title: string = "";
  Description: string = "";
}
