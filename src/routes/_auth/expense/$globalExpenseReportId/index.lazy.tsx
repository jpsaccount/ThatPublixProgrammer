import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ExpenseReportListView from "@/views/expenseReports/ExpenseReportListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/expense/$globalExpenseReportId/")({
  component: withAccess(ExpenseReportListView, AccessKeys.ExpenseReport),
});

export const useExpenseReportListViewParams = Route.useParams;
