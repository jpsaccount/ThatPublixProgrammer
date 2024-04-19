import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import LampListView from "@/views/projectDatabases/lamps/LampListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/lamps/")({
  component: withAccess(LampListView, AccessKeys.ProjectDatabase),
});
