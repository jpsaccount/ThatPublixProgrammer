import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ControlComponentDetailView from "@/views/projectDatabases/controlComponents/ControlComponentDetailView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/control-components/$controlComponentId")({
  component: withAccess(ControlComponentDetailView, AccessKeys.ProjectDatabase),
});
