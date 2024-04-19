import { ViewStateItem } from "@/sdk/childEntities/ViewStateItem";
import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("a76b8924-8398-471e-98d1-33c8b193118b")
export class PunchListUserSettings extends Entity {
  ProjectDatabaseId: string;
  UserId: string;
  PunchListStates: ViewStateItem[];
  PunchListeItemStates: ViewStateItem[];
}
