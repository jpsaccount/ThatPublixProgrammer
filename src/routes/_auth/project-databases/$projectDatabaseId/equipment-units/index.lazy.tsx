import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import EquipmentUnitListView from "@/views/projectDatabases/equipmentUnit/EquipmentUnitListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/project-databases/$projectDatabaseId/equipment-units/")({
  component: withAccess(EquipmentUnitListView, AccessKeys.ProjectDatabase),
});

export const useEquipmentUnitListViewParams = Route.useParams;
