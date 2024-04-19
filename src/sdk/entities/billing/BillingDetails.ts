import { ChildEntity } from "../../contracts/ChildEntity";
import { BillingStatus } from "../../enums/BillingStatus";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("486cd027-fbc5-48a5-a6a4-96d6b32750d4")
export class BillingDetails extends ChildEntity {
  IsOverridingDefaultStatus: boolean;
  Status: BillingStatus = BillingStatus.Unknown;
  OrderHint: string = "";
  InvoiceId: string = "";
}
