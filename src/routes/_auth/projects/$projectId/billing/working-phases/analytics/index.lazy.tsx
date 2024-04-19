import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ProjectBillingWorkingPhaseCategoryAnalyticsPage from "@/views/projects/ProjectAnalysis/Billing/ProjectBillingWorkingPhaseCategoryAnalyticsPage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/projects/$projectId/billing/working-phases/analytics/")({
  component: withAccess(ProjectBillingWorkingPhaseCategoryAnalyticsPage, AccessKeys.ProjectAdmin),
});

export const useProjectBillingWorkingPhaseCategoryAnalyticsPageParams = Route.useParams;
