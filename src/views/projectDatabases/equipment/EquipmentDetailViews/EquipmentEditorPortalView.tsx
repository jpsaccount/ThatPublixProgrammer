import React from "react";
import { EquipmentEditorViewsProps } from "../EquipmentEditorView";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolHeading from "@/components/polComponents/PolHeading";
import { cn } from "@/lib/utils";
import PolText from "@/components/polComponents/PolText";
import PolSwitch from "@/components/polComponents/PolSwitch";
import { PolDatePicker } from "@/components/polComponents/PolDatePicker";

const fullwidth = "w-[calc(100dvw-25px)] md:w-auto";

const switchClass = cn(
  "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
  "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent h-full",
  "data-[selected=true]:border-primary",
);
export default function EquipmentEditorPortalView({
  equipment,
  onChange,
  update,
  lastChangedBy,
}: EquipmentEditorViewsProps) {
  const manufacturerRequest = useDbQuery(Manufacturer, `ORDER BY c.Name ASC`);

  return (
    <div className="grid grid-flow-row space-y-2 p-2 md:p-5">
      <PolHeading size={4}>Details</PolHeading>
      <div className="flex flex-row flex-wrap ">
        <PolEntityDropdown
          containerClassName="md:mr-5"
          className={cn(" md:min-w-64", fullwidth)}
          label="Manufacturer"
          optionsRequest={manufacturerRequest}
          selectedId={equipment.ManufacturerId}
          onValueChanged={(x) => onChange({ ManufacturerId: x.id })}
          nameGetter={(x) => x.Name}
        ></PolEntityDropdown>
        <PolInput
          containerClassName="md:mr-5"
          className={cn(" md:min-w-64", fullwidth)}
          valueChangeOn="blur"
          type="text"
          value={equipment.Model}
          label="Model"
          onValueChanged={(e) => {
            onChange({ Model: e });
          }}
        ></PolInput>
        <PolInput
          containerClassName="md:mr-5"
          className={cn(" md:min-w-64", fullwidth)}
          valueChangeOn="blur"
          type="text"
          value={equipment.Nickname}
          label="Display Name"
          onValueChanged={(e) => {
            onChange({ Nickname: e });
          }}
        ></PolInput>

        <PolDatePicker
          label="Creation Date"
          value={equipment.CreationDate}
          onValueChanged={(e) => onChange({ CreationDate: e })}
        />
      </div>

      <PolInput
        containerClassName="w-fit md:min-w-[50dvw]"
        valueChangeOn="blur"
        type="text"
        value={equipment.Description}
        label="Description"
        onValueChanged={(e) => {
          onChange({ Description: e });
        }}
      ></PolInput>

      <PolSwitch
        value={equipment.IsInactive === false}
        onValueChanged={(e) => onChange({ IsInactive: !e })}
        className={switchClass}
      >
        <PolText>Active</PolText>
        <PolText type="muted">
          When inactive, fixture will be accessible on previous projects but not appear in active projects.
        </PolText>
      </PolSwitch>

      <hr className="my-2" />

      <PolHeading size={4}>Automation</PolHeading>

      <div className="flex flex-col gap-3  md:flex-row">
        <PolSwitch value={equipment.IsCustom} onValueChanged={(e) => onChange({ IsCustom: e })} className={switchClass}>
          <PolText>Is custom</PolText>
          <PolText type="muted">As the developer, I'm not sure what this is supposed to do.</PolText>
        </PolSwitch>

        <PolSwitch
          value={equipment.CanTakeFilter}
          onValueChanged={(e) => onChange({ CanTakeFilter: e })}
          className={switchClass}
        >
          <PolText>Can take filter</PolText>
          <PolText type="muted">
            When displaying filter, "None" will show if fixture does not have a filter selected and can take one. If
            fixture cannot take a filter, it will always display as "-"
          </PolText>
        </PolSwitch>

        <PolSwitch
          value={equipment.CanTakeGobo}
          onValueChanged={(e) => onChange({ CanTakeGobo: e })}
          className={switchClass}
        >
          <PolText>Can take pattern</PolText>
          <PolText type="muted">
            When displaying patterns, "None" will show if fixture does not have a pattern selected and can take one. If
            fixture cannot take a pattern, it will always display as "-"
          </PolText>
        </PolSwitch>
      </div>
    </div>
  );
}

interface ListingCheckBoxProps extends EquipmentEditorViewsProps {
  listing: string;
}

function ListingCheckBox({ equipment, onChange, listing, update }: ListingCheckBoxProps) {
  return (
    <PolCheckbox
      className="border border-zinc-400 bg-zinc-100"
      value={equipment.CurrentListings.includes(listing)}
      onValueChanged={(x) => {
        update((pre) => ({
          ...pre,
          CurrentListings: x
            ? Array.from(new Set(pre.CurrentListings).add(listing))
            : [...pre.CurrentListings.filter((x) => x != listing)],
        }));
      }}
    >
      {listing}
    </PolCheckbox>
  );
}
