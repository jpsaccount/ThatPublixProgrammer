import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import OrganizationDetailPage from "@/views/organization/management/OrganizationDetailPage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/organization/")({
  component: withAccess(OrganizationDetailPage, AccessKeys.Owner),
});
