import ChangeTrackerTooltip from "@/components/ChangeTrackerTooltip";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { CardContent, CardHeader } from "@/components/ui/card";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useChangeTracking } from "@/customHooks/useChangeTracking";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { Pattern } from "@/sdk/entities/project/equipment/Pattern";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect } from "react";
import EquipmentTypeEditor from "./EquipmentTypeEditor";
import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";

export default function EquipmentTypeDetail() {
  const [equipmentTypeId, setEquipmentTypeId] = useSearchParamState("id", "");
  const equipmentTypeRequest = useDbQueryFirst(EquipmentType, `WHERE c.id = '${equipmentTypeId}'`, {
    enabled: isUsable(equipmentTypeId),
  });

  const { value, initialValue, propertiesChanged, update } = useChangeTracking(null);

  useEffect(() => update(equipmentTypeRequest.data), [equipmentTypeRequest.data]);

  return (
    <PolRequestPresenter
      request={equipmentTypeRequest}
      onSuccess={() => (
        <div className="m-auto">
          <CardHeader className="bg-transparent">{equipmentTypeRequest.data.Code}</CardHeader>
          <CardContent className="flex flex-col">
            {value && <EquipmentTypeEditor equipmentType={value} onChange={update}></EquipmentTypeEditor>}
            <div className="mt-4 flex gap-4">
              <ChangeTrackerTooltip
                initialValue={initialValue}
                propertiesChanged={propertiesChanged}
                value={value}
              ></ChangeTrackerTooltip>
              <PolButton>Commit Changes</PolButton>
            </div>
          </CardContent>
        </div>
      )}
    ></PolRequestPresenter>
  );
}
