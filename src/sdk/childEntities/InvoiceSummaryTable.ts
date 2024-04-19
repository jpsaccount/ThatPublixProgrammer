import { ChildEntity } from "../contracts/ChildEntity";

export class InvoiceSummaryTable extends ChildEntity {
  Amount: number;
  Header: string = "";
  RetainageItems: string[] = [];
}
