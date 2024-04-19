import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ExpenseReportPdfView from "@/views/expenseReports/ExpenseReportPdfView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/expense/$globalExpenseReportId/$expenseReportId/print")({
  component: withAccess(ExpenseReportPdfView, AccessKeys.ExpenseReport),
});

export const useExpenseReportPdfViewParams = Route.useParams;
