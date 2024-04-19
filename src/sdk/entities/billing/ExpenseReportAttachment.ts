import { AttachmentEntity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
@EntityType("e2fcd776-00bb-4a1b-9687-cc508df5cd84")
export class ExpenseReportAttachment extends AttachmentEntity {
  ExpenseReportId: string = "";
  Title: string = "";
  Description: string = "";
}
