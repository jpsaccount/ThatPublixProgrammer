import { createLazyFileRoute } from "@tanstack/react-router";
import ActiveTenantPage from "@/views/organization/management/ActiveTenantPage";

export const Route = createLazyFileRoute("/_public/auth/active-organization")({
  component: ActiveTenantPage,
});
