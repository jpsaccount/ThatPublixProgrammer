import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("76f68b1b-b66b-49b9-9d80-8b33ff21e870")
export class TenantUserAccess extends Entity {
  UserId: string = "";
  Access: string[] = [];
}
