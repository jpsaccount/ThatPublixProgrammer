import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { WorkingPhaseCategory } from "@/sdk/entities/billing/WorkingPhaseCategory";
import React from "react";
import WorkingPhaseAnalyticsView from "./WorkingPhaseAnalysis/WorkingPhaseAnalyticsView";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";

export default function ProjectBillingWorkingPhaseCategoryAnalyticsPage() {
  const [workingPhaseCategoryId, setWorkingPhaseCategoryId] = useSearchParamState("workingPhaseCategory", "");
  const workingPhaseCategoryRequest = useDbQueryFirst(WorkingPhaseCategory, `WHERE c.id = "${workingPhaseCategoryId}"`);
  const workingPhaseRequest = useDbQuery(WorkingPhase, `WHERE c.CategoryId = "${workingPhaseCategoryId}"`);
  return (
    <PolRequestPresenter
      request={[workingPhaseCategoryRequest, workingPhaseRequest]}
      onSuccess={() => (
        <div className="grid grid-flow-row gap-5 p-2">
          <div className="grid grid-flow-col">
            <PolHeading>{workingPhaseCategoryRequest.data.Title}</PolHeading>
          </div>
          <WorkingPhaseAnalyticsView workingPhases={workingPhaseRequest.data} />
        </div>
      )}
    />
  );
}
