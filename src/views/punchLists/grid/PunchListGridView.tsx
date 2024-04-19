import EntityTableView from "@/components/polComponents/EntityTableViews/EntityTableView";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolTable from "@/components/polComponents/PolTable";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import React, { useEffect, useMemo, useState } from "react";
import UserAssignments from "../UserAssignments";
import CircleCheckBox from "@/components/polComponents/CircleCheckBox";
import { Status } from "@/sdk/enums/Status";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { set } from "node_modules/cypress/types/lodash";
import PunchListItemPriority from "../PunchListItemPriority";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { usePunchListHomeViewParams } from "@/routes/_auth/project-databases/$projectDatabaseId/punch-lists/index.lazy";
import EditPunchListItemPriority from "../crud/EditPunchListItemPriority";
import EditPunchListItemBucket from "../crud/EditPunchListItemBucket";
import { EditPunchListItem } from "../crud/EditPunchListItem";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import { group } from "console";

interface Props {
  punchLists: PunchList[];
  onIsLoadingChange: (val: boolean) => void;
  search: string;
  filters: { property: string; entityId: string }[];
}

export default function PunchListGridView({ punchLists, filters, onIsLoadingChange, search }: Props) {
  const groupedFilters = useMemo(() => {
    const userIds = filters.filter((x) => x.property === "userId");
    const statuses = filters.filter((x) => x.property === "status");
    const punchListIds = filters.filter((x) => x.property === "punchListId");

    return {
      userIds,
      statuses,
      punchListIds,
    };
  }, [filters]);

  const parseFilters = useMemo(() => {
    let userIdsQuery = "",
      statusesQuery = "",
      punchListIdsQuery = "";

    if (groupedFilters.userIds.length > 0) {
      userIdsQuery = `AND c.Assignments in [${groupedFilters.userIds.map((userId) => `"${userId.entityId}"`)}]`;
    }

    if (groupedFilters.statuses.length > 0) {
      statusesQuery = `AND c.Status in [${groupedFilters.statuses.map((status) => `"${status.entityId}"`)}]`;
    }

    if (groupedFilters.punchListIds.length > 0) {
      punchListIdsQuery = `AND c.PunchListId IN [${groupedFilters.punchListIds.map((id) => `"${id.entityId}"`)}]`;
    }
    return "";
    return ` ${userIdsQuery} ${statusesQuery} ${punchListIdsQuery}`.trim();
  }, [groupedFilters]);

  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    `WHERE c.Title CONTAINS "{0}"${groupedFilters.punchListIds.length === 0 && `AND c.PunchListId IN ["${punchLists?.flatMap((x) => x.id).join('", "')}"]`}${parseFilters}`,
    `c.PunchListId IN ["${punchLists?.flatMap((x) => x.id).join('", "')}"]`,
    false,
  );
  const punchListItems = useDbQuery(PunchListItem, query);

  useEffect(() => {
    setSearchText(search);
  }, [search]);

  const mutation = useDbUpsert(PunchListItem);

  const handleMutation = async (punchListItem: PunchListItem, change: Partial<PunchListItem>) => {
    onIsLoadingChange(true);
    await mutation.mutateAsync({ ...punchListItem, ...change });
    onIsLoadingChange(false);
  };

  return (
    <PolRequestPresenter
      request={punchListItems}
      onSuccess={() => (
        <EntityTableView
          data={punchListItems.data}
          rowWrapper={(children, row) => <EditPunchListItem punchListItem={row} trigger={children}></EditPunchListItem>}
          columns={[
            {
              id: "",
              idGetter: (x) => (
                <CircleCheckBox
                  isChecked={x.Status === Status.Completed}
                  onChange={(newValue) => {
                    if (newValue) {
                      handleMutation(x, { Status: Status.Completed });
                    } else {
                      handleMutation(x, { Status: Status.NotStarted });
                    }
                  }}
                ></CircleCheckBox>
              ),
              width: 25,
            },
            { id: "Title" },
            {
              id: "Assignments",
              idGetter: (x) => (
                <div className="flex">
                  <UserAssignments userIds={x.Assignments.map((x) => x.AssignedToUserId)}></UserAssignments>
                </div>
              ),
              width: 175,
            },
            {
              id: "Start Date",
              idGetter: (x) => x.StartDate?.format("MM/DD/YYYY"),
              width: 100,
              align: "left",
            },
            { id: "End Date", idGetter: (x) => x.EndDate?.format("MM/DD/YYYY"), width: 100, align: "left" },
            {
              id: "Bucket",
              width: 200,
              idGetter: (x) => (
                <EditPunchListItemBucket
                  onIsLoadingChange={onIsLoadingChange}
                  punchListItem={x}
                  punchLists={punchLists}
                ></EditPunchListItemBucket>
              ),
            },
            {
              id: "Priority",
              idGetter: (x) => (
                <EditPunchListItemPriority
                  punchListItem={x}
                  trigger={
                    <span className="rounded p-1 hover:cursor-pointer hover:bg-gray-300">
                      <PunchListItemPriority priority={x.Priority}></PunchListItemPriority>
                    </span>
                  }
                ></EditPunchListItemPriority>
              ),
              width: 125,
            },
          ]}
        ></EntityTableView>
      )}
    ></PolRequestPresenter>
  );
}
