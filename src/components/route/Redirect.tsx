// ProtectedRouteWrapper.tsx
import { useLayoutEffect } from "react";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import PolSpinner from "../polComponents/PolSpinner";
import { AnyRoute, FileRoutesByPath } from "@tanstack/react-router";
export function redirect(path: any) {
  return () => <Redirect path={path} />;
}

function Redirect({ path }: { path: AnyRoute }) {
  const navigate = usePolNavigate();

  useLayoutEffect(() => {
    navigate({ to: path as any, params: (pre) => ({ ...pre }), search: (pre) => ({ ...pre }), replace: true });
  }, []);
  const loadingComponent = (
    <div className="center-Items flex h-[calc(100dvh-120px)]">
      <PolSpinner IsLoading={true} className=" m-auto" />
    </div>
  );

  return loadingComponent;
}
