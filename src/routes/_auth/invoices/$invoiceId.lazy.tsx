import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import InvoiceDetailView from "@/views/invoices/InvoiceDetailView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/invoices/$invoiceId")({
  component: withAccess(InvoiceDetailView, AccessKeys.Invoicing),
});

export const useInvoiceDetailViewParams = Route.useParams;
