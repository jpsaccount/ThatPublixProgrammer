import { IBillable } from "../../contracts/IBillable";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { BillingDetails } from "./BillingDetails";
import { InvoiceSummaryItem } from "./InvoiceSummaryItem";
@EntityType("8335833c-5ad2-42e3-a9ea-d877239f7fe4")
export class RetainageItem extends InvoiceSummaryItem implements IBillable {
  BillingDetails: BillingDetails;
  WorkingPhaseId: string;
  AmountUsdRetained: number;
  IsPercentageOfInvoiceTotal: boolean;
  Description: string = "";
  Rate: number;
  InvoiceId: string = "";
}
