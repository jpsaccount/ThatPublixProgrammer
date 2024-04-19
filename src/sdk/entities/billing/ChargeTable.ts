import { InvoiceItem } from "../../childEntities/InvoiceItem";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("61152916-8745-4035-b6a8-f6bc7122e67e")
export class ChargeTable extends InvoiceItem {
  Header: string = "";
  ExpenseItems: string[] = [];
  TimeActivityItems: string[] = [];
  BillableServices: string[] = [];
  RetainageItems: string[] = [];
}
