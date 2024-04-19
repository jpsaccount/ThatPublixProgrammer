import MultiForm from "@/components/MultiForm";
import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Seo } from "@/components/polComponents/Seo";
import useDbCaching from "@/customHooks/sdkHooks/useDbCaching";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Client } from "@/sdk/entities/project/Client";
import { getEntityService } from "@/sdk/services/getEntityService";
import { useState } from "react";
import ClientDetailForm from "./NewClientViews/ClientDetailForm";
import ClientSummaryForm from "./NewClientViews/ClientSummaryForm";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useQueryTemplate from "@/customHooks/sdkHooks/useQueryTemplate";
import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";

export default function ClientView() {
  const { query, searchText, setSearchText } = useQueryTemplate(
    "Order By c.DisplayName ASC",
    "Order by c.DisplayName ASC",
  );
  const clientRequest = usePartialDbQuery(Client, query, 50);

  const navigate = usePolNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [newClient, setNewClient] = useState(new Client());

  const upsert = useDbUpsert(Client);
  const { setToQuery: addToCache } = useDbCaching();

  function updateClient(project: Partial<Client>) {
    setNewClient((x) => {
      return { ...x, ...project };
    });
  }

  const createClient = async () => {
    try {
      await upsert.mutateAsync(newClient);
      await clientRequest.refetch();
      addToCache(Client, newClient);
      navigate({ to: "/clients/$id", params: { id: newClient.id } });
      setNewClient(new Client());
      return true;
    } catch (e) {
      console.log(e);
    }
  };

  const validateCreateProjectStep = async (currentStepIndex: number) => {
    if (currentStepIndex === 0) {
      const clientsWithCompanyName = await getEntityService(Client).getFirstWhereAsync(
        `WHERE c.CompanyName = "${newClient.CompanyName}"`,
      );

      if (clientsWithCompanyName.isSuccess() && clientsWithCompanyName.data) {
        return "Company name " + newClient.CompanyName + " already exists.";
      }

      const clientsWithName = await getEntityService(Client).getFirstWhereAsync(
        `WHERE c.DisplayName = "${newClient.DisplayName}"`,
      );

      if (clientsWithName.isSuccess() && clientsWithName.data) {
        return "Display name " + newClient.DisplayName + " already exists.";
      }
    }
  };

  return (
    <>
      <Seo title="Clients" />
      <PolModal isOpen={isOpen} onOpenChanged={setIsOpen}>
        <MultiForm
          onSuccess={createClient}
          validateStep={validateCreateProjectStep}
          className="h-[500px] min-w-[50px]"
          views={[
            ["Detail", <ClientDetailForm client={newClient} updateClient={updateClient} />],
            ["Summary", <ClientSummaryForm client={newClient} updateClient={updateClient} />],
          ]}
        />
      </PolModal>
      <PolRequestPresenter
        request={clientRequest}
        onSuccess={() => (
          <EntityTableWithPagination<Client>
            emptyView={"No clients exists. Create your first one!"}
            onRowClicked={(x) => navigate({ to: "/clients/$id", params: { id: x.id } })}
            request={clientRequest}
            searchText={searchText}
            onSearchTextChanged={setSearchText}
            dense={false}
            addons={[
              <PolButton className=" mx-2" data-testid={"create-button"} onClick={() => setIsOpen(true)}>
                <PolIcon name="UserPlus" stroke="white"></PolIcon>
              </PolButton>,
            ]}
            columns={[
              { id: "DisplayName" },
              {
                id: "ShowInTimesheet",
                label: "Show in timesheet",
                renderCell: (x) => x.ShowInTimesheet && <PolIcon className="ml-14" name={"CalendarCheck"} />,
              },
            ]}
            orderByProperty="DisplayName"
            mobileRowTemplate={(x, index, props) => {
              return (
                <>
                  <div
                    className="mobile-card-item grid grid-flow-col"
                    onClick={() => navigate({ to: "/clients/$id", params: { id: x.id } })}
                    tabIndex={-1}
                    key={x.id}
                    {...props}
                  >
                    <div className="grid grid-flow-row text-left ">
                      <span className="font-medium">{x.DisplayName}</span>
                    </div>
                    <div className="my-auto ml-auto mr-0 text-right">
                      {x.ShowInTimesheet && <PolIcon size="2rem" isIconFilled={true} name={"Eye"} />}
                    </div>
                  </div>
                </>
              );
            }}
          />
        )}
      />
    </>
  );
}
