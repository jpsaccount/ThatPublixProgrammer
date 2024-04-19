import { LabelSection } from "@/components/LabelSection/LabelSection";
import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolInput from "@/components/polComponents/PolInput";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { EquipmentEditorViewsProps } from "./EquipmentEditorView";

interface Props {
  equipment: LightingFixture;
  onChange: (newProps: Partial<LightingFixture>) => void;
}

const EquipmentEditorPageTwo = ({ equipment, onChange }: EquipmentEditorViewsProps) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="relative flex flex-col gap-4 border-t px-4 py-10">
          <div
            style={{
              position: "absolute",
              top: "0%",
              right: "50%",
              transform: "translateY(-50%) translateX(50%)",
            }}
            className=" border bg-background-950 px-5 py-1"
          >
            Power
          </div>
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
            <div className="flex h-1/4 w-[231px] items-end">
              <PolCheckbox className="border border-zinc-400 bg-zinc-100 p-3" value={false} onValueChanged={(x) => {}}>
                AC
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
                value={false}
                onValueChanged={(x) => {}}
              >
                DC
              </PolCheckbox>
            </div>
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
            <LabelSection label="Power Type">
              <div className="flex h-fit items-center">
                <PolCheckbox
                  className="border border-zinc-400 bg-zinc-100 p-3"
                  value={false}
                  onValueChanged={(x) => {}}
                >
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
            </LabelSection>
          </div>
        </div>
        <div className="relative flex flex-col gap-6 border-t p-4 pt-10">
          <div
            style={{
              position: "absolute",
              top: "0%",
              right: "50%",
              transform: "translateY(-50%) translateX(50%)",
            }}
            className=" border bg-background-950 px-5 py-1"
          >
            Control
          </div>
          <div className="flex gap-4">
            <PolCheckbox value={equipment.HasData} onValueChanged={(x) => onChange({ HasData: x })}>
              Has Data
            </PolCheckbox>
            <PolCheckbox value={false} onValueChanged={() => {}}>
              This Device Holds Addressing
            </PolCheckbox>
          </div>
          <div className="flex items-end gap-4">
            <PolInput
              containerClassName="w-full"
              value={""}
              type="text"
              label="Preferred Settings"
              onValueChanged={(x) => {}}
            ></PolInput>
            <PolButton>Highlight Settings</PolButton>
          </div>
          <div>
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
          </div>
          <LabelSection label="Data Connection">
            <div className="flex">
              <PolCheckbox
                className="border border-zinc-400 bg-zinc-100 p-3"
                value={equipment.HasData}
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
          </LabelSection>
        </div>
      </div>
    </>
  );
};

export default EquipmentEditorPageTwo;
