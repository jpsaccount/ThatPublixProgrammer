import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useEquipmentUnitQrPrintViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/qr-codes.lazy";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { useEffect, useState } from "react";

interface Props {
  onSelect: (selectedIds: string[]) => void;
}

export default function SelectRangeOfUnits({ onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [startingValue, setStartingValue] = useState(0);
  const [endingValue, setEndingValue] = useState(0);
  const { projectDatabaseId } = useEquipmentUnitQrPrintViewParams();

  const query = `WHERE c.UnitNumber >= ${startingValue} AND c.UnitNumber <= ${endingValue} AND c.ProjectDatabaseId = "${projectDatabaseId}"`;

  const [execute, setExecute] = useState(false);
  const data = useDbQuery(LightingFixtureUnit, query, { enabled: execute });

  useEffect(() => {
    if (data.status === "success" && execute) {
      onSelect(data.data.map((x) => x.id));
      setIsOpen(false);
      setExecute(false);
    }
  }, [data]);
  const handleQuery = () => {
    setExecute(true);
  };

  return (
    <PolModal
      isOpen={isOpen}
      onOpenChanged={setIsOpen}
      heading={"Select a range of units"}
      modalTrigger={<PolButton className="ml-0 mr-auto w-fit">Select Range</PolButton>}
    >
      <PolRequestPresenter
        containerClassName="h-fit"
        showWhenPending={true}
        request={data}
        onSuccess={() => (
          <div className="grid grid-flow-row">
            <div className="m-2 grid grid-flow-col">
              <PolInput
                value={startingValue}
                onValueChanged={setStartingValue}
                label="Start"
                placeholder="Starting Value"
              ></PolInput>
              <PolText className="mx-2 mb-3 mt-auto">-</PolText>
              <PolInput
                type="number"
                value={endingValue}
                onValueChanged={setEndingValue}
                label="End"
                placeholder="Ending Value"
              ></PolInput>
            </div>
            <PolButton className="mx-auto" isLoading={execute} onClick={handleQuery}>
              Select
            </PolButton>
          </div>
        )}
      ></PolRequestPresenter>
    </PolModal>
  );
}
