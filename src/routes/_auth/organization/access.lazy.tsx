import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import OrganizationPageView from "@/views/organization/management/OrganizationPageView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/organization/access")({
  component: withAccess(OrganizationPageView, AccessKeys.Owner),
});
