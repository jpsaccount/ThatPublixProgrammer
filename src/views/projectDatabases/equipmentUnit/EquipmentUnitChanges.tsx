import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { ChangeEvent } from "@/sdk/entities/core/ChangeEvent";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import ChangeEventViewer from "./ChangeEventViewer";

interface Props {
  value: LightingFixtureUnit;
}
export default function EquipmentUnitChanges({ value }: Props) {
  const changesRequest = useDbQuery(
    ChangeEvent,
    `WHERE c.EntityData.TypeId = "${getEntityTypeId(LightingFixtureUnit)}" AND c.EntityData.EntityId = "${
      value.id
    }" ORDER BY c.EventDateTime DESC OFFSET 0 LIMIT 100`,
    { refetchOnMount: true, refetchOnWindowFocus: true, staleTime: 0 },
  );
  return (
    <PolRequestPresenter
      request={changesRequest}
      onSuccess={() => {
        if (changesRequest.data.length == 0) {
          return (
            <PolText type="p" className="m-auto">
              No changes found
            </PolText>
          );
        }
        return (
          <ScrollArea className="m-1 h-full overflow-auto p-1">
            {changesRequest.data.map((x) => {
              return <ChangeEventViewer changeEvent={x}></ChangeEventViewer>;
            })}
          </ScrollArea>
        );
      }}
    ></PolRequestPresenter>
  );
}
