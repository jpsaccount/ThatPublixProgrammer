import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import EquipmentTypeGroupListView from "@/views/projectDatabases/equipmentTypeGroups/EquipmentTypeGroupListView";
import LightingFixtureConfigurationListView from "@/views/projectDatabases/equipmentTypeGroups/LightingFixtureConfigurationListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/equipment-type-groups/$equipmentTypeGroupId/")({
  component: withAccess(LightingFixtureConfigurationListView, AccessKeys.ProjectDatabase),
});

export const useEquipmentTypeGroupListViewParams = Route.useParams;
