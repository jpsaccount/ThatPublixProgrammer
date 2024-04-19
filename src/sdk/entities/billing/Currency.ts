import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("b3e31f34-58ea-4f1d-82aa-bf1bc98e1750")
export class Currency extends Entity {
  Title: string = "";
  Symbol: string = "";
  ShortName: string = "";
}
