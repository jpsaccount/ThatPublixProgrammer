import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import EquipmentTypeGroupListView from "@/views/projectDatabases/equipmentTypeGroups/EquipmentTypeGroupListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/equipment-type-groups/")({
  component: withAccess(EquipmentTypeGroupListView, AccessKeys.ProjectDatabase),
});
