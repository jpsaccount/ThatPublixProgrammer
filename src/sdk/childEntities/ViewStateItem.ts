import { ChildEntity } from "../contracts/ChildEntity";
import { ViewState } from "../enums/ViewState";
import { EntityType } from "../sdkconfig/EntityTypeId";

@EntityType("d8c7503c-d9ce-41f9-9a75-c1aa8e08d3a0")
export class ViewStateItem extends ChildEntity {
  State: ViewState;
  EntityId: string;
}
