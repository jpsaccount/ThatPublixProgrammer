import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import DatasheetDetailView from "@/views/projectDatabases/datasheets/DatasheetDetailView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/datasheets/$id")({
  component: withAccess(DatasheetDetailView, AccessKeys.ProjectDatabase),
});
