import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { Moment } from "moment/moment";

@EntityType("138a868d-764c-4cb5-847d-b9f892b94148")
export class GlobalExpenseReport extends Entity {
  Description: string = "";
  EndDate: Moment;
  StartDate: Moment;
  Title: string = "";
  DefaultWorkingPhaseId: string = "";
  ProjectId: string = "";
}
