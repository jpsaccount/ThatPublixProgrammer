import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ProjectView from "@/views/projects/ProjectView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/projects/")({
  component: withAccess(ProjectView, AccessKeys.ProjectDatabase),
});
