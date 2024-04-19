import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("0676a5f2-50f2-47f8-be32-ee8f29ce8d5b")
export class RevitImport extends Entity {
  ProjectDatabaseId: string;
  RevitProjectId: string;
  ChangesCount: number;
}
