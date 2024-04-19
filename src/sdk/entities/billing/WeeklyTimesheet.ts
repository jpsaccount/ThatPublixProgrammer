import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { Moment } from "moment/moment";

@EntityType("0fa95b00-7db5-4e9e-814c-c82e008f47c7")
export class WeeklyTimesheet extends Entity {
  WeekOfDateTime: Moment;
  WeekOf: string = "";
}
