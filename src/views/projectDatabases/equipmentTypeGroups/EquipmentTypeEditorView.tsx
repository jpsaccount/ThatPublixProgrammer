import { LabelSection } from "@/components/LabelSection/LabelSection";
import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolDropdownModal from "@/components/polComponents/PolDropdownModal";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LiveChangeContextProvider } from "@/contexts/LiveChangeContext";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import useAutosaveState from "@/customHooks/sdkHooks/useEntityAutosave";
import useQueryTemplate from "@/customHooks/sdkHooks/useQueryTemplate";
import useLiveChangeTracking from "@/customHooks/useLiveChangeTracking";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { Lamp } from "@/sdk/entities/project/equipment/Lamp";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect } from "react";
import EquipmentTypeChanges from "./EquipmentTypeChanges";
import { useEquipmentTypeEditorViewParams } from "@/routes/_auth/equipment-type-groups/$equipmentTypeGroupId/$equipmentTypeId.lazy";
const mountingOptions2 = [
  "Ceiling",
  "Fixture",
  "Grade",
  "Pendant",
  "Recessed",
  "Surface",
  "Track",
  "Underwater",
  "Various",
  "Wall",
  "Rack",
  "Festoon",
  "Portable",
  "Post",
  "Pier",
  "Integrated",
];

export default function EquipmentTypeEditorView() {
  const { equipmentTypeId } = useEquipmentTypeEditorViewParams();
  const equipmentTypeRequest = useDbQueryFirst(LightingFixtureConfiguration, `WHERE c.id = "${equipmentTypeId}"`);
  const equipmentRequest = useDbQueryFirst(
    LightingFixture,
    `WHERE c.id = "${equipmentTypeRequest.data?.EquipmentId}"`,
    {
      enabled: equipmentTypeRequest.data !== null,
    },
  );

  const lampRequest = useDbQuery(Lamp);
  const equipmentCategoryRequest = useDbQuery(EquipmentType);
  const [value, update, saveMutation, setValue] = useAutosaveState(
    LightingFixtureConfiguration,
    new LightingFixtureConfiguration(),
  );
  const changeLog = useLiveChangeTracking(equipmentTypeRequest, (changes) => {
    setValue((pre) => {
      return { ...pre, ...changes };
    });
  });
  function patch(updates: Partial<LightingFixtureConfiguration>) {
    update((x) => ({ ...x, ...updates }));
  }

  const { searchText, setSearchText, query } = useQueryTemplate(
    `WHERE c.Nickname CONTAINS "{0}" OR c.id = "${value?.EquipmentId}" OFFSET 0 LIMIT 100 ORDER BY c.Nickname asc`,
    `WHERE c.id = "${value?.EquipmentId}" OFFSET 0 LIMIT 100 ORDER BY c.Nickname asc `,
  );

  const equipmentsRequest = useDbQuery(LightingFixture, query, { enabled: isUsable(value?.EquipmentId) });

  useEffect(() => {
    setValue(equipmentTypeRequest.data);
  }, [equipmentTypeRequest.data]);

  return (
    <LiveChangeContextProvider changeLog={changeLog}>
      <PolRequestPresenter
        ready={isUsable(value)}
        request={[equipmentTypeRequest, equipmentRequest, equipmentCategoryRequest, lampRequest]}
        onSuccess={() => (
          <div className="m-auto max-w-[700px] space-y-4 p-4">
            <div className="grid grid-flow-col grid-cols-[1fr_1fr_1fr_4fr] space-x-5">
              <PolEntityDropdown
                options={equipmentCategoryRequest.data}
                nameGetter={(x) => x.Code}
                selectedId={value.EquipmentCategoryId}
                onValueChanged={(x) => patch({ EquipmentCategoryId: x.id })}
                label="Category"
              ></PolEntityDropdown>
              <PolInput value={value.Index} label="Index" onValueChanged={(x) => patch({ Index: x })}></PolInput>

              <PolInput value={value.Index2} label="Index 2" onValueChanged={(x) => patch({ Index2: x })}></PolInput>

              <PolDropdownModal
                nameGetter={(x) => x.Nickname}
                label="Equipment"
                searchText={searchText}
                onSearchTextChanged={setSearchText}
                orderByProperty={"Nickname"}
                columns={[{ id: "Nickname" }]}
                options={equipmentsRequest.data}
                selectedId={value.EquipmentId}
                onValueChanged={(x) => patch({ EquipmentId: x })}
              ></PolDropdownModal>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center gap-4">
                <PolCheckbox value={value.IsExisting}>Existing</PolCheckbox>
                <PolCheckbox value={value.HoldOnBuying}>Hold</PolCheckbox>
              </div>
              <div className="flex justify-center gap-4">
                <PolCheckbox value={value.IsBeingPurchaseByOthers}>By Others</PolCheckbox>
                <PolCheckbox value={value.IsExtendedDataSheet}>Extended Data Sheet</PolCheckbox>
              </div>
            </div>

            <div className="grid grid-flow-col space-x-5">
              <PolDropdownModal
                nameGetter={(x) => x.Model}
                label="Lamp Type 1"
                orderByProperty={"Model"}
                columns={[{ id: "Model" }]}
                options={lampRequest.data}
                selectedId={value.Lamp1Id}
                onValueChanged={(x) => {
                  patch({ Lamp1Id: x });
                }}
              ></PolDropdownModal>
              <PolDropdownModal
                nameGetter={(x) => x.Model}
                label="Lamp Type 2"
                orderByProperty={"Model"}
                columns={[{ id: "Model" }]}
                options={lampRequest.data}
                selectedId={value.Lamp2Id}
                onValueChanged={(x) => {
                  patch({ Lamp2Id: x });
                }}
              ></PolDropdownModal>
            </div>

            <div className="md:flex">
              <LabelSection label="Lamp 1 Qty" className="m-auto w-fit">
                <div className="flex flex-col items-center space-y-4">
                  <p className="w-fit">{`Lamp x Lamp1Co = Lamp1Co`}</p>
                  <div className="flex justify-center gap-4">
                    <PolCheckbox>Included</PolCheckbox>
                    <PolCheckbox>N/A</PolCheckbox>
                    <PolCheckbox>No Spares</PolCheckbox>
                  </div>
                </div>
              </LabelSection>
              <LabelSection label="Lamp 2 Qty" className="m-auto w-fit">
                <div className="flex flex-col items-center space-y-4">
                  <p className="w-fit">{`Lamp x Lamp2Co = Lamp2Co`}</p>
                  <div className="flex justify-center gap-4">
                    <PolCheckbox>Included</PolCheckbox>
                    <PolCheckbox>N/A</PolCheckbox>
                    <PolCheckbox>No Spares</PolCheckbox>
                  </div>
                </div>
              </LabelSection>
            </div>
            <div className="flex gap-4">
              <PolDropdown
                className="w-full"
                containerClassName="w-full"
                nameGetter={(x) => x}
                label="Mounting"
                value={value.MountingType}
                onValueChanged={(x) => patch({ MountingType: x })}
                options={mountingOptions2}
              ></PolDropdown>
              <PolDropdown
                className="w-full"
                containerClassName="w-full"
                options={[]}
                nameGetter={(x) => x}
                label="Connection"
              ></PolDropdown>
            </div>
            <PolInput
              isMultiline={true}
              value={value.Notes}
              label="Purchasing Notes"
              onValueChanged={(x) => patch({ Notes: x })}
            ></PolInput>
            <PolInput
              onValueChanged={(x) => patch({ InstallationNotes: x })}
              isMultiline={true}
              value={value.InstallationNotes}
              label="Installation Notes"
            ></PolInput>
            <PolInput
              isMultiline={true}
              value={value.InternalNotes}
              label="Private Notes"
              onValueChanged={(x) => patch({ InternalNotes: x })}
            ></PolInput>
            {/* <PolRequestPresenter
            request={equipmentRequest}
            onSuccess={() => (
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <LabelSection label="Cost">
                    <p>{equipment.CurrentCost.Usd}</p>
                  </LabelSection>
                  <LabelSection label="Finish">
                    <p>{equipment.Finish}</p>
                  </LabelSection>
                  <LabelSection label="Glass">
                    <p>{equipment.Glass}</p>
                  </LabelSection>
                </div>
                <div className="flex flex-col gap-2">
                  <LabelSection label="Height">
                    <p>{"Height"}</p>
                  </LabelSection>
                  <LabelSection label="Width">
                    <p>{"Width"}</p>
                  </LabelSection>
                  <LabelSection label="Depth">
                    <p>{"Depth"}</p>
                  </LabelSection>
                </div>
                <div className="flex flex-col gap-2">
                  <LabelSection label="Total Load">
                    <p>{equipment.Watts}</p>
                  </LabelSection>
                  <div className="flex flex-col gap-2">
                    <PolCheckbox value={equipment.IsCustom}>Custom</PolCheckbox>
                    <PolCheckbox value={equipment.IsModified}>Modified</PolCheckbox>
                  </div>
                </div>
              </div>
            )}
          ></PolRequestPresenter> */}

            <Drawer>
              <DrawerTrigger>
                <PolButton className="mx-auto w-fit">Show All Changes</PolButton>
              </DrawerTrigger>
              <DrawerContent className="max-h-[50dvh]">
                <DrawerHeader>
                  <DrawerTitle>Changes</DrawerTitle>
                </DrawerHeader>
                <EquipmentTypeChanges value={value}></EquipmentTypeChanges>
                <DrawerFooter>
                  <DrawerClose>Close</DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      ></PolRequestPresenter>
    </LiveChangeContextProvider>
  );
}
