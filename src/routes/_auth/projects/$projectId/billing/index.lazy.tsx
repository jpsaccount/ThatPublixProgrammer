import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ProjectBillingMainPage from "@/views/projects/ProjectAnalysis/Billing/ProjectBillingMainPage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/projects/$projectId/billing/")({
  component: withAccess(ProjectBillingMainPage, AccessKeys.ProjectAdmin),
});

export const useProjectBillingPageParams = Route.useParams;
