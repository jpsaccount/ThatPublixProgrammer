import { Tenant } from "@/sdk/entities/auth/Tenant";
import { authContext } from "@/sdkSetup/AuthContext";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { User } from "firebase/auth";
import { User as PolUser } from "@/sdk/entities/core/User";

import { useCallback, useContext, useMemo } from "react";
export function useAuth(): AuthContext {
  const { user, isLoading, access, identity, tenant } = useContext(authContext);

  const hasAccess = useCallback(
    (key: string) => {
      const accessGiven = access?.Access;
      if (isUsable(accessGiven) === false) return false;
      if (accessGiven.includes("owner")) return true;
      if (accessGiven.includes(key)) return true;
      if (accessGiven.includes("admin_" + key)) return true;

      return false;
    },
    [access]
  );

  return useMemo(
    () => ({
      user,
      hasAccess,
      identity: identity,
      activeTenant: tenant,
      isLoading,
    }),
    [user, hasAccess, identity, tenant, isLoading]
  );
}

export interface AuthContext {
  user: PolUser;
  hasAccess: (key: string) => boolean;
  identity: User;
  activeTenant: Tenant;
  isLoading: boolean;
}
