import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import useAutosaveState from "@/customHooks/sdkHooks/useEntityAutosave";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect, useLayoutEffect } from "react";
import EquipmentUnitMainPage from "./EquipmentUnitMainPage";
import useLiveChangeTracking from "@/customHooks/useLiveChangeTracking";
import { LiveChangeContextProvider } from "@/contexts/LiveChangeContext";
import { OnValueChangedTriggerContextProvider } from "@/contexts/OnValueChangedTriggerContext";
import { CurrentSessionId } from "@/sdk";
import { useEquipmentUnitEditorViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag.lazy";

const EquipmentUnitEditorView = () => {
  const { projectDatabaseId, equipmentUnitId } = useEquipmentUnitEditorViewParams();
  const equipmentUnitRequest = useDbQueryFirst(LightingFixtureUnit, `WHERE c.id = "${equipmentUnitId}"`);

  // const equipmentUnitNext1Request = useDbQueryFirst(
  //   EquipmentUnit,
  //   `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" AND c.UnitNumber = ${equipmentUnitRequest.data.UnitNumber} AND c.UnitNumberIndex > ${equipmentUnitRequest.data.UnitNumberIndex} Order By c.UnitNumberIndex ASC`,
  //   { enabled: isUsable(equipmentUnitRequest?.data) }
  // );
  // const equipmentUnitNext2Request = useDbQueryFirst(
  //   EquipmentUnit,
  //   `WHERE c.ProjectDatabaseId = "${projectDatabaseId}" AND c.UnitNumber > ${equipmentUnitRequest.data.UnitNumber} Order By c.UnitNumber ASC`,
  //   { enabled: isUsable(equipmentUnitRequest?.data) }
  // );

  const [value, update, saveMutation, setValue] = useAutosaveState<LightingFixtureUnit>(LightingFixtureUnit, null, {
    delay: 0,
    updateCache: false,
  });

  const changeLog = useLiveChangeTracking(equipmentUnitRequest, (changes, changeLog) => {
    if (changeLog.sessionId !== CurrentSessionId) setValue((x) => ({ ...x, ...changes }));
  });

  useLayoutEffect(() => {
    setValue(equipmentUnitRequest.data);
  }, [equipmentUnitRequest.data]);

  return (
    <PolRequestPresenter
      ready={isUsable(value)}
      request={[equipmentUnitRequest]}
      onSuccess={() => (
        <OnValueChangedTriggerContextProvider trigger={300}>
          <LiveChangeContextProvider changeLog={changeLog}>
            <EquipmentUnitMainPage
              projectDatabaseId={projectDatabaseId}
              equipmentUnitId={equipmentUnitId}
              onChange={(e) => update({ ...value, ...e })}
              value={value}
              isSaving={saveMutation.isPending}
            ></EquipmentUnitMainPage>
          </LiveChangeContextProvider>
        </OnValueChangedTriggerContextProvider>
      )}
    ></PolRequestPresenter>
  );
};

export default EquipmentUnitEditorView;
