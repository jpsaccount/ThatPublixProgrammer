import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { ChildEntity } from "../../contracts/ChildEntity";

@EntityType("0aef05d8-9a36-41bc-ae87-1385b47b0094")
export class InvoiceSummaryItem extends Entity {
  OrderHint: number;
  AmountUsd: number;
  Title: string = "";
}
