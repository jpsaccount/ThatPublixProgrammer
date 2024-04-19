import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useLocalStorageState } from "@/customHooks/useLocalStorageState";
import { Tenant } from "@/sdk/entities/auth/Tenant";
import { TenantUserAccess } from "@/sdk/entities/auth/TenantUserAccess";
import { User } from "@/sdk/entities/core/User";
import { User as FireBaseUser } from "firebase/auth";
import { onAuthFailed, onSignOut } from "@/sdk/services/AuthService";
import { addDefaultSdkHeader } from "@/sdk/services/Http/HttpRequestHandler";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { user } from "@nextui-org/react";
import { getAuth } from "firebase/auth";
import { createContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export class AuthContext {
  user?: User | null | undefined = undefined;
  isLoading: boolean = true;
  access: TenantUserAccess;
  identity: FireBaseUser;
  tenant: Tenant;
}

export const authContext = createContext(new AuthContext());

export function AuthContextProvider({ children }) {
  const [authState, setAuthState] = useState(new AuthContext());

  const [currentUser, isLoadingAuth] = useAuthState(getAuth());
  const [activeTenantId, setActiveTenantId] = useLocalStorageState("atid", null);

  useEffect(() => {
    setAuthState((pre) => ({ ...pre, identity: currentUser }));
  }, [currentUser]);

  const userRequest = useDbQueryFirst(User, `WHERE c.IdentityIds CONTAINS "${currentUser?.uid}"`, {
    enabled: isUsable(currentUser?.uid),
  });

  const tenantRequest = useDbQueryFirst(Tenant, `WHERE c.Id = "${activeTenantId}"`, {
    enabled: isUsable(activeTenantId) && isLoadingAuth === false,
  });

  useEffect(() => {
    setAuthState((pre) => ({ ...pre, tenant: tenantRequest.data }));
  }, [tenantRequest.data]);

  const accessQuery = useDbQueryFirst(
    TenantUserAccess,
    `WHERE c.UserId = "${userRequest.data?.id}" AND c.TenantId = "${activeTenantId}"`,
    {
      enabled: isUsable(userRequest.data?.id) && isUsable(activeTenantId),
    },
  );

  useLayoutEffect(() => {
    currentUser?.getIdToken(true).then((x) => {
      addDefaultSdkHeader("Authorization", "Bearer " + x);
    });
  }, [currentUser]);

  useLayoutEffect(() => {
    addDefaultSdkHeader("X-Active-TenantId", activeTenantId);
  }, [activeTenantId]);

  useEffect(() => {
    if (accessQuery.isSuccess && tenantRequest.isSuccess) {
      setAuthState((pre) => ({ ...pre, access: accessQuery.data }));
    }
  }, [accessQuery.data, tenantRequest.isSuccess]);

  useEffect(() => {
    if (userRequest.isSuccess && isUsable(activeTenantId) === false) {
      setAuthState((pre) => ({ ...pre }));
    }
    onAuthFailed(() => {
      setAuthState((pre) => ({ ...pre, user: null }));
    });
    onSignOut(() => {
      setAuthState((pre) => ({ ...pre, user: null }));
      setActiveTenantId(null);
    });
  }, [userRequest.data]);

  useEffect(() => {
    if (isUsable(user) && isUsable(currentUser) === false) {
      setAuthState((pre) => ({ ...pre, user: null }));
    }
    if (isUsable(userRequest.data)) {
      setAuthState((pre) => ({ ...pre, user: userRequest.data }));
    }
    if (isUsable(currentUser) === false) {
      setAuthState((pre) => ({ ...pre, user: null }));
    }
  }, [userRequest.data, currentUser]);

  const authStateWithLoading = useMemo(
    () => ({
      ...authState,
      user: userRequest.data ?? null,
      tenant: tenantRequest.data,
      isLoading:
        (accessQuery.isFetching === false &&
          tenantRequest.isFetching === false &&
          userRequest.isFetching === false &&
          isLoadingAuth === false) === false,
    }),
    [accessQuery.isFetching, tenantRequest.isFetching, userRequest.isFetching, isLoadingAuth, authState],
  );

  return <authContext.Provider value={authStateWithLoading}>{children}</authContext.Provider>;
}
