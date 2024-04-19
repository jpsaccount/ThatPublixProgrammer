import { LabelSection } from "@/components/LabelSection/LabelSection";
import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolDropdownModal from "@/components/polComponents/PolDropdownModal";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import useQueryTemplate from "@/customHooks/sdkHooks/useQueryTemplate";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { Lamp } from "@/sdk/entities/project/equipment/Lamp";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { useState } from "react";
import PolModal from "@/components/polComponents/PolModal";
import PolIcon from "@/components/PolIcon";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { useEquipmentTypeGroupListViewParams } from "@/routes/_auth/equipment-type-groups/$equipmentTypeGroupId/index.lazy";
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

interface Props {
  onCreated: () => any;
}

const NewLightingConfiguration = ({ onCreated }: Props) => {
  const mutation = useDbUpsert(LightingFixtureConfiguration, {
    onSuccess: () => {},
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { equipmentTypeGroupId } = useEquipmentTypeGroupListViewParams();

  const [newFixtureLightingConfiguration, setNewFixtureLightingConfiguration] = useState<LightingFixtureConfiguration>(
    () => {
      const newFixture = new LightingFixtureConfiguration();
      newFixture.EquipmentTypeGroupId = equipmentTypeGroupId;
      return newFixture;
    },
  );

  const lampRequest = useDbQuery(Lamp);
  const equipmentCategoryRequest = useDbQuery(EquipmentType);

  const { searchText, setSearchText, query } = useQueryTemplate(
    `WHERE c.Nickname CONTAINS "{0}"  OFFSET 0 LIMIT 100 ORDER BY c.Nickname asc`,
    `OFFSET 0 LIMIT 100 ORDER BY c.Nickname asc `,
  );

  const equipmentsRequest = useDbQuery(LightingFixture, query);

  const handleChange = (x: Partial<LightingFixtureConfiguration>) => {
    setNewFixtureLightingConfiguration({ ...newFixtureLightingConfiguration, ...x });
  };

  async function handleSubmit() {
    setIsLoading(true);
    await mutation.mutateAsync(newFixtureLightingConfiguration).then((x) => {
      onCreated && onCreated();
    });
    setOpen(false);
    setIsLoading(false);
  }

  return (
    <PolModal
      isOpen={open}
      onOpenChanged={(x) => {
        if (!x) {
          setNewFixtureLightingConfiguration(new LightingFixtureConfiguration());
        }
        setOpen(x);
      }}
      modalTrigger={
        <PolButton variant="ghost">
          <PolIcon name="Plus"></PolIcon>
        </PolButton>
      }
    >
      <PolRequestPresenter
        request={[equipmentsRequest, equipmentCategoryRequest, lampRequest]}
        onSuccess={() => (
          <div className="m-auto max-w-[700px] space-y-4 p-4">
            <div className="grid grid-flow-col grid-cols-[1fr_1fr_1fr_4fr] space-x-5">
              <PolEntityDropdown
                options={equipmentCategoryRequest.data}
                nameGetter={(x) => x.Code}
                selectedId={newFixtureLightingConfiguration.EquipmentCategoryId}
                onValueChanged={(x) => handleChange({ EquipmentCategoryId: x.id })}
                label="Category"
              ></PolEntityDropdown>
              <PolInput
                value={newFixtureLightingConfiguration.Index}
                label="Index"
                onValueChanged={(x) => handleChange({ Index: x })}
              ></PolInput>

              <PolInput
                isDisabled={newFixtureLightingConfiguration.Index === ""}
                value={newFixtureLightingConfiguration.Index2}
                label="Index 2"
                onValueChanged={(x) => handleChange({ Index2: x })}
              ></PolInput>

              <PolDropdownModal
                nameGetter={(x) => x.Nickname}
                label="Equipment"
                searchText={searchText}
                onSearchTextChanged={setSearchText}
                orderByProperty={"Nickname"}
                columns={[{ id: "Nickname" }]}
                options={equipmentsRequest.data}
                selectedId={newFixtureLightingConfiguration.EquipmentId}
                onValueChanged={(x) => handleChange({ EquipmentId: x })}
              ></PolDropdownModal>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center gap-4">
                <PolCheckbox value={newFixtureLightingConfiguration.IsExisting}>Existing</PolCheckbox>
                <PolCheckbox value={newFixtureLightingConfiguration.HoldOnBuying}>Hold</PolCheckbox>
              </div>
              <div className="flex justify-center gap-4">
                <PolCheckbox value={newFixtureLightingConfiguration.IsBeingPurchaseByOthers}>By Others</PolCheckbox>
                <PolCheckbox value={newFixtureLightingConfiguration.IsExtendedDataSheet}>
                  Extended Data Sheet
                </PolCheckbox>
              </div>
            </div>

            <div className="grid grid-flow-col space-x-5">
              <PolDropdownModal
                nameGetter={(x) => x.Model}
                label="Lamp Type 1"
                orderByProperty={"Model"}
                columns={[{ id: "Model" }]}
                options={lampRequest.data}
                selectedId={newFixtureLightingConfiguration.Lamp1Id}
                onValueChanged={(x) => {
                  handleChange({ Lamp1Id: x });
                }}
              ></PolDropdownModal>
              <PolDropdownModal
                nameGetter={(x) => x.Model}
                label="Lamp Type 2"
                orderByProperty={"Model"}
                columns={[{ id: "Model" }]}
                options={lampRequest.data}
                selectedId={newFixtureLightingConfiguration.Lamp2Id}
                onValueChanged={(x) => {
                  handleChange({ Lamp2Id: x });
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
                value={newFixtureLightingConfiguration.MountingType}
                onValueChanged={(x) => handleChange({ MountingType: x })}
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
              value={newFixtureLightingConfiguration.Notes}
              label="Purchasing Notes"
              onValueChanged={(x) => handleChange({ Notes: x })}
            ></PolInput>
            <PolInput
              onValueChanged={(x) => handleChange({ InstallationNotes: x })}
              isMultiline={true}
              value={newFixtureLightingConfiguration.InstallationNotes}
              label="Installation Notes"
            ></PolInput>
            <PolInput
              isMultiline={true}
              value={newFixtureLightingConfiguration.InternalNotes}
              label="Private Notes"
              onValueChanged={(x) => handleChange({ InternalNotes: x })}
            ></PolInput>
            <PolButton isLoading={isLoading} onClick={handleSubmit}>
              Submit
            </PolButton>
          </div>
        )}
      ></PolRequestPresenter>
    </PolModal>
  );
};

export default NewLightingConfiguration;
