import PolCheckbox from "@/components/polComponents/PolCheckbox";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { User } from "@/sdk/entities/core/User";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { Filter } from "lucide-react";
import React, { useEffect, useMemo } from "react";

interface Props {
  punchLists: PunchList[];
  filters: { property: string; entityId: string }[];
  onFilterChange: (val: { property: string; entityId: string }[]) => void;
}

export default function PunchListItemsFilter({ punchLists, filters, onFilterChange }: Props) {
  const users = useDbQuery(User);

  const punchListItems = useDbQuery(
    PunchListItem,
    `WHERE c.PunchListId IN [${punchLists.map((listId) => `"` + listId.id + `"`)}]`,
  );
  const availableUsers = useMemo(() => {
    const userss = [];

    if (!punchListItems.data) return [];

    punchListItems.data.forEach((item) => {
      item.Assignments.forEach((assignment) => {
        if (!userss.includes(assignment.AssignedToUserId)) {
          userss.push(assignment.AssignedToUserId);
        }
      });
    });
    return userss;
  }, [punchListItems]);

  return (
    <PolRequestPresenter
      request={[users]}
      onSuccess={() => (
        <Popover>
          <PopoverTrigger>
            <Filter></Filter>
          </PopoverTrigger>
          <PopoverContent className="bg-white">
            <div className="flex flex-col gap-1">
              <span>Users</span>
              {availableUsers.map((x) => (
                <FilterItem
                  property={"userId"}
                  onFilterChange={onFilterChange}
                  filters={filters}
                  displayTitle={getFullName(users.data.find((user) => user.id === x).Person)}
                  entityId={x}
                ></FilterItem>
              ))}
              <span>Lists</span>
              {punchLists.map((x) => (
                <FilterItem
                  displayTitle={x.Title}
                  entityId={x.id}
                  filters={filters}
                  onFilterChange={onFilterChange}
                  property={"punchListId"}
                ></FilterItem>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    ></PolRequestPresenter>
  );
}

function FilterItem({
  displayTitle,
  entityId,
  filters,
  onFilterChange,
  property,
}: {
  displayTitle: string;
  entityId: string;
  filters: { property: string; entityId: string }[];
  onFilterChange: (val: { property: string; entityId: string }[]) => void;
  property: string;
}) {
  const handleClick = () => {
    if (filters.find((x) => x.entityId === entityId)) {
      onFilterChange([...filters.filter((filter) => filter.entityId !== entityId)]);
    } else {
      onFilterChange([...filters, { property, entityId }]);
    }
  };

  return (
    <span className="flex gap-1">
      <PolCheckbox
        onClick={handleClick}
        value={filters.find((x) => x.entityId === entityId) !== undefined}
      ></PolCheckbox>
      <PolText type="small">{displayTitle}</PolText>
    </span>
  );
}
