import { LabelSection } from "@/components/LabelSection/LabelSection";
import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolInput from "@/components/polComponents/PolInput";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Manufacturer } from "@/sdk/entities/project/equipment/Manufacturer";
import moment from "moment";
import EquipmentEditorPortalView from "./EquipmentDetailViews/EquipmentEditorPortalView";
import { EquipmentEditorViewsProps } from "./EquipmentEditorView";

const EquipmentEditorPageOne = ({ equipment, onChange, update }: EquipmentEditorViewsProps) => {
  const manufacturerRequest = useDbQuery(Manufacturer);

  return (
    <>
      <div className="relative block border-t pt-2">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <div
              style={{
                position: "absolute",
                top: "0%",
                right: "50%",
                transform: "translateY(-50%) translateX(50%)",
              }}
              className=" border bg-background-950 px-5 py-1"
            >
              Base
            </div>
            <EquipmentEditorPortalView equipment={equipment} update={update} onChange={onChange} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex h-1/4 items-end gap-4">
              <PolInput
                containerClassName="w-full"
                type="text"
                label="Class"
                value={equipment.Class}
                onValueChanged={(e) =>
                  onChange({
                    Class: e,
                  })
                }
              ></PolInput>
              <PolCheckbox
                className="mb-3"
                value={equipment.IsCustom}
                onValueChanged={(x) => {
                  onChange({ IsCustom: x });
                }}
              >
                Is Concept
              </PolCheckbox>
              <PolButton className="ml-28 mt-auto">Categories</PolButton>
            </div>
            <div className="flex h-1/4 items-end">
              <PolCheckbox
                className="border border-zinc-400 bg-zinc-100 p-3"
                value={equipment.IsCustom}
                onValueChanged={(x) => {
                  onChange({ IsCustom: x });
                }}
              >
                Custom
              </PolCheckbox>
              <PolCheckbox
                className="border-b border-r border-t border-zinc-400 bg-zinc-100 p-3"
                value={equipment.IsModified}
                onValueChanged={(x) => {
                  onChange({ IsModified: x });
                }}
              >
                Modified
              </PolCheckbox>
            </div>
            <div className="flex items-end">
              <PolInput
                className="w-24"
                type="text"
                value={equipment.CurrentCost.Usd}
                label="Cost (USD)"
                onValueChanged={(e) => {
                  onChange({
                    CurrentCost: {
                      ...equipment.CurrentCost,
                      Usd: e,
                    },
                  });
                }}
              ></PolInput>
              <PolCheckbox
                className="mb-3 ml-4 mr-4"
                value={equipment.CurrentCost.IsCostEstimated}
                onValueChanged={(x) => {
                  onChange({
                    CurrentCost: {
                      ...equipment.CurrentCost,
                      IsCostEstimated: x,
                    },
                  });
                }}
              >
                Estimate
              </PolCheckbox>
              <PolInput
                label="Cost Date"
                value={equipment.CurrentCost.CostAsOf.toLocaleString()}
                type="date"
                onValueChanged={(e) => {
                  onChange({
                    CurrentCost: {
                      ...equipment.CurrentCost,
                      CostAsOf: moment(e),
                    },
                  });
                }}
              ></PolInput>
            </div>
            <div className="flex items-end gap-4">
              <PolInput
                className="w-fit"
                label="Creation Date"
                type="date"
                value={equipment.CreatedDateTime.toLocaleString()}
                onValueChanged={(e) => {
                  onChange({ CreatedDateTime: moment(e) });
                }}
              ></PolInput>
              <PolButton>Modification Log</PolButton>
              <PolCheckbox className="mb-3 ml-10" onValueChanged={(x) => onChange({})}>
                Make Inactive
              </PolCheckbox>
            </div>
          </div>
        </div>
      </div>
      <div className=" relative mt-10 flex flex-row flex-wrap justify-between border-t py-10">
        <div
          style={{
            position: "absolute",
            top: "0%",
            right: "50%",
            transform: "translateY(-50%) translateX(50%)",
          }}
          className=" border bg-background-100 px-5 py-1"
        >
          Rating
        </div>
        <div className="">
          <PolInput value={""} type="text" label="Environmental Class" onValueChanged={(e) => onChange({})}></PolInput>
        </div>
      </div>
      <div className="relative mt-4 flex border-t pt-4">
        <div
          style={{
            position: "absolute",
            top: "0%",
            right: "50%",
            transform: "translateY(-50%) translateX(50%)",
          }}
          className=" border bg-background-950 px-5 py-1"
        >
          Physical
        </div>
        <div className="flex h-full w-7/12 flex-col pb-4">
          <div className="">
            <div className="mb-4 flex gap-2">
              <PolInput
                type="text"
                label="Finish"
                value={equipment.Finish}
                onValueChanged={(e) => onChange({ Finish: e })}
              ></PolInput>
              <PolInput
                type="text"
                label="Finish (Other)"
                value={equipment.Finish}
                onValueChanged={(e) => onChange({ Finish: e })}
              ></PolInput>
            </div>
            <div className="flex gap-2">
              <PolInput type="text" label="Shade" value={""} onValueChanged={(e) => onChange({})}></PolInput>
              <PolInput type="text" label="Shade (Other)" value={""} onValueChanged={(e) => onChange({})}></PolInput>
              <PolInput type="text" label="Shade Material" value={""} onValueChanged={(e) => onChange({})}></PolInput>
              <PolInput
                type="text"
                label="Shade Material (Other)"
                value={""}
                onValueChanged={(e) => onChange({})}
              ></PolInput>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex">
              <div className="flex w-fit gap-4 border-r pr-4">
                <LabelSection label="Height">
                  <div className="mt-2 flex flex-col gap-3">
                    <PolInput className="w-20" type="text" onValueChanged={(e) => {}} value={""}></PolInput>
                    <PolInput className="w-20" type="text" onValueChanged={(e) => {}} value={""}></PolInput>
                  </div>
                </LabelSection>
                <LabelSection label="Width">
                  <div className="mt-2 flex flex-col gap-3">
                    <PolInput className="w-20" type="text" onValueChanged={(e) => {}} value={""}></PolInput>
                    <PolInput className="w-20" type="text" onValueChanged={(e) => {}} value={""}></PolInput>
                  </div>
                </LabelSection>
                <LabelSection label="Depth">
                  <div className="mt-2 flex flex-col gap-3">
                    <PolInput className="w-20" type="text" onValueChanged={(e) => {}} value={""}></PolInput>
                    <PolInput className="w-20" type="text" onValueChanged={(e) => {}} value={""}></PolInput>
                  </div>
                </LabelSection>
              </div>
              <div className="flex ps-4">
                <LabelSection label="Weight">
                  <div className="mt-2 flex flex-col gap-3">
                    <PolInput className="w-20" type="text" onValueChanged={(e) => {}} value={""}></PolInput>
                    <PolInput className="w-20" type="text" onValueChanged={(e) => {}} value={""}></PolInput>
                  </div>
                </LabelSection>
              </div>
            </div>
          </div>
        </div>
        <div className="ms-10 flex flex-col">
          <div className="flex">
            <PolInput type="text" label="Light Source" onValueChanged={() => {}} value={""}></PolInput>
            <div className="ms-10 flex items-end gap-1">
              <PolInput type="text" label="Color Temp" onValueChanged={() => {}} value={""}></PolInput>
              <p className="mb-3">-</p>
              <PolInput type="text" label="Light Source" onValueChanged={() => {}} value={""}></PolInput>
            </div>
          </div>
          <div className="mb-4 mt-auto flex items-end gap-4">
            <div className="w-fit border border-zinc-400 bg-zinc-100">
              <PolCheckbox
                className="p-3 "
                onValueChanged={(x) => onChange({ CanTakeFilter: x })}
                value={equipment.CanTakeFilter}
              >
                Can Take Filter
              </PolCheckbox>
              <PolCheckbox className="border-b border-t border-zinc-400 p-3 ">Can Take Beam Modifier</PolCheckbox>
              <PolCheckbox
                className="p-3"
                onValueChanged={(x) => onChange({ CanTakeGobo: x })}
                value={equipment.CanTakeGobo}
              >
                Can Take Pattern
              </PolCheckbox>
            </div>
            <div>
              <PolInput label="Size" value={""} type="text"></PolInput>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EquipmentEditorPageOne;
