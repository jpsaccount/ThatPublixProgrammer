import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import UnitsListView from "@/views/projectDatabases/equipmentUnit/UnitsListView";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/project-databases/$projectDatabaseId/equipment-units/units")({
  component: withAccess(UnitsListView, AccessKeys.ProjectDatabase),
});

export const useUnitsListViewParams = Route.useParams;
