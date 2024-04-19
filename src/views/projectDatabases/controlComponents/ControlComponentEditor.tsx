import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { ControlComponent } from "@/sdk/entities/project/equipment/ControlComponent";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import React from "react";

interface Props {
  controlComponent: ControlComponent;
  onChange: (newProps: Partial<ControlComponent>) => void;
}

const ControlComponentEditor = ({ controlComponent, onChange }: Props) => {
  const manufacturerRequest = useDbQuery(ControlComponent);

  if (!controlComponent) {
    return null;
  }

  return (
    <div>
      <PolRequestPresenter
        request={manufacturerRequest}
        onSuccess={() => (
          <PolEntityDropdown
            label="Manufacturer"
            className="w-full"
            selectedId={controlComponent.ProjectManufacturerId}
            options={manufacturerRequest.data}
            onValueChanged={(x) => onChange({ ProjectManufacturerId: x.id })}
            nameGetter={(x) => x.Model}
          ></PolEntityDropdown>
        )}
      ></PolRequestPresenter>
      <PolInput
        label="Model Number"
        value={controlComponent.Model}
        onValueChanged={(e) => onChange({ Model: e })}
      ></PolInput>
      <PolInput label="Model" value={controlComponent.Model} onValueChanged={(e) => onChange({ Model: e })}></PolInput>
      <PolInput
        label="Description"
        value={controlComponent.Description}
        onValueChanged={(e) => onChange({ Description: e })}
      ></PolInput>
      <PolInput label="Title" value={controlComponent.Title} onValueChanged={(e) => onChange({ Title: e })}></PolInput>
      <PolInput label="Notes" value={controlComponent.Notes} onValueChanged={(e) => onChange({ Notes: e })}></PolInput>
      <PolInput
        label="Private Notes"
        value={controlComponent.InternalNotes}
        onValueChanged={(e) => onChange({ InternalNotes: e })}
      ></PolInput>
      <div className="flex items-end justify-between gap-4">
        <PolInput
          containerClassName="w-24"
          value={controlComponent.WeightLb}
          label="Weight (lb)"
          onValueChanged={(e) => onChange({ WeightLb: e })}
        ></PolInput>
        <PolInput
          containerClassName="w-24"
          value={controlComponent.CostUsd}
          label="Cost"
          onValueChanged={(e) => onChange({ CostUsd: e })}
        ></PolInput>
        <PolCheckbox
          className="mb-3"
          value={controlComponent.IsCostEstimated}
          onValueChanged={(x) => onChange({ IsCostEstimated: x })}
        >
          Is Cost Estimated
        </PolCheckbox>
      </div>
    </div>
  );
};

export default ControlComponentEditor;
