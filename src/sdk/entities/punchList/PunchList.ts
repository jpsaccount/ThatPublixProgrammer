import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("82acb8cb-70ca-4e8b-b869-9b00f43cfd0a")
export class PunchList extends Entity {
  OrderHint: string;
  Title: string;
  Description: string;
  ProjectDatabaseId: string;
}
