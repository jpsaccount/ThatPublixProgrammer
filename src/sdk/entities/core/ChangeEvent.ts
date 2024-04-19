import { ChildEntity } from "@/sdk/contracts/ChildEntity";
import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";
import { Moment } from "moment";

@EntityType("ca487cba-d368-4b8d-a1c3-4c8f913488b1")
export class ChangeEvent extends Entity {
  Description: string = "";
  EntityData: EntityData = new EntityData();
  DeviceInfo: DeviceInfo = new DeviceInfo();
  Changes: ChangeLog[] = new Array<ChangeLog>();
  EventByUserId: string;
  EventDateTime: Moment;
}

@EntityType("17afbfc4-2bc2-4910-9d70-6f03e0fce5b4")
export class EntityData extends ChildEntity {
  TypeId: string;
  EntityId: string;
  SyncToken: string;
}

@EntityType("0d49f0e7-8b46-42ef-b014-ec5908ddf79f")
export class DeviceInfo extends ChildEntity {
  Name: string;
  IpAddress: string;
  MacAddress: string;
  UserAgent: string;
}

@EntityType("528d12af-cb2c-4d3a-b871-7ccc282fa77d")
export class ChangeLog extends ChildEntity {
  PropertyChangedName: string;
  NewValue: any;
  PreviousValue: any;
}
