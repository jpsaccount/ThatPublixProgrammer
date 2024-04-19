import PolInput from "@/components/polComponents/PolInput";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useEquipmentUnitEditorViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag.lazy";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import React, { useEffect, useMemo, useState } from "react";

interface Props {
  unitSetter: React.Dispatch<React.SetStateAction<LightingFixtureUnit>>;
  isUnitIdUnqiue: (isUnqiue: boolean) => any;
}

const FixtureUnitIdInput = ({ unitSetter, isUnitIdUnqiue }: Props) => {
  const { projectDatabaseId } = useEquipmentUnitEditorViewParams();
  const [unitNumber, setUnitNumber] = useState(null);
  const [unitNumberIndex, setUnitNumberIndex] = useState(null);
  const [unitLetterIndex, setUnitLetterIndex] = useState(null);
  let query = `WHERE `;
  if (unitNumber === "") {
    query += ` AND c.UnitNumberIndex = 0`;
  } else {
    query += ` AND c.UnitNumberIndex = ${unitNumber}`;
  }
  if (unitNumberIndex === "") {
    query += ` AND c.UnitNumberIndex = 0`;
  } else {
    query += ` AND c.UnitNumberIndex = ${unitNumberIndex}`;
  }
  if (unitLetterIndex === "") {
    query += ` AND c.UnitLetterIndex = "${unitLetterIndex}"`;
  } else {
    query += ` AND c.UnitLetterIndex = "${unitLetterIndex}"`;
  }
  query += ` AND c.ProjectDatabaseId = "${projectDatabaseId}"`;
  const equipmentUnitRequest = useDbQuery(LightingFixtureUnit, query);

  const [isUnique, setIsUnqiue] = useState(false);

  useEffect(
    () =>
      setIsUnqiue(() => {
        if (!equipmentUnitRequest.data) return false;
        return equipmentUnitRequest.data.length !== 1;
      }),
    [equipmentUnitRequest.data],
  );

  useEffect(() => {
    isUnitIdUnqiue(isUnique);
  }, [isUnique]);

  useEffect(() => {
    if (unitNumber === 0) {
      setUnitNumberIndex(0);
      setUnitLetterIndex("");
      return;
    }
    unitSetter((prev) => {
      return { ...prev, UnitNumber: unitNumber, UnitNumberIndex: unitNumberIndex, UnitLetterIndex: unitLetterIndex };
    });
  }, [unitNumber, unitNumberIndex, unitLetterIndex]);
  return (
    <>
      <div className="flex w-[495px] gap-2">
        <PolInput
          value={unitNumber}
          onValueChanged={(value) => {
            const isNumber = value === "" || value.match(/^[0-9]+$/);
            if (isNumber) {
              setUnitNumber(value);
            }
          }}
          label="Unit Id"
        ></PolInput>
        <PolInput
          isDisabled={unitNumber === 0}
          value={unitNumberIndex}
          onValueChanged={(value) => {
            const isNumber = value === "" || value.match(/^[0-9]+$/);
            if (isNumber) {
              setUnitNumberIndex(value);
            }
          }}
          label="Unit Number"
        ></PolInput>
        <PolInput
          isDisabled={unitNumber === 0}
          value={unitLetterIndex}
          onValueChanged={(value) => {
            const isLetter = value === "" || value.match(/[a-z]/i);
            if (isLetter) {
              setUnitLetterIndex(value);
            }
          }}
          label="Unit Letter Index"
        ></PolInput>
      </div>
      <PolRequestPresenter
        request={equipmentUnitRequest}
        onSuccess={() => (
          <>
            {!isUnique && (
              <p className="mt-1 w-fit rounded bg-red-100 px-2 text-red-400">Unit Id must be unique to the project</p>
            )}
          </>
        )}
      ></PolRequestPresenter>
    </>
  );
};

export default FixtureUnitIdInput;
