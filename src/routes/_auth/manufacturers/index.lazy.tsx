import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ManufacturersListView from "@/views/projectDatabases/manufacturers/ManufacturersListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/manufacturers/")({
  component: withAccess(ManufacturersListView, AccessKeys.ProjectDatabase),
});
