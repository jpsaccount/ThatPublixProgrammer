import { PolButton } from "@/components/polComponents/PolButton";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { Status } from "@/sdk/enums/Status";
import { useState, useRef } from "react";
import CheckListCardView from "./CheckListCardView";
import { EditPunchListItem } from "./crud/EditPunchListItem";
import FinishPunchListItem from "./crud/FinishPunchListItem";
import PunchListItemPriority from "./PunchListItemPriority";
import UserAssignments from "./UserAssignments";
import { usePunchListHomeViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/punch-lists/index.lazy";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PolIcon from "@/components/PolIcon";
import UserProfilePicture from "@/components/navbar/UserProfilePicture";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import CopyPunchListItemLink from "./crud/CopyPunchListItemLink";
import DeletePunchListItem from "./crud/DeletePunchListItem";
import EditPunchListItemPriority from "./crud/EditPunchListItemPriority";
import { User } from "@/sdk/entities/core/User";

export function PunchListItemContainer({
  punchListItem,
  refetches,
}: {
  punchListItem: PunchListItem;
  refetches?: (() => void)[];
}) {
  const [optionsShown, setOptionsShown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [open, setOpen] = useState(false);
  const onFinished = () => {
    refetches?.forEach((x) => x());
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOptionsShown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOptionsShown(false);
    }, 100);
  };

  return (
    <EditPunchListItem
      punchListItem={punchListItem}
      trigger={
        <PolButton
          variant="outline"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex h-fit w-full flex-col rounded border p-2 hover:cursor-pointer hover:bg-white hover:shadow-md"
        >
          <div className="flex w-full items-center text-gray-700">
            {punchListItem.Status !== Status.Completed && (
              <FinishPunchListItem onFinished={onFinished} punchListItem={punchListItem}></FinishPunchListItem>
            )}

            <p className="mr-1 font-light">{punchListItem.Title}</p>
            {punchListItem.Status !== Status.Completed && (
              <UserAssignments userIds={punchListItem.Assignments.map((x) => x.AssignedToUserId)}></UserAssignments>
            )}
            {punchListItem.Status !== Status.Completed && (
              <span className="ml-auto">
                <PunchListItemPriority priority={punchListItem.Priority}></PunchListItemPriority>
              </span>
            )}
            {punchListItem.Status !== Status.Completed && (optionsShown || open) && (
              <PunchListItemOptions
                punchListItem={punchListItem}
                open={open}
                onOpenChange={setOpen}
              ></PunchListItemOptions>
            )}
          </div>
          {punchListItem.CheckListItems.length > 0 && punchListItem.IsShowingCheckListItemsInCard && (
            <CheckListCardView checkList={punchListItem.CheckListItems}></CheckListCardView>
          )}
          {punchListItem.Status === Status.Completed && punchListItem.StatusChangedByUserId && (
            <CompletedBy punchListItem={punchListItem}></CompletedBy>
          )}
        </PolButton>
      }
    ></EditPunchListItem>
  );
}
function PunchListItemOptions({
  punchListItem,
  open,
  onOpenChange,
}: {
  punchListItem: PunchListItem;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const { projectDatabaseId } = usePunchListHomeViewParams();
  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
  };
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <span onClick={handleClick} className="ml-1 h-fit w-fit rounded p-0.5 hover:cursor-pointer hover:bg-gray-200">
          <PolIcon size="20" name="MoreHorizontal"></PolIcon>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1 bg-white">
        <EditPunchListItemPriority punchListItem={punchListItem}></EditPunchListItemPriority>
        <CopyPunchListItemLink
          projectDatabaseId={projectDatabaseId}
          punchListItem={punchListItem}
        ></CopyPunchListItemLink>
        <DeletePunchListItem punchListItem={punchListItem}></DeletePunchListItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CompletedBy({ punchListItem }: { punchListItem: PunchListItem }) {
  const user = useDbQueryFirst(User, `WHERE c.id = "${punchListItem.StatusChangedByUserId}"`);
  return (
    <PolRequestPresenter
      onSuccess={() => (
        <div className="mt-2 flex items-center gap-2 border-t pt-2">
          <UserProfilePicture userId={user.data.id} className="m-0 h-7 w-7"></UserProfilePicture>
          <PolText type="small">Completed by {getFullName(user.data.Person)}</PolText>
        </div>
      )}
      request={user}
    />
  );
}
