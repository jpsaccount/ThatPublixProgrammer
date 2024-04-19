import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ProjectDatabaseListView from "@/views/projectDatabases/projectDatabaseHomeView/ProjectDatabaseListPage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/project-databases/")({
  component: withAccess(ProjectDatabaseListView, AccessKeys.ProjectDatabase),
});
