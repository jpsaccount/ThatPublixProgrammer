import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import EquipmentTypeEditorView from "@/views/projectDatabases/equipmentTypeGroups/EquipmentTypeEditorView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/equipment-type-groups/$equipmentTypeGroupId/$equipmentTypeId")({
  component: withAccess(EquipmentTypeEditorView, AccessKeys.ProjectDatabase),
});

export const useEquipmentTypeEditorViewParams = Route.useParams;
