import { ChildEntity } from "../contracts/ChildEntity";
import { EntityType } from "../sdkconfig/EntityTypeId";

@EntityType("2b19ef51-6725-4eec-924d-68be73526855")
export class ExpenseLineItem extends ChildEntity {
  Amount: number = 0;
  StatusReason: string = "";
  Description: string = "";
  UserNotes: string = "";
  AdminNotes: string = "";
  CategoryId: string = "";
}
