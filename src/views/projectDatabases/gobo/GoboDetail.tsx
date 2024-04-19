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
import GoboEditor from "./GoboEditor";

const GoboDetail = () => {
  const [goboId, setGoboId] = useSearchParamState("id", "");
  const goboRequest = useDbQueryFirst(Pattern, `WHERE c.id = '${goboId}'`, { enabled: isUsable(goboId) });

  const { value, initialValue, propertiesChanged, update } = useChangeTracking(null);

  useEffect(() => update(goboRequest.data), [goboRequest.data]);

  return (
    <PolRequestPresenter
      request={goboRequest}
      onSuccess={() => (
        <div className="m-auto">
          <CardHeader className="bg-transparent">{goboRequest.data.Name}</CardHeader>
          <CardContent className="flex flex-col">
            {value && <GoboEditor gobo={value} onChange={update}></GoboEditor>}
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
};

export default GoboDetail;
