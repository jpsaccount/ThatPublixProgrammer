import { redirect } from "@/components/route/Redirect";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { Mobile } from "@/views/projectDatabases/equipmentUnit/tag/Mobile";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_auth/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/readonly-tag",
)({
  // component: withAccess(Mobile, AccessKeys.ProjectDatabase),
  component: redirect("/project-databases/$projectDatabaseId/equipment-units/$equipmentUnitId/editor"),
});

export const useEquipmentUnitTagViewParams = Route.useParams;
