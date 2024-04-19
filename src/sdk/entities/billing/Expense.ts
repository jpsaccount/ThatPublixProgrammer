import { ExpenseLineItem } from "../../childEntities/ExpenseLineItem";
import { ExpensePrintSetting } from "../../childEntities/ExpensePrintSetting";
import { AttachmentEntity } from "../../contracts/Entity";
import { IBillable } from "../../contracts/IBillable";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { BillingDetails } from "./BillingDetails";
import moment, { Moment } from "moment/moment";

@EntityType("72deef11-1056-44a6-9c1e-35de3bc5141d")
export class Expense extends AttachmentEntity implements IBillable {
  AmountUsd: number;
  MerchantName: string;
  TxnDate: Moment;
  ExpenseReportId: string = "";
  WorkingPhaseId: string = "";
  CurrencyRateToUsd: number;
  LineItems: ExpenseLineItem[] = [];
  PrintSetting: ExpensePrintSetting = new ExpensePrintSetting();
  BillingDetails: BillingDetails = new BillingDetails();
  //Status: ApprovalStatus;
  CurrencyId: string = "";
}
