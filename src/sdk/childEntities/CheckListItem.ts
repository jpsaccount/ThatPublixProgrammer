import { ChildEntity } from "../contracts/ChildEntity";
import { EntityType } from "../sdkconfig/EntityTypeId";

@EntityType("1880589e-ef73-4b10-8b39-60363e20d1fc")
export class CheckListItem extends ChildEntity {
  IsChecked: boolean;
  Title: string;
}
