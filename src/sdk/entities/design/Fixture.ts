import { EntityType } from "../../sdkconfig/EntityTypeId";
import { AttachmentEntity, Entity } from "../../contracts/Entity";
import { Moment } from "moment/moment";

@EntityType("8f97208b-864b-400e-a469-238e0ec73dd7")
export class Fixture extends AttachmentEntity {
  Name: string;
  Description: string;
  ManufacturerName: string;
  Url: string;
  Tags: Set<string>;
  Categories: Set<string>;
  ViewCount: bigint;
  IsActiveLink: boolean;
  LinkLastChecked: Moment;
  IsInFavorites: boolean;
}
