import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import WorkingPhaseAnalyticsView from "./WorkingPhaseAnalysis/WorkingPhaseAnalyticsView";
import PhaseBillingTypeIcon from "./PhaseBillingTypeIcon";
import { useProjectBillingWorkingPhaseAnalyticsPageParams } from "@/routes/_auth/projects/$projectId/billing/working-phases/analytics/$workingPhaseId.lazy";

export default function ProjectBillingWorkingPhaseAnalyticsPage() {
  const { workingPhaseId } = useProjectBillingWorkingPhaseAnalyticsPageParams();
  const workingPhaseRequest = useDbQueryFirst(WorkingPhase, `WHERE c.id = "${workingPhaseId}"`);
  const billingType = workingPhaseRequest.data?.PhaseBillingType;

  return (
    <PolRequestPresenter
      request={[workingPhaseRequest]}
      onSuccess={() => (
        <div className="grid grid-flow-row gap-5 p-2">
          <div className="grid grid-flow-col grid-cols-[auto_1fr]">
            <PhaseBillingTypeIcon phaseBillingType={billingType} className="mx-2 my-auto ml-auto" />
            <PolHeading>{workingPhaseRequest.data.Title}</PolHeading>
          </div>
          <WorkingPhaseAnalyticsView workingPhases={[workingPhaseRequest.data]} />
        </div>
      )}
    />
  );
}
