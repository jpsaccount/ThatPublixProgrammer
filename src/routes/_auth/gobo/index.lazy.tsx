import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import GoboListView from "@/views/projectDatabases/gobo/GoboListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/gobo/")({
  component: withAccess(GoboListView, AccessKeys.ProjectDatabase),
});
