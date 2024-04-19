import { PolButton } from "@/components/polComponents/PolButton";
import { PolDatePicker } from "@/components/polComponents/PolDatePicker";
import { PolDropdown } from "@/components/polComponents/PolDropdown";
import PolInput from "@/components/polComponents/PolInput";
import PolModal from "@/components/polComponents/PolModal";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolMultiSelectModal from "@/components/PolMultiSelectModal";
import { useAuth } from "@/customHooks/auth";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { PunchListItemAssignment } from "@/sdk/childEntities/PunchListItemAssignment";
import { User } from "@/sdk/entities/core/User";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { Priority } from "@/sdk/enums/Priority";
import { Status } from "@/sdk/enums/Status";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { ReactNode, useEffect, useState } from "react";
import EditCheckList from "./EditCheckList";

interface Props {
  onItemCreated: () => void;
  punchListId: string;
  trigger?: ReactNode;
  onIsLoadingChange?: (val: boolean) => void;
}

export default function NewPunchListItem({ onItemCreated, trigger, punchListId, onIsLoadingChange }: Props) {
  const { user } = useAuth();
  const users = useDbQuery(User);
  const [open, setOpen] = useState(false);
  const mutation = useDbUpsert(PunchListItem);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErorr] = useState<string | null>(null);
  const [assignments, setAssingments] = useState<string[]>([]);

  const [newPunchListItem, setNewPunchListItem] = useState<PunchListItem | null>(null);

  useEffect(() => {
    if (open) return;
    setErorr(null);
    setNewPunchListItem(() => {
      const newItem = new PunchListItem();
      newItem.PunchListId = punchListId;
      newItem.Status = Status.NotStarted;
      return newItem;
    });
    setAssingments([]);
  }, [open]);

  const handleChange = (value: Partial<PunchListItem>) => {
    setNewPunchListItem((prev) => {
      return { ...prev, ...value };
    });
  };

  const handleCreate = async () => {
    if (!newPunchListItem?.Title) {
      setErorr("Please enter title");
      return;
    } else if (!newPunchListItem?.Description) {
      setErorr("Please enter description");
      return;
    } else if (!isUsable(newPunchListItem.Priority)) {
      setErorr("Please select priority");
      return;
    } else if (assignments.length === 0) {
      setErorr("Please select assignments");
      return;
    }

    setIsLoading(true);
    onIsLoadingChange && onIsLoadingChange(true);
    newPunchListItem!.Assignments = assignments.map((x) => {
      const newAssignment = new PunchListItemAssignment();
      newAssignment.AssignedToUserId = x;
      newAssignment.AssignedByUserId = user!.id;
      return newAssignment;
    });
    await mutation.mutateAsync(newPunchListItem).then(() => {
      onIsLoadingChange && onIsLoadingChange(false);
      onItemCreated();
      setOpen(false);
      setIsLoading(false);
    });
  };

  const priorities = [
    { name: "Very Low", value: Priority.VeryLow },
    { name: "Low", value: Priority.Low },
    { name: "Normal", value: Priority.Normal },
    { name: "High", value: Priority.High },
    { name: "Very High", value: Priority.VeryHigh },
  ];

  if (!newPunchListItem) {
    return null;
  }

  return (
    <PolModal
      heading="New Punch List Item"
      isOpen={open}
      onOpenChanged={setOpen}
      modalTrigger={
        <div className="w-full">
          {trigger ? (
            trigger
          ) : (
            <PolButton variant="outline" className="w-full">
              Create
            </PolButton>
          )}
        </div>
      }
    >
      <PolInput
        className="w-96 text-sm"
        label="Title"
        value={newPunchListItem.Title}
        onValueChanged={(x) => handleChange({ Title: x })}
      ></PolInput>
      <PolInput
        className="text-sm"
        placeholder="Type a description or add notes here"
        isMultiline={true}
        label="Description"
        value={newPunchListItem.Description}
        onValueChanged={(x) => handleChange({ Description: x })}
      ></PolInput>
      <PolDropdown
        className="mb-2"
        label="Priority"
        options={priorities}
        nameGetter={(x) => x.name}
        value={priorities.find((x) => x.value === newPunchListItem.Priority)}
        onValueChanged={(x) => handleChange({ Priority: x.value })}
      ></PolDropdown>
      <div className="mb-2 flex gap-2">
        <PolDatePicker
          label="Start Date"
          value={newPunchListItem.StartDate}
          onValueChanged={(x) => handleChange({ StartDate: x })}
        ></PolDatePicker>
        <PolDatePicker
          label="End Date"
          value={newPunchListItem.EndDate}
          onValueChanged={(x) => handleChange({ EndDate: x })}
        ></PolDatePicker>
      </div>
      <div className="my-2">
        <EditCheckList
          onShowOnCardChange={(x) => handleChange({ IsShowingCheckListItemsInCard: x })}
          showOnCard={newPunchListItem.IsShowingCheckListItemsInCard}
          checklist={newPunchListItem.CheckListItems}
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
            options={users.data!}
            value={assignments}
            onValueChanged={(x) => setAssingments(x)}
          ></PolMultiSelectModal>
        )}
      ></PolRequestPresenter>

      <PolMutationErrorPresenter customErrorMessage={error} mutation={mutation}></PolMutationErrorPresenter>
      <PolButton variant="outline" className="mt-2 w-full" isLoading={isLoading} onClick={handleCreate}>
        Create
      </PolButton>
    </PolModal>
  );
}
