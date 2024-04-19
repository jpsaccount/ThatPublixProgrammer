import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ProjectBillingWorkingPhasePage from "@/views/projects/ProjectAnalysis/Billing/ProjectBillingWorkingPhasePage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/projects/$projectId/billing/working-phases/")({
  component: withAccess(ProjectBillingWorkingPhasePage, AccessKeys.ProjectAdmin),
});

export const useProjectBillingWorkingPhasePageParams = Route.useParams;
