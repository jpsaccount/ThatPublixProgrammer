import { ChildEntity } from "../contracts/ChildEntity";
import { EntityType } from "../sdkconfig/EntityTypeId";
@EntityType("c1827206-7ad9-40b4-a1cb-9fab8275cc8d")
export class TaggedEntity extends ChildEntity {
  EntityId: string = "";
  EntityTypeId: string = "";
}
