import { Entity } from "../../contracts/Entity";
import { EntityType } from "../../sdkconfig/EntityTypeId";

@EntityType("90a32288-106f-48ee-ba9c-3d5d0185a573")
export class PhaseActivityBucket extends Entity {
  IsCore: boolean;
  Title: string = "";
  Description: string = "";
  CorePhaseActivityBucketId: string = "";
}
