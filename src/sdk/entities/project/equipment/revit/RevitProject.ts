import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("d0bf7999-9d5a-422c-899e-b63d4fac0a02")
export class RevitProject extends Entity {
  Name: string;
  RevitProjectId: string;
}
