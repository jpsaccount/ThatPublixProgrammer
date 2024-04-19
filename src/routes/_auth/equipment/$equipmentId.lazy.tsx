import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import EquipmentEditorView from "@/views/projectDatabases/equipment/EquipmentEditorView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/equipment/$equipmentId")({
  component: withAccess(EquipmentEditorView, AccessKeys.ProjectDatabase),
});

export const useEquipmentEditorViewParams = Route.useParams;
