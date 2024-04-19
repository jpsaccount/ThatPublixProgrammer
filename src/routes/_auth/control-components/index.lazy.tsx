import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ControlComponentListView from "@/views/projectDatabases/controlComponents/ControlComponentListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/control-components/")({
  component: withAccess(ControlComponentListView, AccessKeys.ProjectDatabase),
});
