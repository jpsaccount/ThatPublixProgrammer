import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { ChangeEvent } from "@/sdk/entities/core/ChangeEvent";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ChangeEventViewer from "../equipmentUnit/ChangeEventViewer";

interface Props {
  value: LightingFixtureConfiguration;
}
export default function EquipmentTypeChanges({ value }: Props) {
  const changesRequest = useDbQuery(
    ChangeEvent,
    `WHERE c.EntityData.TypeId = "${getEntityTypeId(LightingFixtureConfiguration)}" AND c.EntityData.EntityId = "${
      value.id
    }" ORDER BY c.EventDateTime DESC`,
    { refetchOnMount: true, refetchOnWindowFocus: true, staleTime: 0 },
  );

  const equipmentRequest = useDbQuery(
    LightingFixture,
    `WHERE c.id IN ["${changesRequest.data
      .flatMap((x) => x.Changes)
      .filter((x) => x.PropertyChangedName == "EquipmentId")
      .flatMap((x) => [x.PreviousValue, x.NewValue])
      .join(`","`)}"]`,
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
          <ScrollArea className="m-1 h-full overflow-auto border p-1">
            {changesRequest.data.map((x) => {
              return (
                <ChangeEventViewer
                  changeEvent={x}
                  oldValue={(value) =>
                    value.PropertyChangedName === "EquipmentId"
                      ? equipmentRequest.data?.find((x) => x.id == value.PreviousValue)?.Nickname
                      : null
                  }
                  newValue={(value) =>
                    value.PropertyChangedName === "EquipmentId"
                      ? equipmentRequest.data?.find((x) => x.id == value.NewValue)?.Nickname
                      : null
                  }
                ></ChangeEventViewer>
              );
            })}
          </ScrollArea>
        );
      }}
    ></PolRequestPresenter>
  );
}
