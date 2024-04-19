import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import React, { useMemo, useState } from "react";
import EditPunchList from "../crud/EditPunchList";
import { ChevronDown } from "lucide-react";
import { EditPunchListItem } from "../crud/EditPunchListItem";
import { Status } from "@/sdk/enums/Status";
import NewPunchListItem from "../crud/NewPunchListItem";
import { QueryObserverBaseResult, QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface Props {
  punchLists: PunchList[];
  punchListItems: PunchListItem[];
  refetch: () => void;
  onIsLoadingChange: (val: boolean) => void;
}

export default function PunchListContainer({ punchLists, punchListItems, refetch, onIsLoadingChange }: Props) {
  const groupedPunchListItems = useMemo(() => {
    return punchLists.map((list) => {
      const items = punchListItems.filter((item) => item.PunchListId === list.id && item.Status === Status.NotStarted);
      return { list, items };
    });
  }, [punchLists, punchListItems]);

  return (
    <div className="flex flex-col gap-2">
      {groupedPunchListItems.map((items) => (
        <PunchListToggle refetch={refetch} onIsLoadingChange={onIsLoadingChange} items={items}></PunchListToggle>
      ))}
    </div>
  );
}

function PunchListToggle({
  items,
  refetch,
  onIsLoadingChange,
}: {
  items: { list: PunchList; items: PunchListItem[] };
  refetch: () => void;
  onIsLoadingChange: (val: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    document.getElementById(`down-${items.list.id}`)?.classList.toggle("animate-180-out");
    document.getElementById(`down-${items.list.id}`)?.classList.toggle("animate-180-in");
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <span
        className="text-md flex w-96 items-center justify-between rounded p-2 shadow-md hover:cursor-pointer"
        onClick={toggleOpen}
      >
        {items.list.Title}
        <ChevronDown id={`down-${items.list.id}`} className="animate-180-out" size={15}></ChevronDown>
      </span>
      {open && (
        <div className="pt-2">
          <NewPunchListItem
            onIsLoadingChange={onIsLoadingChange}
            onItemCreated={() => refetch()}
            punchListId={items.list.id}
          ></NewPunchListItem>
          <PunchListItems items={items.items}></PunchListItems>
        </div>
      )}
    </div>
  );
}

function PunchListItems({ items }: { items: PunchListItem[] }) {
  if (items.length === 0) {
    return <div className="mt-2 flex justify-center">All items complete</div>;
  }
  return (
    <div>
      {items.map((item) => (
        <EditPunchListItem punchListItem={item}></EditPunchListItem>
      ))}
    </div>
  );
}
