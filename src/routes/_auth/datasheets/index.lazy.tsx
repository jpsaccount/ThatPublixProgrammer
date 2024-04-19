import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import DatasheetListPage from "@/views/projectDatabases/datasheets/DatasheetListPage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/datasheets/")({
  component: withAccess(DatasheetListPage, AccessKeys.ProjectDatabase),
});
