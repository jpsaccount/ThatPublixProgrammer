import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { Moment } from "moment/moment";

@EntityType("2535c4f1-29b1-4671-9b0f-cf4a745cf413")
export class UserTimesheet extends Entity {
  WeeklyTimesheetId: string = "";
  UserId: string = "";
  CertifiedDateTime: Moment;
}
