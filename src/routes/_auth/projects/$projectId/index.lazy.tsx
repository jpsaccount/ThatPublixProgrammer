import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ProjectDetailView from "@/views/projects/ProjectAnalysis/ProjectDetailView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/projects/$projectId/")({
  component: withAccess(ProjectDetailView, AccessKeys.ProjectDatabase),
});

export const useProjectDetailViewParams = Route.useParams;
