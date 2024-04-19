import { Entity } from "@/sdk/contracts/Entity";
import { Access } from "@/sdk/enums/Access";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("3be50326-61f6-4f3b-85e5-9f300feb90b8")
export class PunchListAccess extends Entity {
  PunchListId: string;
  UserId: string;
  Access: Access;
}
