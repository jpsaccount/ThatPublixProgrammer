import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";
import { NotificationType } from "../../enums/NotificationType";

@EntityType("61463721-f8b6-483f-a89a-8150aa4dd890")
export class NotificationGroupUser extends Entity {
  Topic: string;
  UserId: string;
  Type: NotificationType;
}
