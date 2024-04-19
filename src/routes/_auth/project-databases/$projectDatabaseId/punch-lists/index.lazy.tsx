import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import PunchListHomeView from "@/views/punchLists/PunchListHomeView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/project-databases/$projectDatabaseId/punch-lists/")({
  component: withAccess(PunchListHomeView, AccessKeys.ProjectDatabase),
});

export const usePunchListHomeViewParams = Route.useParams;
