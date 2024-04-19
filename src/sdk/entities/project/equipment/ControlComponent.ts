import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("f5272466-560c-4dc7-a1a1-6a5f8707f4b7")
export class ControlComponent extends Entity {
  Model: string = "";
  Title: string = "";
  Description: string = "";
  Notes: string = "";
  InternalNotes: string = "";
  CostUsd: number;
  IsCostEstimated: boolean;
  WeightLb: number;
  HeightInRackUnit: number;
  ProjectManufacturerId: string = "";
}
