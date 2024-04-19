// ProtectedRouteWrapper.tsx
import { useAuth } from "@/customHooks/auth";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import NotFoundView from "@/views/NotFoundView";
import { Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import React, { Suspense, useLayoutEffect } from "react";
import PolSpinner from "./polComponents/PolSpinner";
import usePolNavigate from "@/customHooks/usePOLNavigate";
interface Props {
  component: React.ComponentType<any>;
  access: (typeof AccessKeys)[keyof typeof AccessKeys];
}

export function withAccess(component: React.ComponentType<any>, access: (typeof AccessKeys)[keyof typeof AccessKeys]) {
  return () => <AuthRoute component={component} access={access} />;
}

const AuthRoute: React.FC<Props> = ({ component: RouteComponent, access }) => {
  const { isLoading, hasAccess, identity: user, activeTenant } = useAuth();
  const navigate = usePolNavigate();

  const loadingComponent = (
    <div className="center-Items flex h-[calc(100dvh-120px)]">
      <PolSpinner IsLoading={true} className=" m-auto" />
    </div>
  );
  if (isUsable(user) == false || isLoading) {
    return loadingComponent;
  } else if (hasAccess(access) === false) {
    if (isUsable(activeTenant)) {
      return (
        <Suspense fallback={loadingComponent}>
          <NotFoundView></NotFoundView>
        </Suspense>
      );
    } else if (isUsable(user) === false) {
      navigate({ to: "/auth/login" });
    }
  }
  return (
    <Suspense fallback={loadingComponent}>
      <motion.div
        className="h-full "
        initial={{ opacity: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
      >
        <RouteComponent />
      </motion.div>
    </Suspense>
  );
};
