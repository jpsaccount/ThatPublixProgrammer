import PatternDropdown from "@/components/polComponents/GeneralSdkComponents/PatternDropdown";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolEntityDropdown from "@/components/polComponents/PolEntityDropdown";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolIcon from "@/components/PolIcon";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { ControlType } from "@/sdk/entities/project/equipment/EquipmentControl";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { setLevelRef } from "@testing-library/user-event/dist/cjs/utils/index.js";
import React, { FormEvent, useEffect, useState } from "react";
import FixtureUnitIdInput from "./FixtureUnitIdInput";
import { useToast } from "@/components/ui/use-toast";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { useEquipmentUnitListViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/index.lazy";
import { useUnitsListViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/units.lazy";
const contentTypes = [
  { id: ControlType.ACN, name: "ACN" },
  { id: ControlType.ArtNet, name: "ArtNet" },
  { id: ControlType.DMXPT, name: "DMXPT" },
  { id: ControlType.KiNET, name: "KiNET" },
  { id: ControlType.PWR, name: "PWR" },
  { id: ControlType.SA, name: "SA" },
  { id: ControlType.Unknown, name: "Unknown" },
  { id: ControlType.ZTTV, name: "ZTTV" },
  { id: ControlType.DMX, name: "DMX" },
  { id: ControlType.None, name: "None" },
];

interface Props {
  onCreated?: () => any;
  projectDatabaseId: string;
}

const NewEquipmentUnit = ({ onCreated, projectDatabaseId }: Props) => {
  const [open, setOpen] = useState(false);
  const equipmentCategories = useDbQuery(EquipmentType);
  const equipmentTypes = useDbQuery(LightingFixtureConfiguration);
  const equipment = useDbQuery(
    LightingFixture,
    `WHERE c.id IN ["${equipmentTypes.data?.map((x) => x.EquipmentId).join('","')}"]`,
    { enabled: isUsable(equipmentTypes.data) },
  );
  const { toast } = useToast();
  const mutation = useDbUpsert(LightingFixtureUnit, { onSuccess: () => {} });

  const [newFixtureUnit, setNewFixtureUnit] = useState<LightingFixtureUnit>(null);

  useEffect(() => {
    if (open) return;
    setNewFixtureUnit(() => {
      const newFixture = new LightingFixtureUnit();
      newFixture.ProjectDatabaseId = projectDatabaseId;
      return newFixture;
    });
    setErrorMessage("");
  }, [open]);

  const [isUnique, setIsUnique] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    if (
      newFixtureUnit.UnitNumber === 0 &&
      newFixtureUnit.UnitNumberIndex === 0 &&
      newFixtureUnit.UnitLetterIndex === ""
    ) {
      setErrorMessage("Unit Id is required");
      return;
    } else if (isUnique === false) {
      setErrorMessage("Unit Id is not unique");

      return;
    } else if (newFixtureUnit.EquipmentTypeId === "") {
      setErrorMessage("Equipment Type is required");

      return;
    }
    await mutation.mutateAsync(newFixtureUnit).then((x) => {
      onCreated && onCreated();
    });
    setIsLoading(false);
    setOpen(false);
  };
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: Partial<LightingFixtureUnit>) => {
    setNewFixtureUnit({ ...newFixtureUnit, ...e });
  };

  return (
    <PolModal
      isOpen={open}
      onOpenChanged={setOpen}
      modalTrigger={
        <PolButton className="ml-2" variant="ghost">
          <PolIcon name="Plus"></PolIcon>
        </PolButton>
      }
    >
      <PolRequestPresenter
        containerClassName="overflow-y-auto pb-10 h-[80dvh]"
        request={[equipmentCategories, equipmentTypes, equipment]}
        onSuccess={() => (
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <div>
              <FixtureUnitIdInput
                unitSetter={setNewFixtureUnit}
                isUnitIdUnqiue={(value) => setIsUnique(value)}
              ></FixtureUnitIdInput>
            </div>

            <div className="grid grid-flow-col gap-2">
              <PolInput
                value={newFixtureUnit.Purpose}
                onValueChanged={(x) => handleInputChange({ Purpose: x })}
                label="Purpose"
              ></PolInput>
              <PolInput
                value={newFixtureUnit.SubPurpose}
                onValueChanged={(x) => handleInputChange({ SubPurpose: x })}
                label="Sub Purpose"
              ></PolInput>
            </div>
            <PolInput
              value={newFixtureUnit.Location}
              onValueChanged={(x) => handleInputChange({ Location: x })}
              label="Location"
            ></PolInput>
            <PolEntityDropdown
              onValueChanged={(x) => handleInputChange({ EquipmentTypeId: x.id })}
              label="Equipment Type"
              selectedId={newFixtureUnit.EquipmentTypeId}
              nameGetter={(x) =>
                (equipmentCategories.data?.find((i) => i.id === x.EquipmentCategoryId)?.Code ?? "...") +
                x.Index +
                x.Index2 +
                ": " +
                (equipment.data?.find((i) => i.id === x.EquipmentId)?.Nickname ?? "...")
              }
              options={equipmentTypes.data}
            ></PolEntityDropdown>

            <PolDropdown
              containerClassName="w-full"
              nameGetter={(x) => x.name}
              value={contentTypes.find((x) => x.id === newFixtureUnit.Control.Type)}
              onValueChanged={(newType) =>
                handleInputChange({ Control: { ...newFixtureUnit.Control, Type: newType.id } })
              }
              options={contentTypes}
              label="Control Type"
            ></PolDropdown>
            <div className="grid grid-flow-col gap-2">
              <PolInput
                label="Universe"
                onValueChanged={(e) =>
                  handleInputChange({
                    Control: {
                      ...newFixtureUnit.Control,
                      DMXUniverse: e,
                    },
                  })
                }
                value={newFixtureUnit.Control?.DMXUniverse}
              ></PolInput>
              <PolInput
                label="Address"
                onValueChanged={(e) =>
                  handleInputChange({
                    Control: {
                      ...newFixtureUnit.Control,
                      DMXAddress: e,
                    },
                  })
                }
                value={newFixtureUnit.Control?.DMXAddress}
              ></PolInput>
            </div>

            <PolMutationErrorPresenter customErrorMessage={errorMessage} mutation={mutation} />

            <PolButton type="submit">Create</PolButton>
          </form>
        )}
      ></PolRequestPresenter>
    </PolModal>
  );
};

export default NewEquipmentUnit;
