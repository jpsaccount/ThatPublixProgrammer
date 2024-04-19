import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ClientDetailView from "@/views/projects/client/ClientDetailView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/clients/$id")({
  component: withAccess(ClientDetailView, AccessKeys.ProjectDatabase),
});

export const useClientDetailViewParams = Route.useParams;
