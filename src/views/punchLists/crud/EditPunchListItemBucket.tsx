import PolText from "@/components/polComponents/PolText";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { PunchList } from "@/sdk/entities/punchList/PunchList";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import React from "react";

interface Props {
  punchLists: PunchList[];
  punchListItem: PunchListItem;
  onIsLoadingChange?: (val: boolean) => void;
}

export default function EditPunchListItemBucket({ punchLists, punchListItem, onIsLoadingChange }: Props) {
  if (!punchListItem) return null;
  const mutate = useDbUpsert(PunchListItem);

  const handleClick = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: string) => {
    e.stopPropagation();
    onIsLoadingChange(true);

    const newItem = {
      ...punchListItem,
      PunchListId: id,
    };
    console.log(newItem);

    await mutate.mutateAsync(newItem);
    onIsLoadingChange(false);
  };

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger>
          <span className="truncate rounded p-2 hover:bg-gray-300">
            {punchLists.find((punchList) => punchList.id === punchListItem.PunchListId)?.Title}
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-white">
          <div className="flex flex-col">
            <PolText type="bold">Available Buckets</PolText>
            {punchLists.map((x) => (
              <span onClick={(e) => handleClick(e, x.id)} className=" p-1 text-sm hover:bg-gray-100">
                {x.Title}
              </span>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
