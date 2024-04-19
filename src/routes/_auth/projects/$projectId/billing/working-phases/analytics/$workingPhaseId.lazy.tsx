import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ProjectBillingWorkingPhaseAnalyticsPage from "@/views/projects/ProjectAnalysis/Billing/ProjectBillingWorkingPhaseAnalyticsPage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/projects/$projectId/billing/working-phases/analytics/$workingPhaseId")(
  {
    component: withAccess(ProjectBillingWorkingPhaseAnalyticsPage, AccessKeys.ProjectAdmin),
  },
);

export const useProjectBillingWorkingPhaseAnalyticsPageParams = Route.useParams;
