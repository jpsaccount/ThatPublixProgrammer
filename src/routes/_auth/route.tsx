import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { isUsable } from "@/utilities/usabilityUtils";
import NotFoundView from "@/views/NotFoundView";
import { Outlet, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
  notFoundComponent: NotFoundView,
});

function LayoutComponent() {
  return <PolRequestPresenter request={[]} onSuccess={() => <Outlet />} />;
}
