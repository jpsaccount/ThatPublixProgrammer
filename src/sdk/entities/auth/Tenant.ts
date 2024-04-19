import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";
import { Subscription } from "../../childEntities/Subscription";

@EntityType("c06e9f9e-3963-4343-8256-eecfd73900a4")
export class Tenant extends Entity {
  Name: string = "";
  Description: string = "";
  Subscriptions: Subscription[];
}
