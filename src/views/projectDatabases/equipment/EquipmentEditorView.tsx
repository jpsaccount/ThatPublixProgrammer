import SavingIndicator from "@/components/indicator/SavingIndicator";
import PolHeading from "@/components/polComponents/PolHeading";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { LiveChangeContextProvider } from "@/contexts/LiveChangeContext";
import { useAuth } from "@/customHooks/auth";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import useAutosaveState from "@/customHooks/sdkHooks/useEntityAutosave";
import useLiveChangeTracking from "@/customHooks/useLiveChangeTracking";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import EquipmentEditorDataView from "./EquipmentDetailViews/EquipmentEditorDataView";
import EquipmentEditorDatasheetView from "./EquipmentDetailViews/EquipmentEditorDatasheetView";
import EquipmentEditorLookView from "./EquipmentDetailViews/EquipmentEditorLookView";
import EquipmentEditorPortalView from "./EquipmentDetailViews/EquipmentEditorPortalView";
import EquipmentEditorPowerView from "./EquipmentDetailViews/EquipmentEditorPowerView";
import { useEquipmentEditorViewParams } from "@/routes/_auth/equipment/$equipmentId.lazy";

export interface EquipmentEditorViewsProps {
  equipment: LightingFixture;
  onChange: (newProps: Partial<LightingFixture>) => void;
  update: React.Dispatch<React.SetStateAction<LightingFixture>>;
  lastChangedBy?: string;
}

const EquipmentEditorView = () => {
  const { equipmentId } = useEquipmentEditorViewParams();
  const { user } = useAuth();
  const equipmentRequest = useDbQueryFirst(LightingFixture, `WHERE c.id = "${equipmentId}"`);

  const [changedProperties, setChangedProperties] = useState<Set<string>>(new Set());

  const [selectedViewKey, setSelectedViewKey] = useSearchParamState("v", "1");

  const [equipment, update, saveMutation, setWithoutUpdate] = useAutosaveState(LightingFixture, new LightingFixture(), {
    delay: 500,
  });

  const changeLog = useLiveChangeTracking(equipmentRequest, (changes) => {
    setWithoutUpdate((x) => ({ ...x, ...changes }));
  });

  useEffect(() => {
    setWithoutUpdate(equipmentRequest.data);
  }, [equipmentRequest.data]);

  function handleChange(newProps: Partial<LightingFixture>) {
    update((prev) => {
      return { ...prev, ...newProps };
    });

    setChangedProperties((prev) => {
      const updatedProperties = new Set(prev);

      if (equipmentRequest.data) {
        Object.keys(newProps).forEach((propertyName) => {
          const originalValue = equipmentRequest.data[propertyName];
          const newValue = newProps[propertyName];

          if (originalValue !== newValue) {
            updatedProperties.add(propertyName);
          } else {
            updatedProperties.delete(propertyName);
          }
        });
      }

      return updatedProperties;
    });
  }

  return (
    <PolRequestPresenter
      request={equipmentRequest}
      onSuccess={() => (
        <LiveChangeContextProvider changeLog={changeLog}>
          <div className="grid grid-flow-row">
            <div className="grid min-h-16 grid-cols-[auto_1fr_auto] p-4">
              <div className="grid grid-flow-row">
                <PolHeading>{equipment?.Nickname}</PolHeading>
                {/* <PolRequestPresenter
                request={userRequest}
                onFailure={() => <div className="h-7"></div>}
                onLoading={() => <PolSkeleton className="h-7" />}
                onSuccess={() => <PolText>{"Updated by: " + getFullName(userRequest.data.Person)}</PolText>}
              /> */}
              </div>
              <SavingIndicator saveMutation={saveMutation} className="my-auto ml-5 mt-2" />
              <PolMutationErrorPresenter mutation={saveMutation} />
            </div>

            <Tabs
              aria-label="Options"
              className="my-2 ml-auto"
              selectedKey={selectedViewKey}
              onSelectionChange={(key) => setSelectedViewKey(key.toString())}
            >
              <Tab key={"1"} title="Portal">
                {equipment && (
                  <EquipmentEditorPortalView onChange={handleChange} update={update} equipment={equipment} />
                )}
              </Tab>
              <Tab key={"2"} title="Look">
                {equipment && <EquipmentEditorLookView onChange={handleChange} update={update} equipment={equipment} />}
              </Tab>

              <Tab key={"3"} title="Power">
                {equipment && (
                  <EquipmentEditorPowerView onChange={handleChange} update={update} equipment={equipment} />
                )}
              </Tab>
              <Tab key={"4"} title="Data">
                {equipment && <EquipmentEditorDataView onChange={handleChange} update={update} equipment={equipment} />}
              </Tab>
              <Tab key={"5"} title="Datasheet">
                {equipment && (
                  <EquipmentEditorDatasheetView equipment={equipment} update={update} onChange={handleChange} />
                )}
              </Tab>
            </Tabs>
          </div>
        </LiveChangeContextProvider>
      )}
    ></PolRequestPresenter>
  );
};

export default EquipmentEditorView;
