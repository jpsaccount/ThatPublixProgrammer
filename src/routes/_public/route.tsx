import { useAuth } from "@/customHooks/auth";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { TenantUserAccess } from "@/sdk/entities/auth/TenantUserAccess";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import NotFoundView from "@/views/NotFoundView";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: NotFoundView,
});
