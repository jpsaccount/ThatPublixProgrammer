import { ChildEntity } from "@/sdk/contracts/ChildEntity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";
import { SubscriptionStatus } from "../enums/SubscriptionStatus";

@EntityType("fb4ba7ec-1d9f-43aa-8307-8c707843bab2")
export class Subscription extends ChildEntity {
  SubscriptionId: string = "";
  Status: SubscriptionStatus;
  AccessKey: string = "";
}
