import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Entity } from "@/sdk/contracts/Entity";
import { ChangeEvent } from "@/sdk/entities/core/ChangeEvent";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import ChangeEventViewer from "@/views/projectDatabases/equipmentUnit/ChangeEventViewer";

interface Props<T> {
  value: T;
  type: { new (...args: any[]): T };
}
export default function EntityChangeViewer<T extends Entity>({ value, type }: Props<T>) {
  const changesRequest = useDbQuery(
    ChangeEvent,
    `WHERE c.EntityData.TypeId = "${getEntityTypeId(type)}" AND c.EntityData.EntityId = "${
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
          <ScrollArea className="m-1 h-[70dvh] overflow-auto p-1">
            <div className="grid grid-flow-col grid-cols-[auto_1fr]">
              <PolText type="bold">Current</PolText>
            </div>
            <div className="m-1">
              {Object.keys(value).map((x) => {
                return (
                  <PolText type="small">
                    {x} from "{JSON.stringify(value[x])}"
                  </PolText>
                );
              })}
            </div>
            {changesRequest.data.map((x) => {
              return <ChangeEventViewer changeEvent={x}></ChangeEventViewer>;
            })}
          </ScrollArea>
        );
      }}
    ></PolRequestPresenter>
  );
}
