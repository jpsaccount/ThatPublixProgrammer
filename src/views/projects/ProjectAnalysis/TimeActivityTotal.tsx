import React from "react";
import { TimeActivity } from "@sdk/./entities/billing/TimeActivity";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toUsdString } from "@sdk/./utils/moneyUtils";

function getTotalAmount(timeActivity: TimeActivity): number {
  return timeActivity.Hours * timeActivity.BillableRate;
}

interface Props {
  timeActivity: TimeActivity;
}

const TimeActivityTotal = ({ timeActivity }: Props) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger className="ml-auto ">
          <div className="font-medium">{`${toUsdString(getTotalAmount(timeActivity))}`}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {`${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(timeActivity.BillableRate)}/hr x ${timeActivity.Hours} hours`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TimeActivityTotal;
