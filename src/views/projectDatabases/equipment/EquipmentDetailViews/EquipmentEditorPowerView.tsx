import { LabelSection } from "@/components/LabelSection/LabelSection";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolInput from "@/components/polComponents/PolInput";
import React from "react";
import { EquipmentEditorViewsProps } from "../EquipmentEditorView";
import PolHeading from "@/components/polComponents/PolHeading";

export default function EquipmentEditorPowerView({ equipment, onChange, update }: EquipmentEditorViewsProps) {
  return (
    <div className="grid grid-flow-row gap-5 space-y-2 p-2 md:p-5">
      <PolHeading size={4}>Power</PolHeading>

      <div className="flex gap-6">
        <PolCheckbox value={equipment.HasPower} onValueChanged={(x) => onChange({ HasPower: x })}>
          Has Power
        </PolCheckbox>
        <PolCheckbox value={equipment.IsDimmable} onValueChanged={(x) => onChange({ IsDimmable: x })}>
          Dimmable
        </PolCheckbox>
      </div>
      <div className="flex gap-4">
        <PolInput
          type="text"
          label="Voltage"
          value={equipment.Voltage}
          onValueChanged={(e) => onChange({ Voltage: e })}
        ></PolInput>
        <PolInput
          type="text"
          label="Total Load (watts)"
          value={equipment.Watts}
          onValueChanged={(e) => onChange({ Watts: e })}
        ></PolInput>
        <PolInput
          type="text"
          label="Power Thru"
          value={equipment.VoltageThru}
          onValueChanged={(e) => onChange({ VoltageThru: e })}
        ></PolInput>
      </div>
      <div className="flex gap-4">
        <PolCheckbox value={equipment.IsAC} onValueChanged={(x) => onChange({ IsAC: x })}>
          AC
        </PolCheckbox>
        <PolCheckbox value={equipment.IsAC === false} onValueChanged={(x) => onChange({ IsAC: x === false })}>
          DC
        </PolCheckbox>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <PolInput
              containerClassName="w-24"
              value={equipment.LampConfiguration.Lamp1Qty}
              type="text"
              label="Lamp 1 qty"
              onValueChanged={(e) =>
                onChange({
                  LampConfiguration: {
                    ...equipment.LampConfiguration,
                    Lamp1Qty: e,
                  },
                })
              }
            ></PolInput>
            <PolCheckbox
              value={equipment.LampConfiguration.IsLamp1Inc}
              onValueChanged={(x) =>
                onChange({
                  LampConfiguration: {
                    ...equipment.LampConfiguration,
                    IsLamp1Inc: x,
                  },
                })
              }
            >
              Included
            </PolCheckbox>
          </div>
          <div className="flex flex-col gap-2">
            <PolInput
              containerClassName="w-24"
              value={equipment.LampConfiguration.Lamp2Qty}
              type="text"
              label="Lamp 2 qty"
              onValueChanged={(e) =>
                onChange({
                  LampConfiguration: {
                    ...equipment.LampConfiguration,
                    Lamp2Qty: e,
                  },
                })
              }
            ></PolInput>
            <PolCheckbox
              value={equipment.LampConfiguration.IsLamp2Inc}
              onValueChanged={(x) =>
                onChange({
                  LampConfiguration: {
                    ...equipment.LampConfiguration,
                    IsLamp2Inc: x,
                  },
                })
              }
            >
              Included
            </PolCheckbox>
          </div>
        </div>
        {/* <LabelSection label="Power Type">
          <div className="flex h-fit items-center">
            <PolCheckbox className="border border-zinc-400 bg-zinc-100 p-3" value={false} onValueChanged={(x) => {}}>
              DIM
            </PolCheckbox>
            <PolCheckbox
              className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
              value={false}
              onValueChanged={(x) => {}}
            >
              ND
            </PolCheckbox>
            <PolCheckbox
              className="border-b border-r border-t  border-zinc-400 bg-zinc-100 p-3"
              value={false}
              onValueChanged={(x) => {}}
            >
              ELV
            </PolCheckbox>
            <PolCheckbox
              className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
              value={false}
              onValueChanged={(x) => {}}
            >
              PASS
            </PolCheckbox>
            <PolCheckbox
              className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
              value={false}
              onValueChanged={(x) => {}}
            >
              TBD
            </PolCheckbox>
          </div>
        </LabelSection> */}
      </div>
    </div>
  );
}
