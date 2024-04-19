import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import EquipmentTypeList from "@/views/projectDatabases/equipmentTypes/EquipmentTypeList";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/equipment-type/")({
  component: withAccess(EquipmentTypeList, AccessKeys.ProjectDatabase),
});
