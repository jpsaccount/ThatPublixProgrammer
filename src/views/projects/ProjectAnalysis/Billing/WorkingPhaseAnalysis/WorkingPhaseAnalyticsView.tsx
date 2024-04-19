import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { BillableService } from "@/sdk/entities/billing/BillableService";
import { Expense } from "@/sdk/entities/billing/Expense";
import { RetainageItem } from "@/sdk/entities/billing/RetainageItems";
import { TimeActivity } from "@/sdk/entities/billing/TimeActivity";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import React, { useMemo } from "react";
import ProjectBillingQuickReview from "../ProjectBillingQuickReview";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { BarChart, LineChart } from "lucide-react";
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import BillableItemsAmountUsedChart from "../BillableItemsAmountUsedChart";
import PolHeading from "@/components/polComponents/PolHeading";
import { tryGetSum } from "@/sdk/utils/arrayUtils";
import PotentialOverestimateReasons from "./PotentialOverestimateReasons";

interface Props {
  workingPhases: WorkingPhase[];
}
export default function WorkingPhaseAnalyticsView({ workingPhases }: Props) {
  const workingPhaseIds = `["${workingPhases.map((x) => x.id).join(`","`)}"]`;
  const timeActivitiesRequest = useDbQuery(
    TimeActivity,
    `WHERE c.WorkingPhaseId IN ${workingPhaseIds} Order By c.ActivityDate ASC`,
  );

  const billableServiceRequest = useDbQuery(BillableService, `WHERE c.WorkingPhaseId IN ${workingPhaseIds}`);

  const expenseRequest = useDbQuery(Expense, `WHERE c.WorkingPhaseId IN ${workingPhaseIds}`);
  const retainageRequest = useDbQuery(RetainageItem, `WHERE c.WorkingPhaseId IN ${workingPhaseIds}`);
  const totalAmountAllotted = useMemo(() => tryGetSum(workingPhases.map((x) => x.AmountAllotted)), [workingPhases]);
  return (
    <PolRequestPresenter
      request={[timeActivitiesRequest, billableServiceRequest, expenseRequest]}
      onSuccess={() => (
        <div className="grid grid-flow-row gap-5">
          <ProjectBillingQuickReview
            expenses={expenseRequest.data}
            billableServices={billableServiceRequest.data}
            timeActivities={timeActivitiesRequest.data}
          />
          <div className="grid grid-flow-row">
            <PolHeading size={2} className="text-center">
              Activity Total
            </PolHeading>
            <BillableItemsAmountUsedChart
              limit={totalAmountAllotted}
              expenses={expenseRequest.data}
              timeActivities={timeActivitiesRequest.data}
              billableServices={billableServiceRequest.data}
            />
          </div>
          <PotentialOverestimateReasons
            limit={totalAmountAllotted}
            expenses={expenseRequest.data}
            timeActivities={timeActivitiesRequest.data}
            billableServices={billableServiceRequest.data}
          />
        </div>
      )}
    />
  );
}
