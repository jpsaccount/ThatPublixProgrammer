import EntityTableWithPagination from "@/components/polComponents/EntityTableViews/EntityTableWithPagination";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { usePartialDbQuery } from "@/customHooks/sdkHooks/usePartialDbQuery";
import useSearchParamQueryTemplate from "@/customHooks/sdkHooks/useSearchParamQueryTemplate";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { Invoice } from "@/sdk/entities/billing/Invoice";
import { InvoiceStatus } from "@/sdk/enums/InvoiceStatus";
import NewInvoiceModal from "./NewInvoiceModal";
import useDbCaching from "@/customHooks/sdkHooks/useDbCaching";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { delay } from "@/sdk/utils/asyncUtils";

export default function InvoiceListView() {
  const { query, searchText, setSearchText } = useSearchParamQueryTemplate(
    `WHERE c.InvoiceNumber CONTAINS "{0}" OR c.InternalName CONTAINS "{0}" Order By c.InvoiceNumber DESC`,
    "Order By c.InvoiceNumber DESC",
  );
  const { invalidateQueries } = useDbCaching();
  const invoicesRequest = usePartialDbQuery(Invoice, query, 50);
  const navigate = usePolNavigate();

  const handleCreateInvoice = (invoice: Invoice) => {
    invalidateQueries(Invoice);
  };
  const router = useRouter();

  useEffect(() => {
    delay(1000).then((x) =>
      router.preloadRoute({
        to: "/invoices/$invoiceId",
        params: { invoiceId: "2" },
      }),
    );
  }, []);
  return (
    <PolRequestPresenter
      onSuccess={() => {
        return (
          <EntityTableWithPagination
            addons={[<NewInvoiceModal onInvoiceCreated={handleCreateInvoice}></NewInvoiceModal>]}
            showSearch={true}
            searchText={searchText}
            onSearchTextChanged={setSearchText}
            request={invoicesRequest}
            onRowClicked={(x) => navigate({ to: "/invoices/$invoiceId", params: { invoiceId: x.id } })}
            orderByProperty={"InvoiceNumber"}
            columns={[
              {
                width: 140,
                id: "DueDate",
                label: "Due Date",
                idGetter: (x) => x.DueDate?.format("MM-DD-YYYY"),
              },
              {
                width: 200,
                id: "InvoiceNumber",
                label: "Invoice Number",
              },
              { id: "InternalName", label: "Internal Name" },
              { id: "Status", idGetter: (x) => InvoiceStatus[x.Status] },
              {
                id: "InvoiceTotal",
                label: "Invoice Total",
                idGetter: (x) => toUsdString(x.InvoiceTotal),
              },
            ]}
            pageTitle="Invoices"
          ></EntityTableWithPagination>
        );
      }}
      request={invoicesRequest}
    ></PolRequestPresenter>
  );
}
