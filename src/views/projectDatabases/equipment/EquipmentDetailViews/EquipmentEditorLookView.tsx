import { LabelSection } from "@/components/LabelSection/LabelSection";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolInput from "@/components/polComponents/PolInput";
import React from "react";
import { EquipmentEditorViewsProps } from "../EquipmentEditorView";
import PolHeading from "@/components/polComponents/PolHeading";
import { UnitOfMass, Weight } from "@/sdk/entities/project/equipment/Weight";
import { Measurement } from "@/sdk/entities/project/equipment/Measurement";
import { UnitOfMeasurement } from "@/sdk/entities/project/equipment/UnitOfMeasurement";
import { Dimension } from "@/sdk/entities/project/equipment/Dimension";

export default function EquipmentEditorLookView({ equipment, onChange, update }: EquipmentEditorViewsProps) {
  function updateWeight(unit: UnitOfMass, updates: Partial<Weight>) {
    update((x) => {
      let weight = x.Measurement.Weights.find((x) => x.Unit === unit) ?? new Weight();
      weight = { ...weight, ...updates, Unit: unit };
      return {
        ...x,
        Measurement: { ...x.Measurement, Weights: [...x.Measurement.Weights.filter((x) => x.Unit != unit), weight] },
      };
    });
  }

  function updateDimensions(unit: UnitOfMeasurement, updates: Partial<Dimension>) {
    update((x) => {
      let dimensions = x.Measurement.Dimensions.find((x) => x.UnitOfMeasurement === unit) ?? new Dimension();
      dimensions = { ...dimensions, ...updates, UnitOfMeasurement: unit };
      return {
        ...x,
        Measurement: {
          ...x.Measurement,
          Dimensions: [...x.Measurement.Dimensions.filter((x) => x.UnitOfMeasurement != unit), dimensions],
        },
      };
    });
  }
  return (
    <>
      <div className="grid grid-flow-row space-y-2 p-2 md:p-5">
        <PolHeading size={4}>Look</PolHeading>
        <div className="flex flex-row flex-wrap gap-5">
          <PolInput
            valueChangeOn="blur"
            type="text"
            label="Finish"
            value={equipment.Finish}
            onValueChanged={(e) => onChange({ Finish: e })}
          ></PolInput>
          <PolInput
            valueChangeOn="blur"
            type="text"
            label="Shade"
            value={equipment.Shade}
            onValueChanged={(e) => onChange({ Shade: e })}
          ></PolInput>
          <PolInput
            valueChangeOn="blur"
            type="text"
            label="Shade Material"
            value={equipment.ShadeMaterial}
            onValueChanged={(e) => onChange({ ShadeMaterial: e })}
          ></PolInput>
        </div>
        <div className=" flex flex-col gap-5 md:flex-row">
          <PolInput
            valueChangeOn="blur"
            type="text"
            label="Light Source"
            value={equipment.LightSource}
            onValueChanged={(e) => onChange({ LightSource: e })}
          ></PolInput>
          <div className="flex items-end gap-2">
            <PolInput
              valueChangeOn="blur"
              type="text"
              label="Color Temp"
              value={equipment.ColorTempStart}
              onValueChanged={(e) => onChange({ ColorTempStart: e })}
            ></PolInput>
            <p className="mb-3">-</p>
            <PolInput
              valueChangeOn="blur"
              type="text"
              onValueChanged={(e) => onChange({ ColorTempEnd: e })}
              value={equipment.ColorTempEnd}
            ></PolInput>
          </div>
        </div>
        <hr className="my-5" />
        <PolHeading size={4}>Dimensions</PolHeading>
        <div className="flex">
          <div className="flex w-fit gap-4 border-r pr-4">
            <LabelSection label="Height">
              <div className="mt-2 flex flex-col gap-3">
                <PolInput
                  className="w-16"
                  type="text"
                  onValueChanged={(e) => updateDimensions(UnitOfMeasurement.Inches, { Height: e })}
                  value={
                    equipment.Measurement.Dimensions.find((x) => x.UnitOfMeasurement == UnitOfMeasurement.Inches)
                      ?.Height
                  }
                ></PolInput>
                <PolInput
                  className="w-16"
                  type="text"
                  onValueChanged={(e) => updateDimensions(UnitOfMeasurement.Milimeters, { Height: e })}
                  value={
                    equipment.Measurement.Dimensions.find((x) => x.UnitOfMeasurement == UnitOfMeasurement.Milimeters)
                      ?.Height
                  }
                ></PolInput>
              </div>
            </LabelSection>
            <LabelSection label="Width">
              <div className="mt-2 flex flex-col gap-3">
                <PolInput
                  className="w-16"
                  type="text"
                  onValueChanged={(e) => updateDimensions(UnitOfMeasurement.Inches, { Width: e })}
                  value={
                    equipment.Measurement.Dimensions.find((x) => x.UnitOfMeasurement == UnitOfMeasurement.Inches)?.Width
                  }
                ></PolInput>
                <PolInput
                  className="w-16"
                  type="text"
                  onValueChanged={(e) => updateDimensions(UnitOfMeasurement.Milimeters, { Width: e })}
                  value={
                    equipment.Measurement.Dimensions.find((x) => x.UnitOfMeasurement == UnitOfMeasurement.Milimeters)
                      ?.Width
                  }
                ></PolInput>
              </div>
            </LabelSection>
            <LabelSection label="Depth">
              <div className="mt-2 flex flex-col gap-3">
                <PolInput
                  className="w-16"
                  type="text"
                  onValueChanged={(e) => updateDimensions(UnitOfMeasurement.Inches, { Depth: e })}
                  value={
                    equipment.Measurement.Dimensions.find((x) => x.UnitOfMeasurement == UnitOfMeasurement.Inches)?.Depth
                  }
                ></PolInput>
                <PolInput
                  className="w-16"
                  type="text"
                  onValueChanged={(e) => updateDimensions(UnitOfMeasurement.Milimeters, { Depth: e })}
                  value={
                    equipment.Measurement.Dimensions.find((x) => x.UnitOfMeasurement == UnitOfMeasurement.Milimeters)
                      ?.Depth
                  }
                ></PolInput>
              </div>
            </LabelSection>
          </div>
          <div className="flex ps-4">
            <LabelSection label="Weight">
              <div className="mt-2 flex flex-col gap-3">
                <PolInput
                  className="w-16"
                  type="text"
                  onValueChanged={(e) => updateWeight(UnitOfMass.Pounds, { Value: e })}
                  value={equipment.Measurement.Weights.find((x) => x.Unit == UnitOfMass.Pounds)?.Value}
                ></PolInput>
                <PolInput
                  className="w-16"
                  type="text"
                  onValueChanged={(e) => updateWeight(UnitOfMass.Kilograms, { Value: e })}
                  value={equipment.Measurement.Weights.find((x) => x.Unit == UnitOfMass.Kilograms)?.Value}
                ></PolInput>
              </div>
            </LabelSection>
          </div>
        </div>
      </div>
    </>
  );
}
