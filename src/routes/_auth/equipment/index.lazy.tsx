import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import EquipmentListView from "@/views/projectDatabases/equipment/EquipmentListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/equipment/")({
  component: withAccess(EquipmentListView, AccessKeys.ProjectDatabase),
});
