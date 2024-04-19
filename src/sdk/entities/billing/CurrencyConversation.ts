import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { ChildEntity } from "../../contracts/ChildEntity";
import { Moment } from "moment/moment";

@EntityType("832deb7d-40fd-461a-8d78-2bd150c84b86")
export class CurrencyConversation extends Entity {
  Date: Moment;
  DateSelected: string = "";
  CurrencyId: string = "";
  RateToUsd: number;
}
