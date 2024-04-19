import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolCheckbox from "@/components/polComponents/PolCheckbox";
import PolHeading from "@/components/polComponents/PolHeading";
import PolInput from "@/components/polComponents/PolInput";
import PolMutationErrorPresenter from "@/components/polComponents/PolMutationErrorPresenter";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Seo } from "@/components/polComponents/Seo";
import { useAlert } from "@/contexts/AlertContext";
import { useDbDelete } from "@/customHooks/sdkHooks/useDbDelete";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { useClientDetailViewParams } from "@/routes/_auth/clients/$id.lazy";
import { Client } from "@/sdk/entities/project/Client";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";

export default function ClientDetailView() {
  const { id } = useClientDetailViewParams();
  const navigate = usePolNavigate();
  const clientRequest = useDbQueryFirst(Client, `WHERE c.id = "${id}"`);
  const saveClientMutation = useDbUpsert(Client);
  const deleteMutation = useDbDelete(Client);
  const [selectedClient, setSelectedClient] = useState<Client>(null);

  const alert = useAlert();

  useEffect(() => setSelectedClient(clientRequest.data), [clientRequest.data]);

  async function deleteClient() {
    const result = await alert.showAlert({
      title: "Confirmation",
      description:
        "Are you sure you want to delete this client. Deleting this client will remove all projects and anything associated to the projects. This action cannot be undone.",
    });
    if (result === false) return;
    await deleteMutation.mutateAsync(clientRequest.data);
    navigate({ to: "/clients" });
  }

  return (
    <>
      <Seo title={clientRequest.data?.CompanyName ?? "Client Editor"} />
      <PolRequestPresenter
        ready={isUsable(selectedClient)}
        request={clientRequest}
        onSuccess={() => (
          <div className="mx-auto grid min-w-[50%] grid-flow-row gap-2 px-2 md:w-fit">
            <div className="mb-2 mt-1 grid grid-flow-col">
              <div className="w-fit">
                <Dropdown
                  className="z-[10000] w-fit"
                  arrowIcon={false}
                  inline
                  label={<PolIcon data-testid="moreOptionsIcon" name="MoreVertical"></PolIcon>}
                >
                  <Dropdown.Item className="rounded-lg" onClick={deleteClient}>
                    Delete
                  </Dropdown.Item>
                </Dropdown>
              </div>
              <PolHeading size={3}>Client Editor</PolHeading>
            </div>
            <PolInput
              label="Company Name"
              value={selectedClient.CompanyName}
              onValueChanged={(value) => setSelectedClient((x) => ({ ...x, CompanyName: value }))}
            />

            <PolInput
              label="Abbreviation"
              value={selectedClient.Abbreviation}
              onValueChanged={(value) => setSelectedClient((x) => ({ ...x, Abbreviation: value }))}
            />

            <PolInput
              label="Display Name"
              value={selectedClient.DisplayName}
              onValueChanged={(value) => setSelectedClient((x) => ({ ...x, DisplayName: value }))}
            />

            <PolCheckbox
              value={selectedClient.ShowInTimesheet}
              onValueChanged={(value) => setSelectedClient((x) => ({ ...x, ShowInTimesheet: value }))}
            >
              Show In Timesheet
            </PolCheckbox>

            <PolMutationErrorPresenter mutation={saveClientMutation} />
            <PolButton className="mx-auto w-fit" onClick={() => saveClientMutation.mutateAsync(selectedClient)}>
              Save
            </PolButton>
          </div>
        )}
      />
    </>
  );
}
