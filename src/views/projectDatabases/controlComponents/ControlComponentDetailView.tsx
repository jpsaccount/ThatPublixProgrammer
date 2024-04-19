import ChangeTrackerTooltip from "@/components/ChangeTrackerTooltip";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useChangeTracking } from "@/customHooks/useChangeTracking";
import { ControlComponent } from "@/sdk/entities/project/equipment/ControlComponent";
import ControlComponentEditor from "./ControlComponentEditor";
import { CardContent, CardHeader } from "@/components/ui/card";
import { useEffect } from "react";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { isUsable } from "@/sdk/utils/usabilityUtils";

const ControlComponentDetailView = () => {
  const [controlComponentId, setControlComponentId] = useSearchParamState("id", "");
  const controlComponentRequest = useDbQueryFirst(ControlComponent, `WHERE c.id = "${controlComponentId}"`, {
    enabled: isUsable(controlComponentId),
  });

  const { value, initialValue, propertiesChanged, update } = useChangeTracking(null);

  useEffect(() => update(controlComponentRequest.data), [controlComponentRequest.data]);

  return (
    <PolRequestPresenter
      request={controlComponentRequest}
      onSuccess={() => (
        <>
          <CardHeader>{controlComponentRequest.data.Title}</CardHeader>
          <CardContent className="flex flex-col">
            <ControlComponentEditor controlComponent={value} onChange={update}></ControlComponentEditor>
            <div className="mt-4 flex gap-4">
              <ChangeTrackerTooltip
                initialValue={initialValue}
                propertiesChanged={propertiesChanged}
                value={value}
              ></ChangeTrackerTooltip>
              <PolButton>Commit Changes</PolButton>
            </div>
          </CardContent>
        </>
      )}
    ></PolRequestPresenter>
  );
};

export default ControlComponentDetailView;
