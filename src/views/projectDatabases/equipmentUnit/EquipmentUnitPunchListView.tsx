import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import React, { useEffect, useMemo, useState } from "react";
import EquipmentUnitPunchListEditor from "./EquipmentUnitPunchListEditor";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { TaggedEntity } from "@/sdk/childEntities/TaggedEntity";
import { getEntityTypeId } from "@/sdk/sdkconfig/EntityTypeId";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import { Status } from "@/sdk/enums/Status";
import { Stat } from "@chakra-ui/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PolText from "@/components/polComponents/PolText";

interface Props {
  equipmentUnitId: string;
}
export default function EquipmentUnitPunchListView({ equipmentUnitId }: Props) {
  const punchListItemRequest = useDbQuery(PunchListItem, `WHERE c.TaggedEntities Contains "${equipmentUnitId}"`);
  const [newPunchListItem, setNewPunchListItem] = useState<PunchListItem>(null);

  useEffect(() => {
    const punchListItem = new PunchListItem();
    const taggedEntity = new TaggedEntity();
    taggedEntity.EntityId = equipmentUnitId;
    taggedEntity.EntityTypeId = getEntityTypeId(LightingFixtureUnit);
    punchListItem.TaggedEntities = [taggedEntity];
    setNewPunchListItem(punchListItem);
  }, [equipmentUnitId]);

  const upsertMutation = useDbUpsert(PunchListItem);
  const [showNewPunchListModal, setShowNewPunchListModal] = useState(false);

  const pendingToDos = useMemo(
    () => punchListItemRequest.data?.filter((x) => x.Status != Status.Completed),
    [punchListItemRequest.data],
  );
  const completedToDos = useMemo(
    () => punchListItemRequest.data?.filter((x) => x.Status === Status.Completed),
    [punchListItemRequest.data],
  );

  return (
    <>
      <div>
        <div className="stackGrid ">
          <PolHeading size={4} className="m-auto text-center">
            Punch Lists
          </PolHeading>
          <PolModal
            isOpen={showNewPunchListModal}
            onOpenChanged={setShowNewPunchListModal}
            modalTrigger={
              <PolButton variant="ghost" className="ml-auto w-fit">
                <PolIcon name="Plus" />
              </PolButton>
            }
          >
            <div className="grid grid-flow-row gap-5">
              <EquipmentUnitPunchListEditor
                punchListItem={newPunchListItem}
                onPunchListItemChanged={setNewPunchListItem}
              />
              <PolButton
                className="mx-auto"
                onClick={() =>
                  upsertMutation.mutateAsync(newPunchListItem).then((x) => {
                    setShowNewPunchListModal(false);
                    punchListItemRequest.refetch();
                  })
                }
              >
                Save
              </PolButton>
            </div>
          </PolModal>
        </div>
        <PolRequestPresenter
          request={punchListItemRequest}
          onSuccess={() => (
            <div className="p-5">
              {pendingToDos.map((x) => (
                <div className="grid grid-flow-col grid-cols-[auto_1fr] ">
                  <PolCheckbox
                    value={x.Status === Status.Completed}
                    onValueChanged={(e) =>
                      upsertMutation.mutateAsync({ ...x, Status: e ? Status.Completed : Status.NotStarted })
                    }
                  />
                  <div>{x.Title}</div>
                </div>
              ))}

              {completedToDos.length > 0 && (
                <Accordion collapsible type="single">
                  <AccordionItem value="completedToDos">
                    <AccordionTrigger>{`Completed`}</AccordionTrigger>
                    <AccordionContent>
                      {completedToDos.map((x) => (
                        <div className="grid grid-flow-col grid-cols-[auto_1fr]">
                          <PolCheckbox
                            value={x.Status === Status.Completed}
                            onValueChanged={(e) =>
                              upsertMutation.mutateAsync({ ...x, Status: e ? Status.Completed : Status.NotStarted })
                            }
                          />
                          <div>{x.Title}</div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {punchListItemRequest.data?.length === 0 && (
                <div className="h-full">
                  <PolText className="text-center">No Punch List Items</PolText>
                </div>
              )}
            </div>
          )}
        />
      </div>
    </>
  );
}
