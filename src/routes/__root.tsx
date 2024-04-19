import { useToast } from "@/components/ui/use-toast";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { isDevEnvironment } from "@/utilities/devUtils";
import NotFoundView from "@/views/NotFoundView";
import { createRootRoute, createRootRouteWithContext, Outlet, ScrollRestoration } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AxiosError } from "axios";
import { useEffect } from "react";

export const Route = createRootRouteWithContext()({
  component: Root,
  notFoundComponent: NotFoundView,
});

function Root() {
  const navigation = usePolNavigate();
  const { toast } = useToast();

  return (
    <>
      <Outlet />

      {isDevEnvironment() && false && <TanStackRouterDevtools />}
    </>
  );
}
