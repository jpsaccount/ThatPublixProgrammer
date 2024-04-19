import { EntityType } from "../../sdkconfig/EntityTypeId";
import { Entity } from "../../contracts/Entity";
import { PublicAccessType } from "../../enums/PublicAccessType";

@EntityType("6c2aadde-4ef3-46b4-980d-269b43688c71")
export class FixtureCatalog extends Entity {
  Title: string;
  Description: string;
  UserId: string;
  PublicAccessType: PublicAccessType;
  UserIds: Set<string>;
}
