import { useAuth } from "@/customHooks/auth";
import React, { ReactNode } from "react";
import PolSpinner from "./polComponents/PolSpinner";
import { AccessKeys } from "@/sdk/enums/AccessKeys";

interface Props {
  accessRequired?: (typeof AccessKeys)[keyof typeof AccessKeys];
  fallback?: ReactNode;
  children: ReactNode;
}

export default function AuthSection({ accessRequired, children, fallback }: Props) {
  const { user, isLoading, hasAccess } = useAuth();
  return isLoading ? (
    <PolSpinner IsLoading={true} />
  ) : hasAccess(accessRequired) ? (
    children
  ) : fallback ? (
    fallback
  ) : (
    <></>
  );
}
