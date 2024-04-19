import { ChildEntity } from "../contracts/ChildEntity";
import { EntityType } from "../sdkconfig/EntityTypeId";

@EntityType("0e228f40-7d42-420b-a951-9be89120f82e")
export class PunchListItemAssignment extends ChildEntity {
  AssignedToUserId: string;
  AssignedByUserId: string;
}
