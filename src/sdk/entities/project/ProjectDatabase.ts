import { ChildEntity } from "@/sdk/contracts/ChildEntity";
import { Entity } from "@/sdk/contracts/Entity";
import { EntityType } from "@/sdk/sdkconfig/EntityTypeId";

@EntityType("085E78F3-4760-46D7-BC18-7A43F79FB9BA")
export class ProjectDatabase extends Entity {
  Name: string = "";
  Description: string = "";
  EquipmentTypeGroups: string[] = [];
  ControlHttpAddress: string = "";
  DocumentLogoId: string = "";
  ClientDocumentLogoId: string = "";
  AssignedParameters: ExcelParameterMap[] = [];
}

export class ExcelParameterMap extends ChildEntity {
  ExcelParameter: string = "";
  PropertyName: string = "";
}
