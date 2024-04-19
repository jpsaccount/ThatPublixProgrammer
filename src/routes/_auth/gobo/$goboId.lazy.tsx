import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import GoboDetail from "@/views/projectDatabases/gobo/GoboDetail";
import GoboListView from "@/views/projectDatabases/gobo/GoboListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/gobo/$goboId")({
  component: withAccess(GoboListView, AccessKeys.ProjectDatabase),
});

export const useGoboDetailParams = Route.useParams;
