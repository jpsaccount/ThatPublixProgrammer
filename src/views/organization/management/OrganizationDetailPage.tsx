import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolText from "@/components/polComponents/PolText";
import { useAuth } from "@/customHooks/auth";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Tenant } from "@/sdk/entities/auth/Tenant";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect, useState } from "react";

export default function OrganizationDetailPage() {
  const { activeTenant } = useAuth();
  const tenantRequest = useDbQueryFirst(Tenant, `WHERE c.id = '${activeTenant.id}'`, {
    enabled: isUsable(activeTenant),
  });

  const saveTenant = useDbUpsert(Tenant);
  const navigate = usePolNavigate();

  const [tenant, setTenant] = useState<Tenant>(null);
  useEffect(() => {
    setTenant(tenantRequest.data);
  }, [tenantRequest.data]);
  return (
    <div>
      <PolRequestPresenter
        request={[tenantRequest]}
        ready={isUsable(tenant)}
        onSuccess={() => (
          <div className="grid grid-flow-row p-5">
            <PolButton className="w-fit" onClick={() => navigate({ to: "/organization/access" })}>
              <div className="grid grid-flow-col gap-3">
                <PolIcon name="Lock" stroke="white" />
                <PolText>Access</PolText>
              </div>
            </PolButton>
            <PolInput
              label="Name"
              value={tenant.Name}
              onValueChanged={(value) => setTenant((x) => ({ ...x, Name: value }))}
            />
            <PolInput
              label="Description"
              value={tenant.Description}
              onValueChanged={(value) => setTenant((x) => ({ ...x, Description: value }))}
            />
            <PolMutationErrorPresenter mutation={saveTenant} />
            <PolButton className="m-2 w-fit" onClick={() => saveTenant.mutateAsync(tenant)}>
              Save
            </PolButton>
          </div>
        )}
      ></PolRequestPresenter>
    </div>
  );
}
