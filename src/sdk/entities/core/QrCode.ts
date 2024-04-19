import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("fc5b042c-b27b-4c71-843d-9fe381c67654")
export class QrCode extends Entity {
  Title: string = "";
  Url: string = "";
}
