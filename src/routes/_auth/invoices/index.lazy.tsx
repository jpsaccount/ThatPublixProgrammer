import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import InvoiceListView from "@/views/invoices/InvoiceListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/invoices/")({
  component: withAccess(InvoiceListView, AccessKeys.Invoicing),
});
