import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ExpenseReportPage from "@/views/expenseReports/reportPage/ExpenseReportPage";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/expense/report")({
  component: withAccess(ExpenseReportPage, AccessKeys.ExpenseReport),
});
