import { ChildEntity } from "../contracts/ChildEntity";
import { EntityType } from "../sdkconfig/EntityTypeId";

@EntityType("b26236d8-5f02-4fef-87aa-2af946d34504")
export class InvoicePdfSettings extends ChildEntity {
  ProjectName: string = "";
  IsOverring: boolean;
}
