import { time } from "console";
import { TimeActivity } from "@sdk/./entities/billing/TimeActivity";
import TimeItemTotal from "./TimeActivityTotal";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { User } from "@/sdk/entities/core/User";
import TimeActivityUserDescription from "./TimeActivityUserDescription";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  timeActivities: TimeActivity[];
}

export function RecentTimeActivities({ timeActivities }: Props) {
  return (
    <ScrollArea className="space-y-4 h-full">
      <div className="grid grid-flow-row">
        {timeActivities.map((timeActivity) => (
          <div key={timeActivity.id} className="flex items-center border-b pb-4 mt-4">
            <div className="space-y-1 w-full pr-5">
              <TimeActivityUserDescription timeActivity={timeActivity}></TimeActivityUserDescription>
              <p className="text-sm text-muted-foreground text-start">
                {timeActivity.ActivityDate.format("MM/DD/YYYY")}
              </p>
            </div>
            <TimeItemTotal timeActivity={timeActivity}></TimeItemTotal>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
