import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Lamp } from "@/sdk/entities/project/equipment/Lamp";
import { LampConfiguration } from "@/sdk/entities/project/equipment/LampConfiguration";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";

interface Props {
  lamp: Lamp;
  onChange: (newProps: Partial<Lamp>) => void;
}

const LampEditor = ({ lamp, onChange }: Props) => {
  const manufacturerRequest = useDbQuery(Manufacturer);
  const handleCheckboxChange = (listing, isChecked) => {
    const updatedListings = isChecked
      ? [...lamp.CurrentListings, listing]
      : lamp.CurrentListings.filter((item) => item !== listing);

    onChange({ CurrentListings: updatedListings });
  };
  return (
    <>
      <PolEntityDropdown
        label="Manufacturer"
        className="w-full"
        selectedId={lamp.ProjectManufacturerId}
        options={manufacturerRequest.data}
        onValueChanged={(x) => onChange({ ProjectManufacturerId: x.id })}
        nameGetter={(x) => x.Name}
      ></PolEntityDropdown>
      <PolInput label="Model" value={lamp.Model} onValueChanged={(x) => onChange({ Model: x })}></PolInput>
      <PolInput
        label="Description"
        value={lamp.Description}
        onValueChanged={(x) => onChange({ Description: x })}
      ></PolInput>
      <PolInput label="Finish" value={lamp.Finish} onValueChanged={(x) => onChange({ Finish: x })}></PolInput>
      <PolInput label="Notes" value={lamp.Notes} onValueChanged={(x) => onChange({ Notes: x })}></PolInput>
      <div className="my-4 w-full  border-b"></div>
      <div className="flex gap-4">
        <div className="flex flex-col">
          <PolInput
            containerClassName="w-48"
            onValueChanged={(x) => onChange({ Watts: x })}
            value={lamp.Watts}
            label="Watts"
          ></PolInput>
          <PolInput
            containerClassName="w-48"
            onValueChanged={(x) => onChange({ Volts: x })}
            value={lamp.Volts}
            label="Volts"
          ></PolInput>
          <PolInput
            containerClassName="w-48"
            onValueChanged={(x) => onChange({ ColorTemp: x })}
            value={lamp.ColorTemp}
            label="Color Temp(K)"
          ></PolInput>
        </div>
        <div className="flex flex-col">
          <PolInput
            containerClassName="w-48"
            onValueChanged={(x) => onChange({ Lumens: x })}
            value={lamp.Lumens}
            label="Lumens"
          ></PolInput>
          <PolInput
            containerClassName="w-48"
            onValueChanged={(x) => onChange({ BeamAngle: x })}
            value={lamp.BeamAngle}
            label="Beam Angle(Degrees)"
          ></PolInput>
          <PolInput
            containerClassName="w-48"
            onValueChanged={(x) => onChange({ CostUsd: x })}
            value={lamp.CostUsd}
            label="Cost"
          ></PolInput>
        </div>
        <div className="flex flex-col">
          <PolInput
            containerClassName="w-48"
            onValueChanged={(x) => onChange({ LifeSpanInHours: x })}
            value={lamp.LifeSpanInHours}
            label="Life Span(Hours)"
          ></PolInput>
          <PolInput
            containerClassName="w-48"
            onValueChanged={(x) => onChange({ Base: x })}
            value={lamp.Base}
            label="Base"
          ></PolInput>
          {/* <PolInput
            type="date"
            containerClassName=" w-48"
            onValueChanged={(x) => onChange({ CreatedDateTime: x })}
            value={lamp.CreatedDateTime.toLocaleString()}
            label="Date"
          ></PolInput> */}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        {/* <PolCheckbox
          onValueChanged={(isChecked) => handleCheckboxChange("CE", isChecked)}
          isChecked={lamp.CurrentListings.includes("CE")}
        >
          CE
        </PolCheckbox>
        <PolCheckbox
          onValueChanged={(isChecked) => handleCheckboxChange("UL", isChecked)}
          isChecked={lamp.CurrentListings.includes("UL")}
        >
          UL
        </PolCheckbox>
        <PolCheckbox
          onValueChanged={(isChecked) => handleCheckboxChange("ETL", isChecked)}
          isChecked={lamp.CurrentListings.includes("ETL")}
        >
          ETL
        </PolCheckbox> */}
        <PolCheckbox value={lamp.IsCostEstimated} onValueChanged={(x) => onChange({ IsCostEstimated: x })}>
          Is Cost Estimated
        </PolCheckbox>
      </div>
    </>
  );
};

export default LampEditor;
