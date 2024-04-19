import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { ChildEntity } from "../../contracts/ChildEntity";

@EntityType("94b336f9-694c-4bd7-9e85-4e0bf65fe37b")
export class InvoiceTermCondition extends ChildEntity {
  IsAmountDiscount: boolean;
  IsAmountPercentage: boolean;
  Amount: number;
  DaysAfterInvoiceDate: number;
  IsDueDate: boolean;
}
