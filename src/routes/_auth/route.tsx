import NavbarSidebarLayout from "@/components/layouts/NavLayout";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { useAuth } from "@/customHooks/auth";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import NotFoundView from "@/views/NotFoundView";
import { Outlet, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
  notFoundComponent: NotFoundView,
});

function LayoutComponent() {
  const auth = useAuth();

  const navigate = usePolNavigate();

  useEffect(() => {
    if (auth.isLoading === false) {
      if (isUsable(auth.user) === false) {
        navigate({ to: "/auth/login", search: { redirect: location.pathname + location.search } });
      } else if (isUsable(auth.activeTenant) === false) {
        navigate({ to: "/auth/active-organization", search: { redirect: location.pathname + location.search } });
      }
    }
  }, [auth]);

  return (
    <PolRequestPresenter
      request={[]}
      ready={isUsable(auth.activeTenant)}
      onSuccess={() => (
        <NavbarSidebarLayout>
          <Outlet />
        </NavbarSidebarLayout>
      )}
    />
  );
}
