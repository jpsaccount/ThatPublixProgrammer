import React from "react";
import { EquipmentEditorViewsProps } from "../EquipmentEditorView";
import { LabelSection } from "@/components/LabelSection/LabelSection";
import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolInput from "@/components/polComponents/PolInput";
import PolHeading from "@/components/polComponents/PolHeading";

export default function EquipmentEditorDataView({ equipment, onChange, update }: EquipmentEditorViewsProps) {
  return (
    <div className="grid grid-flow-row space-y-2 p-2 md:p-5">
      <PolHeading size={4}>Data</PolHeading>

      <div className="flex gap-4">
        <PolCheckbox value={equipment.HasData} onValueChanged={(x) => onChange({ HasData: x })}>
          Has Data
        </PolCheckbox>
        {/* <PolCheckbox value={false} onValueChanged={() => {}}>
          This Device Holds Addressing
        </PolCheckbox> */}
      </div>
      {/* <div className="flex items-end gap-4">
        <PolInput
          containerClassName="w-full"
          value={""}
          type="text"
          label="Preferred Settings"
          onValueChanged={(x) => {}}
        ></PolInput>
        <PolButton>Highlight Settings</PolButton>
      </div> */}
      {/* <div>
        <LabelSection label="Control">
          <div className="flex flex-col">
            <div className="flex">
              <PolCheckbox
                className="border border-zinc-400 bg-zinc-100 p-3"
                value={equipment.HasData}
                onValueChanged={(x) => onChange({ HasData: x })}
              >
                PWR
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
                value={false}
                onValueChanged={() => {}}
              >
                DMX
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
                value={equipment.HasData}
                onValueChanged={(x) => onChange({ HasData: x })}
              >
                sACN
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
                value={false}
                onValueChanged={() => {}}
              >
                Art-Net
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
                value={equipment.HasData}
                onValueChanged={(x) => onChange({ HasData: x })}
              >
                0-10V
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
                value={false}
                onValueChanged={() => {}}
              >
                SPI
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
                value={equipment.HasData}
                onValueChanged={(x) => onChange({ HasData: x })}
              >
                DALI
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
                value={false}
                onValueChanged={() => {}}
              >
                KiNET
              </PolCheckbox>
            </div>
            <div className="flex">
              <PolCheckbox
                className="border-b border-l border-r border-zinc-400 bg-zinc-100 p-3"
                value={equipment.HasData}
                onValueChanged={(x) => onChange({ HasData: x })}
              >
                PWM
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-zinc-400 bg-zinc-100 p-3"
                value={false}
                onValueChanged={() => {}}
              >
                PASS
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-zinc-400 bg-zinc-100 p-3"
                value={equipment.HasData}
                onValueChanged={(x) => onChange({ HasData: x })}
              >
                PLC
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-zinc-400 bg-zinc-100 p-3"
                value={false}
                onValueChanged={() => {}}
              >
                WIFI
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-zinc-400 bg-zinc-100 p-3"
                value={equipment.HasData}
                onValueChanged={(x) => onChange({ HasData: x })}
              >
                OS/VS
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-zinc-400 bg-zinc-100 p-3"
                value={false}
                onValueChanged={() => {}}
              >
                PS
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-zinc-400 bg-zinc-100 p-3"
                value={equipment.HasData}
                onValueChanged={(x) => onChange({ HasData: x })}
              >
                W-DMX
              </PolCheckbox>
            </div>
          </div>
        </LabelSection>
      </div> */}
      {/* <LabelSection label="Data Connection">
        <div className="flex">
          <PolCheckbox
            className="border border-zinc-400 bg-zinc-100 p-3"
            value={equipment.Connector}
            onValueChanged={(x) => onChange({ HasData: x })}
          >
            -
          </PolCheckbox>
          <PolCheckbox
            className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
            value={false}
            onValueChanged={() => {}}
          >
            Integral
          </PolCheckbox>
          <PolCheckbox
            className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
            value={false}
            onValueChanged={() => {}}
          >
            3-pin
          </PolCheckbox>
          <PolCheckbox
            className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
            value={false}
            onValueChanged={() => {}}
          >
            4-pin
          </PolCheckbox>
          <PolCheckbox
            className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
            value={false}
            onValueChanged={() => {}}
          >
            5-pin
          </PolCheckbox>
          <PolCheckbox
            className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
            value={false}
            onValueChanged={() => {}}
          >
            RJ45
          </PolCheckbox>
        </div>
      </LabelSection> */}
    </div>
  );
}
