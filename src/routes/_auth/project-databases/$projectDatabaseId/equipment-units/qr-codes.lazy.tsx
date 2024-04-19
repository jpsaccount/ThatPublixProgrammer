import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import EquipmentUnitQrPrintView from "@/views/projectDatabases/equipmentUnit/printviews/EquipmentUnitQrPrintView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/project-databases/$projectDatabaseId/equipment-units/qr-codes")({
  component: withAccess(EquipmentUnitQrPrintView, AccessKeys.ProjectDatabase),
});

export const useEquipmentUnitQrPrintViewParams = Route.useParams;
