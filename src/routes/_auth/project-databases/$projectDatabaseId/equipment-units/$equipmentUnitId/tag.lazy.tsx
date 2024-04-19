import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import EquipmentUnitEditorView from "@/views/projectDatabases/equipmentUnit/EquipmentUnitEditorView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_auth/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/tag",
)({
  component: withAccess(EquipmentUnitEditorView, AccessKeys.ProjectDatabase),
});

export const useEquipmentUnitEditorViewParams = Route.useParams;
