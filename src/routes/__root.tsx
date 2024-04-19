import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/customHooks/auth";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { AuthService } from "@/sdk";
import usePolSdk from "@/sdk/hooks/usePolSdk";
import { onAuthFailed, onSignOut } from "@/sdk/services/AuthService";
import { onSdkRequestErrors } from "@/sdk/services/Http/HttpRequestHandler";
import { getService } from "@/sdk/services/serviceProvider";
import { isDevEnvironment } from "@/sdk/utils/devUtils";
import NotFoundView from "@/views/NotFoundView";
import { createRootRouteWithContext, Outlet, ScrollRestoration } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AxiosError } from "axios";
import { useEffect } from "react";

interface MyRouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
  notFoundComponent: NotFoundView,
});

function Root() {
  usePolSdk();
  const navigation = usePolNavigate();
  const { toast } = useToast();

  useEffect(() => {
    onSdkRequestErrors(async (error) => {
      if (error instanceof AxiosError) {
        if (error.message.includes("invalid_token")) return;
        const wasUnauthorizedError = error.response?.status == 401;
        if (
          wasUnauthorizedError &&
          error.message.includes("Tenant access was not provided") &&
          location.pathname.includes("register") === false
        ) {
          navigation({ to: "/auth/register" });
        } else if (wasUnauthorizedError === false) {
          toast({ title: error.code, description: error.message });
        }
      } else {
        toast({ title: "Error", description: JSON.stringify(error) });
      }
      return false;
    });

    onSignOut(() => {
      if (location.pathname.includes("login") === false) {
        navigation({
          to: "/auth/login",
          search: { redirect: location.pathname + location.search },
        });
      }
    });

    const authService = getService(AuthService);
    authService.initAsync();
  }, []);
  return (
    <>
      <Outlet />

      {isDevEnvironment() && false && <TanStackRouterDevtools />}
    </>
  );
}
