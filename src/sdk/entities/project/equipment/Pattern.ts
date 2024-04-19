import { AttachmentEntity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";
@EntityType("36890c1f-0381-4cc2-b967-2c7d53a7bdc7")
export class Pattern extends AttachmentEntity {
  Name: string = "";
  Model: string = "";
  Description: string = "";
  Notes: string = "";
  IsCustom: boolean;
  ManufacturerId: string = "";
}
