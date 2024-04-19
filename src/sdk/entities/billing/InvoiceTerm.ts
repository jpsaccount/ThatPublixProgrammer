import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { ChildEntity } from "../../contracts/ChildEntity";
@EntityType("d4b240d6-13cb-4c37-b861-5e889aaeb394")
export class InvoiceTerm extends Entity {
  Title: string = "";
  Description: string = "";
}
