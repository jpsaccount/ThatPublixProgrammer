import { AttachmentEntity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("18b0663f-a284-4a9c-ad34-0e5bc664ee02")
export class Lamp extends AttachmentEntity {
  Model: string = "";
  Watts: number;
  Volts: number;
  Notes: string = "";
  Description: string = "";
  ColorTemp: number;
  BeamAngle: number;
  Base: string = "";
  LifeSpanInHours: number;
  CostUsd: number;
  IsCostEstimated: boolean;
  Lumens: number;
  Finish: string = "";
  ProjectManufacturerId: string = "";
  TypeId: string = "";
  CurrentListings: string[];
}
