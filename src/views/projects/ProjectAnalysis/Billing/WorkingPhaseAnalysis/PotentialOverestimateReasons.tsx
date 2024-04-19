import PolHeading from "@/components/polComponents/PolHeading";
import PolText from "@/components/polComponents/PolText";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { Expense } from "@/sdk/entities/billing/Expense";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { getAverage, groupBy, groupByMultipleCriteria, tryGetSum } from "@/sdk/utils/arrayUtils";
import React, { useMemo } from "react";
import { HighUsageTimeView } from "./HighUsageTimeView";

interface Props {
  timeActivities: TimeActivity[];
  expenses: Expense[];
  billableServices: BillableService[];
  limit?: number;
}
export default function PotentialOverestimateReasons({ timeActivities, expenses, billableServices, limit }: Props) {
  const totalTimeAmount = useMemo(
    () => tryGetSum(timeActivities.map((x) => x.BillableRate * x.Hours)),
    [timeActivities],
  );

  const totalExpenseAmounts = useMemo(() => tryGetSum(expenses.map((x) => x.AmountUsd)), [expenses]);

  const totalBillableServices = useMemo(() => tryGetSum(billableServices.map((x) => x.AmountUsd)), [billableServices]);

  const highUsageTimeActivities = useMemo(() => {
    const groupedTime = groupByMultipleCriteria(timeActivities, ["RoleId", "TaskId", "SubTaskId", "UserId"]);
    const averageAmount = getAverage(groupedTime.flatMap((x) => x.items).map((x) => x.BillableRate * x.Hours));
    console.log("average", averageAmount);
    return groupedTime
      .filter((x) => tryGetSum(x.items.flatMap((x) => x.BillableRate * x.Hours)) > averageAmount * 10)
      .sort(
        (a, b) =>
          tryGetSum(b.items.flatMap((x) => x.BillableRate * x.Hours)) -
          tryGetSum(a.items.flatMap((x) => x.BillableRate * x.Hours)),
      );
  }, [timeActivities]);

  if (limit * 1.2 < totalTimeAmount + totalExpenseAmounts + totalBillableServices) {
    return (
      highUsageTimeActivities.length > 0 && (
        <div className="grid grid-flow-row rounded bg-background-50 p-5">
          <PolHeading size={4} className="text-red-500">
            Allotted Amount Overage!
          </PolHeading>
          <PolText type="muted">Here are some high usage items</PolText>
          <div className="flex h-fit max-h-96 w-fit flex-row flex-wrap overflow-y-auto">
            {highUsageTimeActivities.map((x) => (
              <HighUsageTimeView items={x.items} />
            ))}
          </div>
        </div>
      )
    );
  }
  return;
}
