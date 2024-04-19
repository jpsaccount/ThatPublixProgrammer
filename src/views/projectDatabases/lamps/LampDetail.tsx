import ChangeTrackerTooltip from "@/components/ChangeTrackerTooltip";
import { PolButton } from "@/components/polComponents/PolButton";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useChangeTracking } from "@/customHooks/useChangeTracking";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { Lamp } from "@/sdk/entities/project/equipment/Lamp";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Card, CardHeader } from "@chakra-ui/react";
import { CardContent } from "@mui/material";
import { useEffect } from "react";
import LampEditor from "./LampEditor";

const LampDetail = () => {
  const [lampId, setLampId] = useSearchParamState("id", "");
  const lampRequest = useDbQueryFirst(Lamp, `WHERE c.id = "${lampId}"`, { enabled: isUsable(lampId) });

  const { value, initialValue, propertiesChanged, update } = useChangeTracking(null);

  useEffect(() => update(lampRequest.data), [lampRequest.data]);

  return (
    <PolRequestPresenter
      request={lampRequest}
      onSuccess={() => (
        <Card className="m-auto h-fit">
          <CardHeader>{lampRequest.data.Model}</CardHeader>
          <CardContent className="flex flex-col">
            {value && <LampEditor lamp={value} onChange={update}></LampEditor>}
            <div className="mt-4 flex gap-4">
              <ChangeTrackerTooltip
                initialValue={initialValue}
                propertiesChanged={propertiesChanged}
                value={value}
              ></ChangeTrackerTooltip>
              <PolButton>Commit Changes</PolButton>
            </div>
          </CardContent>
        </Card>
      )}
    ></PolRequestPresenter>
  );
};

export default LampDetail;
