import { ChildEntity } from "@/sdk/contracts/ChildEntity";

export class EquipmentControl extends ChildEntity {
  IsUsingDmx: boolean;
  DMXUniverse: string = "";
  DMXAddress: string = "";
  Type: ControlType;
}

export enum ControlType {
  Unknown,
  DMX,
  ACN,
  ArtNet,
  None,
  DMXPT = 8,
  PWR,
  SA,
  KiNET,
  ZTTV,
}
export function parseStringToControlTypeEnum(value: string): ControlType | undefined {
  // Check if the value is a string literal in the enum
  if (value in ControlType) {
    return ControlType[value as keyof typeof ControlType];
  }

  // Check if the value is a numeric literal in the enum
  const numericValue = parseInt(value, 10);
  if (!isNaN(numericValue) && Object.values(ControlType).includes(numericValue as any)) {
    return numericValue as ControlType;
  }

  return undefined;
}
