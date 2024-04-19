import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ProjectDatabaseView from "@/views/projectDatabases/ProjectDatabaseView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/project-databases/$projectDatabaseId/")({
  component: withAccess(ProjectDatabaseView, AccessKeys.ProjectDatabase),
});

export const useProjectDatabaseViewParams = Route.useParams;
