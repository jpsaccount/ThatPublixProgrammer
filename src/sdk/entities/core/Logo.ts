import { AttachmentEntity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("dca825df-2590-4aeb-877c-ce846fcfee4f")
export class Logo extends AttachmentEntity {
  Description: string = "";
  Title: string = "";
}
