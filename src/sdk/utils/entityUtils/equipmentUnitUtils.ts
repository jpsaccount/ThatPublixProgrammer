import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { isNullOrWhitespace } from "../stringUtils";
import { isUsable } from "../usabilityUtils";

export function toEquipmentUnitTitle(unit: LightingFixtureUnit): string {
  let title = unit?.UnitNumber?.toString();
  if (isUsable(title) === false) return "";
  if (unit.UnitNumberIndex > 0) {
    title += `.${unit.UnitNumberIndex}`;
  }
  title += unit.UnitLetterIndex;
  return title;
}

export function getFullPurpose(unit: LightingFixtureUnit): string {
  let purpose = unit?.Purpose ?? "";

  if (isNullOrWhitespace(unit.SubPurpose) === false) {
    purpose += ` (${unit.SubPurpose})`;
  }
  return purpose;
}
