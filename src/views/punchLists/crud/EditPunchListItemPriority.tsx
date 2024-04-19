import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React, { ReactNode, useMemo, useState } from "react";

import { Priority } from "@/sdk/enums/Priority";
import PunchListItemPriority from "../PunchListItemPriority";
import { PunchListItem } from "@/sdk/entities/punchList/PunchListItem";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  punchListItem: PunchListItem;
  trigger?: ReactNode;
}

export default function EditPunchListItemPriority({ punchListItem, trigger }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useDbUpsert(PunchListItem);

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, priority: Priority) => {
    e.stopPropagation();
    setIsLoading(true);
    await mutation.mutateAsync({ ...punchListItem, Priority: priority });
    setIsLoading(false);
  };

  const options = useMemo(() => {
    return [Priority.VeryLow, Priority.Low, Priority.Normal, Priority.High, Priority.VeryHigh];
  }, []);
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {trigger ? (
            <div className="hover:cursor-pointer">{trigger}</div>
          ) : (
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex w-full items-center justify-between gap-1 rounded  p-1 hover:bg-gray-100"
            >
              Priority <p>{">"}</p>
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side="right" className="flex flex-col gap-1 bg-white">
          {options.map((x) => (
            <>
              {isLoading ? (
                <>
                  <PolSkeleton className="h-8 w-20"></PolSkeleton>
                </>
              ) : (
                <button
                  onClick={(e) => handleUpdate(e, x)}
                  className="flex h-8 w-full justify-start rounded p-1 hover:cursor-pointer hover:bg-gray-100"
                >
                  <PunchListItemPriority priority={x}></PunchListItemPriority>
                </button>
              )}
            </>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
