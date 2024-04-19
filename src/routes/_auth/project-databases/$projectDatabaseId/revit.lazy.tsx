import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import RevitIneractionView from "@/views/projectDatabases/revitImporter/RevitInteractionView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/project-databases/$projectDatabaseId/revit")({
  component: withAccess(RevitIneractionView, AccessKeys.ProjectDatabase),
});

export const useRevitInteractionViewParams = Route.useParams;
