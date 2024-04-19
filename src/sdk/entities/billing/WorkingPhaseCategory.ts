import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("dd2f35eb-cedc-4f39-a1e2-1e4990318e05")
export class WorkingPhaseCategory extends Entity {
  Title: string = "";
  Description: string = "";
  OrderHint: string = "";
  ProjectId: string = "";
}
