import PolHeading from "@/components/polComponents/PolHeading";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSkeleton from "@/components/polComponents/PolSkeleton";
import { useAuth } from "@/customHooks/auth";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useLocalStorageState } from "@/customHooks/useLocalStorageState";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { Tenant } from "@/sdk/entities/auth/Tenant";
import { TenantUserAccess } from "@/sdk/entities/auth/TenantUserAccess";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useQueryClient } from "@tanstack/react-query";
import { AuthLoginBanner } from "../../profile/login/AuthLoginBanner";
import polLogo from "@/assets/images/pol-logo-horizontal-dark.png";
import { sort } from "@/sdk/utils/arrayUtils";
import PolSpinner from "@/components/polComponents/PolSpinner";

export default function ActiveTenantPage() {
  const queryClient = useQueryClient();
  const navigate = usePolNavigate();
  const { user } = useAuth();
  const userAccesses = useDbQuery(TenantUserAccess, `WHERE c.UserId = "${user?.id}"`, { enabled: isUsable(user) });
  const tenants = useDbQuery(Tenant, `WHERE c.id IN ["${userAccesses.data?.map((x) => x.TenantId).join('","')}"]`, {
    enabled: isUsable(userAccesses),
  });

  const [activeTenantId, setActiveTenantId] = useLocalStorageState("atid", null);
  const [redirect] = useSearchParamState("redirect", undefined);

  async function makeActiveTenant(tenantId: string) {
    setActiveTenantId(tenantId);
    await queryClient.invalidateQueries();
    navigate({ to: redirect ?? "/" });
  }

  if (userAccesses.data?.length === 0) {
    navigate({ to: "/auth/register" });
  }
  if (tenants.data?.length === 1) {
    setActiveTenantId(tenants.data[0].id);
    navigate({ to: redirect ?? "/" });
  }

  return (
    <PolRequestPresenter
      request={[tenants, userAccesses]}
      ready={tenants.data?.length > 1}
      onSuccess={() => (
        <section className="h-screen bg-white dark:bg-gray-900 lg:py-0">
          <div className="grid h-screen max-md:grid-rows-[auto_1fr_auto] lg:grid-cols-2">
            <div className="hidden bg-primary-600 max-md:block">
              <a href="#" className="mb-4 flex items-center text-2xl font-semibold text-white ">
                <img src={polLogo} />
              </a>
            </div>
            <div className="mx-auto flex h-full w-full items-center p-5 ">
              <div className="w-full">
                <PolHeading className="mt-5 text-center">Organizations</PolHeading>
                <PolHeading size={4} className="mb-5 text-center">
                  Log into one of organizations
                </PolHeading>
                <div className="flex h-[20dvh] w-full flex-col items-start border-t">
                  {sort(tenants.data, (x) => x.Name)?.map((x) => (
                    <>
                      <div
                        onClick={() => makeActiveTenant(x.id)}
                        className="h-10 w-full cursor-pointer border-b p-2 hover:bg-background-100"
                      >
                        {x.Name}
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
            <AuthLoginBanner></AuthLoginBanner>
          </div>
        </section>
      )}
    />
  );
}
