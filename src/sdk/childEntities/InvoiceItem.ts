import { ChildEntity } from "../contracts/ChildEntity";

export class InvoiceItem extends ChildEntity {
  OrderHint: string = "";
  AmountUsd: number;
}
