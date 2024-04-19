import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ClientView from "@/views/projects/client/ClientView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/clients/")({
  component: withAccess(ClientView, AccessKeys.ProjectDatabase),
});
