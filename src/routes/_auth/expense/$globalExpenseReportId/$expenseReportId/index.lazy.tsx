import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ExpenseListView from "@/views/expenseReports/ExpenseListView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/expense/$globalExpenseReportId/$expenseReportId/")({
  component: withAccess(ExpenseListView, AccessKeys.ExpenseReport),
});

export const useExpenseListViewParams = Route.useParams;
