import PolIcon from "@/components/PolIcon";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { Status } from "@/sdk/enums/Status";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import PolModal from "@/components/polComponents/PolModal";
import PolInput from "@/components/polComponents/PolInput";
import { set, update } from "node_modules/cypress/types/lodash";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import { Priority } from "@/sdk/enums/Priority";
import { PolButton } from "@/components/polComponents/PolButton";
import { User } from "@/sdk/entities/core/User";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolMultiSelectModal from "@/components/PolMultiSelectModal";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { PunchListItemAssignment } from "@/sdk/childEntities/PunchListItemAssignment";
import { useAuth } from "@/customHooks/auth";
import FinishPunchListItem from "./FinishPunchListItem";
import PunchListItemPriority from "../PunchListItemPriority";
import { PolDatePicker } from "@/components/polComponents/PolDatePicker";
import EditCheckList from "./EditCheckList";

export function EditPunchListItem({
  punchListItem,
  trigger,
  openDefault = false,
  onClose,
}: {
  punchListItem: PunchListItem;
  trigger?: ReactNode;
  openDefault?: boolean;
  onClose?: () => void;
}) {
  const { user } = useAuth();
  const users = useDbQuery(User);

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(openDefault);
  const [updatedItem, setUpdatedItem] = useState<PunchListItem | null>(null);
  const [assignments, setAssignments] = useState<string[]>([]);

  const mutation = useDbUpsert(PunchListItem);
  const handleChange = (value: Partial<PunchListItem>) => {
    setUpdatedItem((prev) => {
      return { ...prev, ...value };
    });
  };

  useEffect(() => {
    setUpdatedItem(punchListItem);
    setAssignments(punchListItem.Assignments.map((x) => x.AssignedToUserId));
  }, [punchListItem]);

  useEffect(() => {
    if (!open) {
      setAssignments(punchListItem.Assignments.map((x) => x.AssignedToUserId));
      setUpdatedItem(punchListItem);
      onClose && onClose();
      return;
    }
  }, [open]);
  const getTrigger = useMemo(() => {
    return trigger;
  }, [trigger]);
  if (!updatedItem) {
    return null;
  }
  const priorities = [
    { name: "Very Low", value: Priority.VeryLow },
    { name: "Low", value: Priority.Low },
    { name: "Normal", value: Priority.Normal },
    { name: "High", value: Priority.High },
    { name: "Very High", value: Priority.VeryHigh },
  ];

  const handleUpdate = async () => {
    setIsLoading(true);

    const newUpdatedItem = { ...updatedItem };

    newUpdatedItem.Assignments = assignments.map((x) => {
      const newAssignment = new PunchListItemAssignment();
      newAssignment.AssignedToUserId = x;
      newAssignment.AssignedByUserId = user!.id;
      return newAssignment;
    });
    await mutation.mutateAsync(newUpdatedItem);
    setOpen(false);
    setIsLoading(false);
  };

  return (
    <PolModal
      heading="Make Changes"
      isOpen={open}
      onOpenChanged={setOpen}
      modalTrigger={
        !openDefault &&
        (trigger ? (
          getTrigger
        ) : (
          <span className="flex w-full items-center justify-between rounded-md p-2 hover:cursor-pointer hover:bg-gray-100">
            <span className="flex items-center">
              <FinishPunchListItem punchListItem={punchListItem}></FinishPunchListItem>
              <p>{punchListItem.Title}</p>
            </span>
            <PunchListItemPriority priority={punchListItem.Priority}></PunchListItemPriority>
          </span>
        ))
      }
    >
      <PolInput
        label="Title"
        containerClassName="w-96"
        value={updatedItem.Title}
        onValueChanged={(x) => handleChange({ Title: x })}
      ></PolInput>
      <PolInput isMultiline={true} label="Description" value={updatedItem.Description}></PolInput>
      <PolDropdown
        className="mb-2"
        label="Priority"
        options={priorities}
        nameGetter={(x) => x.name}
        value={priorities.find((x) => x.value === updatedItem.Priority)}
        onValueChanged={(x) => handleChange({ Priority: x.value })}
      ></PolDropdown>
      <div className="flex w-full gap-2">
        <PolDatePicker
          label="Start Date"
          value={updatedItem.StartDate}
          onValueChanged={(x) => handleChange({ StartDate: x })}
        ></PolDatePicker>
        <PolDatePicker
          label="End Date"
          value={updatedItem.EndDate}
          onValueChanged={(x) => handleChange({ EndDate: x })}
        ></PolDatePicker>
      </div>
      <div className="my-2">
        <EditCheckList
          showOnCard={updatedItem.IsShowingCheckListItemsInCard}
          onShowOnCardChange={(x) => handleChange({ IsShowingCheckListItemsInCard: x })}
          checklist={updatedItem.CheckListItems}
          onChange={(x) => handleChange({ CheckListItems: x })}
        ></EditCheckList>
      </div>
      <PolRequestPresenter
        request={users}
        onSuccess={() => (
          <PolMultiSelectModal
            trigger={
              <PolButton variant="outline" className="w-full">
                Assignments
              </PolButton>
            }
            nameGetter={(x) => getFullName(x.Person)}
            options={users.data}
            value={assignments}
            onValueChanged={(x) => setAssignments(x)}
          ></PolMultiSelectModal>
        )}
      ></PolRequestPresenter>
      <PolButton onClick={handleUpdate} isLoading={isLoading} className="mt-2 w-full" variant="outline">
        Update
      </PolButton>
    </PolModal>
  );
}
